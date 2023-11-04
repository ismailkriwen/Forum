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
import { useState } from "react";
import { Toaster, toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import { useQuery } from "react-query";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().nonempty({ message: "Topic title can't be empty" }),
  content: z.string().nonempty({ message: "Post content can't be empty" }),
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
  const [categorySelected, setCategorySelected] = useState<Category | null>(
    null
  );

  const { data: categories, isLoading: fetchingCats } = useQuery({
    queryKey: ["fetch_categories"],
    queryFn: async () => await getCategories(),
  });

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
                  <ModalBody className="max-h-96 overflow-y-auto">
                    {!cat &&
                      (fetchingCats ? (
                        <div className="w-full h-7 bg-neutral-600 animate-pulse rounded-md"></div>
                      ) : (
                        <Select
                          defaultSelectedKeys={[categories?.at(0)?.name || ""]}
                          disallowEmptySelection
                          labelPlacement="outside"
                          radius="sm"
                          aria-label="category-selection"
                          onChange={({ target }) =>
                            setCategorySelected(
                              categories?.find(
                                (e) => e.name === target.value
                              ) as Category
                            )
                          }
                        >
                          {categories?.map((category) =>
                            category.ranks.length > 0 ? (
                              category.ranks.some((e) =>
                                session?.user?.groups.includes(e)
                              ) && (
                                <SelectItem
                                  key={category?.name!}
                                  value={category?.name!}
                                >
                                  {category?.name}
                                </SelectItem>
                              )
                            ) : (
                              <SelectItem
                                key={category?.name!}
                                value={category?.name!}
                              >
                                {category?.name}
                              </SelectItem>
                            )
                          )}
                        </Select>
                      ))}

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              variant="bordered"
                              radius="sm"
                              label="Topic title"
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
                              label="Post content"
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
                        color="secondary"
                        startContent={
                          !creatingPost && <Send className="w-4 h-4" />
                        }
                        type="submit"
                        isLoading={creatingPost}
                      >
                        {creatingPost ? "Creating" : "Create"}
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
