"use client";

import { Form, FormField, FormItem } from "@/components/ui/form";
import { updateImage } from "@/lib/actions/user.actions";
import { useUploadThing } from "@/lib/uploadthing";
import { isBase64Image } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Avatar,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { User } from "@prisma/client";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const formSchema = z.object({
  profile_photo: z.string().url(),
});

export const UploadImageModal = ({
  user,
  isOpen,
  onOpenChange,
  onClose,
}: {
  user: User | null | undefined;
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
}) => {
  const [updating, setUpdating] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("media");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profile_photo: user?.image!,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setUpdating(true);
    const blob = values.profile_photo;

    const hasImageChanged = isBase64Image(blob);
    if (hasImageChanged) {
      const imgRes = await startUpload(files);

      if (imgRes && imgRes[0].fileUrl) {
        values.profile_photo = imgRes[0].fileUrl;
      }
    }

    const response = await updateImage({
      email: user?.email!,
      image: values.profile_photo,
    });
    if (response) {
      toast.success("Updated image.");
      onClose();
    } else toast.error("Something went wrong.");
    setUpdating(false);
  };

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();
    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onclose) => (
            <>
              <ModalHeader className="border-b border-b-default-200">
                Update Avatar
              </ModalHeader>
              <ModalBody className="px-0">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                      control={form.control}
                      name="profile_photo"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-center">
                            <div className="w-fit">
                              <Avatar
                                src={field.value}
                                alt="Profile picture"
                                radius="full"
                                className="w-28 h-28 z-0"
                              />
                            </div>
                            <div className="w-full px-4">
                              <Input
                                type="file"
                                classNames={{
                                  inputWrapper: "bg-transparent",
                                }}
                                onChange={(e) => handleImage(e, field.onChange)}
                              />
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                    <div className="border-t border-t-default-200 flex items-center justify-end gap-2 pt-3 pr-3 mt-2">
                      <Button variant="light" type="button" onPress={onclose}>
                        Cancel
                      </Button>
                      <Button
                        variant="ghost"
                        type="submit"
                        isLoading={updating}
                        color="success"
                      >
                        {updating ? "Saving" : "Save"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
