"use client";

import { editPostContent } from "@/lib/actions/posts.actions";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { TPost } from "../post";

import { toast } from "react-toastify";

export const EditModal = ({
  isOpen,
  onOpenChange,
  post,
  mutate,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  post: TPost | undefined;
  mutate: () => void;
}) => {
  const [updating, setUpdating] = useState(false);
  const [updatedContent, setContent] = useState(post?.content || "");

  const update = async (close: () => void) => {
    if (updatedContent === "" || updatedContent === post?.content || !post)
      return;
    setUpdating(true);
    const res = await editPostContent({ post, content: updatedContent });
    if (res) {
      toast.success("Updated successfully");
      mutate();
      close();
    } else toast.error("Something went wrong.");
    setUpdating(false);
  };

  useEffect(() => {
    if (post?.content === updatedContent || !post) return;
    setContent(post?.content);
  }, [post, updatedContent]);

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onclose) => (
            <>
              <ModalHeader className="text-default-500">Edit post</ModalHeader>
              <ModalBody>
                <Textarea
                  variant="bordered"
                  radius="sm"
                  label="Content"
                  value={updatedContent}
                  onChange={({ target }) => setContent(target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button onPress={onclose} variant="light">
                  Cancel
                </Button>
                <Button
                  variant="ghost"
                  color="primary"
                  isLoading={updating}
                  isDisabled={
                    updatedContent === "" || updatedContent === post?.content
                  }
                  onPress={() => update(onclose)}
                >
                  {updating ? "Saving" : "Save"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
