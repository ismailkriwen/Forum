"use client";

import { deletePost } from "@/lib/actions/posts.actions";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { TPost } from "../post";

export const DeleteModal = ({
  isOpen,
  onOpenChange,
  post,
  mutate,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  post: TPost;
  mutate: () => void;
}) => {
  const [deleting, setDeleting] = useState(false);

  const del = async (close: () => void) => {
    if (!post) return;
    setDeleting(true);
    const res = await deletePost(post.id);
    if (res) {
      mutate();
      close();
    }
    setDeleting(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onclose) => (
          <>
            <ModalHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>
                  Delete{" "}
                  <span className="text-default-500">{post?.user?.name}</span>
                  &apos;s post
                </span>
              </div>
            </ModalHeader>
            <ModalBody>
              <Textarea
                radius="sm"
                variant="bordered"
                placeholder="Content"
                value={post?.content}
                readOnly
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onclose}>
                Cancel
              </Button>
              <Button
                color="danger"
                variant="ghost"
                onPress={() => del(onclose)}
                isLoading={deleting}
              >
                {deleting ? "Deleting" : "Delete"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
