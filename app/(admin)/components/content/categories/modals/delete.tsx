"use client";

import { deleteCategory } from "@/lib/actions/category.actions";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useState } from "react";
import { AiFillWarning } from "react-icons/ai";
import { TCategory } from "../categories";

export const DeleteModal = ({
  isOpen,
  onOpenChange,
  category,
  mutate,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  category: TCategory | null;
  mutate: () => Promise<void>;
}) => {
  const [loading, setLoading] = useState(false);
  const deleteAction = async (close: () => void) => {
    if (!category?.name) return;
    setLoading(true);
    await deleteCategory({ id: category?.id });
    close();
    mutate();
    setLoading(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          body: "py-6",
          backdrop: "bg-red-500/10 backdrop-opacity-10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center flex-col gap-2">
                <div className="flex items-center gap-2">
                  <AiFillWarning className="text-danger h-5 w-5" />
                  Confirm to delete category
                </div>
                <div className="flex items-center gap-2 text-small text-default-400">
                  {category?.name}
                </div>
              </ModalHeader>
              <ModalBody>
                Your are doing a dangerous action. Once deleted, you can&apos;t
                restore it anymore.
              </ModalBody>
              <ModalFooter>
                <Button variant="light" radius="sm" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  isLoading={loading}
                  onPress={() => deleteAction(onClose)}
                  variant="ghost"
                  radius="sm"
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
