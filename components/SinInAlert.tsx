"use client";

import { useSignInContext } from "@/components/hooks/useSignIn";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Button,
} from "@nextui-org/react";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const SignInAlert = () => {
  const router = useRouter();
  const {
    onClose: alertOnClose,
    onOpen: alertOnOpen,
    isOpen: alertIsOpen,
  } = useDisclosure();
  const { isOpen: signInIsOpen, onOpen: signInOnOpen } = useSignInContext();

  useEffect(() => {
    alertOnOpen();
  }, [alertOnOpen]);

  useEffect(() => {
    if (signInIsOpen) return;
    alertOnOpen();
  }, [signInIsOpen, alertOnOpen]);

  return (
    <Modal
      isOpen={alertIsOpen}
      onClose={alertOnClose}
      isDismissable={false}
      isKeyboardDismissDisabled
      hideCloseButton
    >
      <ModalContent>
        <ModalHeader>
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" />
            <span>Unauthorized</span>
          </div>
        </ModalHeader>
        <ModalBody>You need to be signed in to visit this page.</ModalBody>
        <ModalFooter className="flex items-center justify-between">
          <Button variant="ghost" radius="sm" onPress={() => router.back()}>
            Back
          </Button>
          <Button
            variant="ghost"
            radius="sm"
            onPress={() => {
              alertOnClose();
              signInOnOpen();
            }}
          >
            Sign In
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
