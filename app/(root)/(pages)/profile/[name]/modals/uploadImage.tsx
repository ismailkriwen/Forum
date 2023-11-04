"use client";

import { SingleImageDropzone } from "@/components/SingleImageDropzone";
import { updateImage } from "@/lib/actions/user.actions";
import { useEdgeStore } from "@/lib/edgestore";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { User } from "@prisma/client";
import { useState } from "react";
import { toast } from "react-toastify";

export const UploadImageModal = ({
  user,
  isOpen,
  onOpenChange,
}: {
  user: User | null | undefined;
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const [updating, setUpdating] = useState(false);
  const [file, setFile] = useState<File>();
  const { edgestore } = useEdgeStore();

  const updateAvatar = async (onClose: () => void) => {
    if (!file) return;
    setUpdating(true);
    const res = await edgestore.publicFiles.upload({ file });
    const response = await updateImage({
      email: user?.email!,
      image: res.url,
    });
    if (response) {
      toast.info("Updated image.");
      onClose();
    } else toast.error("Something went wrong.");
    setUpdating(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} radius="sm">
        <ModalContent>
          {(onclose) => (
            <>
              <ModalHeader className="border-b border-b-default-200">
                Update Avatar
              </ModalHeader>
              <ModalBody className="px-0">
                <div className="w-full">
                  <SingleImageDropzone
                    width={200}
                    height={200}
                    value={user?.image && !file ? user?.image : file}
                    onChange={(file) => setFile(file)}
                    className="mx-auto rounded-full"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  type="button"
                  radius="sm"
                  onPress={onclose}
                >
                  Cancel
                </Button>
                <Button
                  variant="ghost"
                  type="submit"
                  radius="sm"
                  isLoading={updating}
                  color="secondary"
                  onPress={() => updateAvatar(onclose)}
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
