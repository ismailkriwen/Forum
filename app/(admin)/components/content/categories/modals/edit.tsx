"use client";

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
import { TCategory } from "../categories";
import { updateColor, updateName } from "@/lib/actions/category.actions";

export const EditModal = ({
  isOpen,
  onOpenChange,
  category,
  mutate,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  category: TCategory;
  mutate: () => Promise<void>;
}) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(category?.name as string);
  const [color, setColor] = useState(category?.color as string);
  const [error, setError] = useState("");

  const update = async (close: () => void) => {
    setLoading(true);
    if (name !== "" && name !== category.name) {
      const res = await updateName({
        name: category?.name as string,
        newName: name,
      });
      if (res?.error) setError(res.error);
      else {
        close();
        mutate();
      }
    }

    if (color != "" && color !== category.color) {
      const res = await updateColor({ name: category?.name as string, color });
      if (res?.error) setError(res.error);
      else {
        close();
        mutate();
      }
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
                      variant="bordered"
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
                  isDisabled={color == category.color && name == category.name}
                  onPress={() => update(onClose)}
                >
                  {loading ? "Saving" : "Save"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
