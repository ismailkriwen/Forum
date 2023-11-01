"use client";
import { deleteUser } from "@/lib/actions/user.actions";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { type User as TUser } from "@prisma/client";
import { useState } from "react";
import { AiFillWarning } from "react-icons/ai";

export const DeleteModal = ({
  isOpen,
  onOpenChange,
  user,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  user: TUser | null | undefined;
}) => {
  const [loading, setLoading] = useState(false);
  const deleteAction = async (close: () => void) => {
    if (!user?.name || !user?.email) return;
    setLoading(true);
    await deleteUser({ name: user?.name, email: user?.email });
    close();
    setLoading(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          body: "py-6",
          backdrop: "bg-red-500/10 backdrop-opacity-20",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center flex-col gap-2">
                <div className="flex items-center gap-2">
                  <AiFillWarning className="text-danger h-6 w-6" />
                  Confirm to delete account
                </div>
                <div className="flex items-center gap-2 text-small text-default-400">
                  {user?.name} - {user?.email}
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
                  variant="ghost"
                  radius="sm"
                  isLoading={loading}
                  onPress={() => deleteAction(onClose)}
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
