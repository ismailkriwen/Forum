"use client";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { Send } from "lucide-react";
import { useState } from "react";
import { Toaster } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CreateTopic } from "@/lib/actions/topics.actions";
import { toast } from "react-toastify";
import { notifyFollowers } from "@/lib/actions/notifications";

const formSchema = z.object({
  title: z.string().nonempty({ message: "Subject can't be empty" }),
  content: z.string().nonempty({ message: "Content can't be empty" }),
});

export const NewPostModal = ({
  isOpen,
  onOpenChange,
  session,
  cat,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  session: Session | null;
  cat: string;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { title, content } = values;
    try {
      setIsLoading(true);
      const post = await CreateTopic({ title, content, cat });
      if (!post) toast.error("Something went wrong.");
      else {
        toast.info("Redirecting to post");
        router.push(`/topics/${post.topicId}`);
        await notifyFollowers({ post });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" expand={false} richColors />
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
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              variant="bordered"
                              radius="sm"
                              label="Subject"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                      color="secondary"
                      startContent={!isLoading && <Send className="w-4 h-4" />}
                      type="submit"
                      isLoading={isLoading}
                    >
                      {isLoading ? "Creating" : "Create"}
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
