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
import { Toaster, toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { replyToPost } from "@/lib/actions/posts.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import { TPost, type TTopic } from "./post";

const formSchema = z.object({
  content: z.string().nonempty({ message: "Content can't be empty" }),
});

export const QuoteModal = ({
  isOpen,
  onOpenChange,
  onClose,
  mutate,
  session,
  topic,
  post: quotedPost,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  mutate: () => void;
  session: Session | null;
  topic: TTopic | undefined;
  post: TPost;
}) => {
  const [creatingPost, setCreatingPost] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { content } = values;
    if (!session?.user?.email) return toast.error("Not authenticated");
    setCreatingPost(true);
    if (!topic) toast.error("Something went wrong.");
    const post = await replyToPost({
      topicId: topic?.id as string,
      content,
      creator: session?.user?.email,
      postId: quotedPost?.id as string,
    });
    if (!post) toast.error("Something went wrong.");
    toast.success("Post created successfully.");
    mutate();
    onClose();
    form.resetField("content");
    setCreatingPost(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <Toaster position="bottom-right" richColors expand={true} />
        <ModalContent>
          {(onclose) => (
            <>
              <ModalHeader>
                <div>
                  Reply to{" "}
                  <span className="text-default-400">
                    {quotedPost.user.name}
                  </span>
                </div>
              </ModalHeader>
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
