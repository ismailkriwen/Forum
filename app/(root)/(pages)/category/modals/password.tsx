"use client";

import { ValidateCategory } from "@/lib/actions/category.actions";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  category: string;
};

export const PasswordModal = ({ category }: Props) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");

  const validate = async () => {
    if (!password) return;
    try {
      setIsLoading(true);
      const response = await ValidateCategory({ name: category, password });

      if (response?.error) toast.error(response.error);
      else router.push(`/category/${category}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={true} radius="sm" size="sm" isDismissable={false}>
      <ModalContent>
        <ModalHeader>{category}</ModalHeader>
        <ModalBody>
          <Input
            type={isVisible ? "text" : "password"}
            variant="underlined"
            label="Password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={() => setIsVisible((prev) => !prev)}
              >
                {isVisible ? (
                  <Eye className="w-4 h-4 text-default-400 pointer-events-none" />
                ) : (
                  <EyeOff className="w-4 h-4 text-default-400 pointer-events-none" />
                )}
              </button>
            }
          />
        </ModalBody>
        <ModalFooter className="mt-2">
          <Button
            variant="ghost"
            radius="sm"
            color="secondary"
            isLoading={isLoading}
            onPress={validate}
          >
            {isLoading ? "Validating" : "Validate"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
