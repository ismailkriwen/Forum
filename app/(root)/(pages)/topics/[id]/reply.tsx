"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { createPost } from "@/lib/actions/posts.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Session } from "next-auth";
import { useForm } from "react-hook-form";
import z from "zod";
import { type TTopic } from "./post";
import { notifyFollowers } from "@/lib/actions/notifications";

const formSchema = z.object({
  content: z.string().nonempty({ message: "Content can't be empty" }),
});

export const ReplyModal = ({
  isOpen,
  onOpenChange,
  onClose,
  session,
  topic,
  mutate,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  session: Session | null;
  topic: TTopic | undefined | null;
  mutate: () => void;
}) => {
  const [creatingPost, setCreatingPost] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { content } = values;
    if (!session?.user?.email)
      return toast.error("Not authenticated", { position: "bottom-right" });
    setCreatingPost(true);
    if (!topic)
      toast.error("Something went wrong.", { position: "bottom-right" });
    const post = await createPost({
      topicId: topic?.id!,
      content,
      creator: session?.user?.email,
    });
    if (!post)
      toast.error("Something went wrong.", { position: "bottom-right" });
    else {
      await notifyFollowers({ post });
      toast.success("Post created successfully.", { position: "bottom-right" });
    }
    mutate();
    onClose();
    form.resetField("content");
    setCreatingPost(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onclose) => (
            <>
              <ModalHeader>Create new post</ModalHeader>
              <Form {...form}>
                <form
                  className="space-y-4"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <ModalBody>
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              variant="bordered"
                              radius="sm"
                              label="Content"
                              autoFocus
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </ModalBody>
                  <ModalFooter className="flex items-center">
                    <Button type="button" onPress={onclose} variant="light">
                      Close
                    </Button>

                    <Button
                      variant="ghost"
                      color="success"
                      startContent={
                        !creatingPost && <Send className="w-4 h-4" />
                      }
                      type="submit"
                      isLoading={creatingPost}
                    >
                      Create
                    </Button>
                  </ModalFooter>
                </form>
              </Form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
