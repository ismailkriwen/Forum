"use client";

import { createCategory } from "@/lib/actions/category.actions";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  Textarea,
  Tooltip,
} from "@nextui-org/react";
import { Role } from "@prisma/client";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export const NewModal = ({
  isOpen,
  onOpenChange,
  mutate,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  mutate: () => Promise<void>;
}) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#000000");
  const [description, setDescription] = useState("");
  const [ranks, setRanks] = useState<Role[]>([]);

  const create = async (close: () => void) => {
    if (!name || !color) return;
    try {
      setLoading(true);
      const res = await createCategory({ name, color, description, ranks });
      if (res?.error) toast.error(res.error);
      else {
        close();
        mutate();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center flex-col gap-2">
                Create Category
              </ModalHeader>
              <ModalBody className="overflow-y-auto max-h-96">
                <div className="flex items-center justify-between gap-5 max-md:flex-col">
                  <div className="flex items-start justify-between gap-3 flex-col md:flex-col">
                    <div className="text-default-400">Name</div>
                    <div className="text-default-400">Color</div>
                    <div className="text-default-400">Description</div>
                    <div className="text-default-400 flex items-center gap-2">
                      Ranks{" "}
                      <Tooltip
                        content="Allowed groups to this specific category."
                        placement="top"
                        showArrow
                        size="sm"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </Tooltip>
                    </div>
                  </div>
                  <div className="flex items-center justify-start gap-3 flex-col">
                    <Input
                      name="name"
                      value={name}
                      radius="sm"
                      size="sm"
                      variant="bordered"
                      onValueChange={setName}
                    />
                    <Input
                      type="color"
                      name="color"
                      size="sm"
                      radius="sm"
                      value={color}
                      variant="bordered"
                      onValueChange={setColor}
                      classNames={{
                        inputWrapper: "border-none",
                      }}
                    />
                    <Textarea
                      variant="bordered"
                      size="sm"
                      radius="sm"
                      value={description}
                      onValueChange={setDescription}
                    />
                    <div className="flex items-center justify-between w-full gap-2">
                      <div>
                        {Object.keys(Role).map((role, i) => (
                          <div key={i}>{role}</div>
                        ))}
                      </div>
                      <div className="flex flex-col">
                        {Object.keys(Role).map((role, i) => (
                          <Switch
                            key={i}
                            defaultSelected={ranks.includes(role as Role)}
                            onChange={({ target }) => {
                              const arr = target.checked
                                ? [...ranks, role]
                                : ranks.filter((e) => e != role);
                              setRanks(arr);
                            }}
                            size="sm"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" size="sm" radius="sm" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  variant="ghost"
                  size="sm"
                  radius="sm"
                  isLoading={loading}
                  onPress={() => create(onClose)}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
