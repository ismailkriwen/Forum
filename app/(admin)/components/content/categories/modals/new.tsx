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
} from "@nextui-org/react";
import { useEffect, useState } from "react";

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
  const [error, setError] = useState("");

  const create = async (close: () => void) => {
    if (!name || !color) return;
    setLoading(true);
    const res = await createCategory({ name, color });
    if (res?.error) setError(res.error);
    else {
      close();
      mutate();
    }
    setLoading(false);
  };

  useEffect(() => {
    setError("");
  }, [name, color]);

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center flex-col gap-2">
                Create Category
              </ModalHeader>
              <ModalBody>
                <div className="flex items-center justify-between gap-5">
                  <div className="flex items-start justify-start gap-3 flex-col">
                    <div className="text-default-400">Name</div>
                    <div className="text-default-400">Color</div>
                  </div>
                  <div className="flex items-center justify-start gap-3 flex-col">
                    <Input name="name" value={name} onValueChange={setName} />
                    <Input
                      className="bg-transparent border-none"
                      type="color"
                      name="color"
                      value={color}
                      onValueChange={setColor}
                    />
                  </div>
                </div>
                {error && (
                  <div className="mt-2 text-danger text-center font-semibold">
                    {error}
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
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
