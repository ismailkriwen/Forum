"use client";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { Send } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getCategories } from "@/lib/actions/category.actions";
import { createPost } from "@/lib/actions/posts.actions";
import { createTopic } from "@/lib/actions/topics.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";

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
  cat?: Category | null;
}) => {
  const route = useRouter();
  const [creatingPost, setCreatingPost] = useState(false);
  const [fetchingCats, setFetchingCats] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categorySelected, setCategorySelected] = useState<Category | null>(
    null
  );

  const fetchCats = useCallback(async () => {
    setFetchingCats(true);
    const res = await getCategories();
    res && setCategories(res);
    setCategorySelected(res[0]);
    setFetchingCats(false);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { title, content } = values;
    if (!categorySelected) return toast.error("No category's selected");
    if (!session?.user?.email) return toast.error("Not authenticated");
    setCreatingPost(true);
    const topic = await createTopic({ categoryId: categorySelected.id, title });
    if (!topic) toast.error("Something went wrong.");
    const post = await createPost({
      topicId: topic.id,
      content,
      creator: session?.user?.email,
    });
    if (!post) toast.error("Something went wrong.");
    toast.success("Post created successfully.");
    route.push(`/topics/${topic.id}`);
    setCreatingPost(false);
  };

  useEffect(() => {
    if (!isOpen) return;
    fetchCats();
  }, [isOpen, fetchCats]);

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
                    {!cat &&
                      (fetchingCats ? (
                        <div className="w-full h-7 bg-neutral-600 animate-pulse rounded-md"></div>
                      ) : (
                        <Select
                          defaultSelectedKeys={[categories[0]?.name || ""]}
                          labelPlacement="outside"
                          radius="sm"
                          aria-label="category-selection"
                          onChange={({ target }) =>
                            setCategorySelected(
                              categories.find(
                                (e) => e.name === target.value
                              ) as Category
                            )
                          }
                        >
                          {categories?.map((category) => (
                            <SelectItem
                              key={category?.name as string}
                              value={category?.name as string}
                            >
                              {category?.name}
                            </SelectItem>
                          ))}
                        </Select>
                      ))}

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel />
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
                          <FormLabel />
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
                    {fetchingCats ? (
                      <div className="w-28 h-8 rounded-lg bg-neutral-600 animate-pulse"></div>
                    ) : (
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
                    )}
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
