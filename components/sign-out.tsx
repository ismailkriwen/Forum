"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { signOut } from "next-auth/react";
import { useSignOutContext } from "@/components/hooks/useSignOut";

export const SignOut = () => {
  const { isOpen, onOpenChange } = useSignOutContext();

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        backdrop:
          "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Are you absolutely sure?
            </ModalHeader>
            <ModalBody>
              This action cannot be undone. This will permanently sign you out
              from the website.
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                variant="bordered"
                onPress={() => signOut()}
              >
                Logout
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
