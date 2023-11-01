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
import { useState } from "react";
import { AiFillWarning } from "react-icons/ai";
import { IUser } from "../users";
import { toast } from "react-toastify";

export const DeleteModal = ({
  isOpen,
  onOpenChange,
  user,
  mutate,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  user: IUser | null;
  mutate: () => Promise<void>;
}) => {
  const [loading, setLoading] = useState(false);
  const deleteAction = async (close: () => void) => {
    if (!user?.name || !user?.email) return;
    setLoading(true);
    const res = await deleteUser({ name: user?.name, email: user?.email });
    close();
    mutate();
    if (res) toast.info(`Deleted user: ${user?.name}`);
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
                  <AiFillWarning className="text-danger h-5 w-5" />
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
                  radius="sm"
                  variant="ghost"
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
