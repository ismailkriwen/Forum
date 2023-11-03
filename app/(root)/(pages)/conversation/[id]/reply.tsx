"use client";
import { addMessage } from "@/lib/actions/conversation.actions";
import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { Send, XCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export const ReplyModal = ({
  isOpen,
  onOpenChange,
  id,
  title,
  mutate,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  id: string;
  title: string;
  mutate: () => void;
}) => {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const send = async (close: () => void) => {
    setIsLoading(true);
    const res = await addMessage({
      content,
      id,
      email: session?.user?.email!,
    });
    if (!res?.error) {
      close();
      setContent("");
      setError("");
      mutate();
    } else setError(res.error);
    setIsLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              Reply to <span className="pl-2 text-default-400">{title}</span>
            </ModalHeader>
            <Divider className="mb-2" />
            <ModalBody>
              <Textarea
                variant="bordered"
                label="Message"
                placeholder="Message content..."
                radius="sm"
                value={content}
                onValueChange={setContent}
              />
              {error && (
                <div className="py-2">
                  <div className="rounded px-4 py-2 border border-danger text-danger flex items-center gap-3">
                    <XCircle className="w-4 h-4" />
                    <div>{error}</div>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                variant="ghost"
                color="success"
                onPress={() => send(onClose)}
                startContent={!isLoading && <Send className="w-4 h-4" />}
                isLoading={isLoading}
              >
                Send
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
