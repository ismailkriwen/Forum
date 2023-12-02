"use client";

import { DeleteBadge } from "@/lib/actions/badge.actions";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { Badge, User } from "@prisma/client";
import { useState } from "react";
import { AiFillWarning } from "react-icons/ai";

type TBadge = {
  user: User;
} & Badge;

export const DeleteModal = ({
  isOpen,
  onOpenChange,
  badge,
  mutate,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  badge: TBadge | null;
  mutate: () => Promise<void>;
}) => {
  const [loading, setLoading] = useState(false);
  const deleteAction = async (close: () => void) => {
    if (!badge?.name) return;
    setLoading(true);
    await DeleteBadge({ id: badge?.id });
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
                  Confirm to delete badge
                </div>
                <div className="flex items-center gap-2 text-small text-default-400">
                  {badge?.name}
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
                  {loading ? "Deleting" : "Delete"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
