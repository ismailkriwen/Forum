"use client";

import { useIsMobile } from "@/components/hooks/useIsMobile";
import { MiniProfile } from "@/components/mini-profile";
import { colors, textColors } from "@/constants";
import {
  getPost,
  hidePost,
  likePost,
  unHidePost,
} from "@/lib/actions/posts.actions";
import { getTopic } from "@/lib/actions/topics.actions";
import { user_date } from "@/lib/date";
import { getUsernameById } from "@/lib/helpers";
import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Pagination,
  Spinner,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { Like, Post, Role, Topic, User } from "@prisma/client";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  EyeOff,
  Quote,
  Reply,
  Settings,
  ThumbsUp,
  Trash,
} from "lucide-react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { DeleteModal } from "./actions/delete";
import { EditModal } from "./actions/edit";
import { QuoteModal } from "./quote";
import { ReplyModal } from "./reply";
import { SettingsModal } from "./settings";

export type TPost = {
  user: User;
  likes: Like[];
} & Post;

export type TTopic =
  | ({
      posts: TPost[];
    } & Topic)
  | null;

const POSTS_PER_PAGE = 10;

const QuotePost = ({ id }: { id: string }) => {
  const { data: post, isLoading } = useQuery({
    queryKey: ["topic_post__id"],
    queryFn: async () => await getPost(id),
  });

  return (
    <div className="px-6 py-4 rounded border border-gray-400/80 mt-2">
      {isLoading ? (
        <div className="mt-2 w-full h-full flex items-center justify-center">
          <Spinner color="default" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center max-md:justify-between gap-4">
              <Avatar
                src={post?.user.image as string}
                showFallback
                color={
                  /* @ts-ignore */
                  colors[post?.user.role] as "primary" | "success" | "default"
                }
                size="sm"
                isBordered
                classNames={{
                  icon: "dark:bg-default-900",
                }}
              />
              {/* @ts-ignore */}
              <Link
                className={`${textColors[post?.user.role!]}`}
                href={`/profile/${post?.user.name}`}
              >
                {post?.user.name}
              </Link>
            </div>
            <div className="italic max-md:hidden">{`${
              user_date(post?.createdAt as Date).date
            } at ${user_date(post?.createdAt as Date).time}`}</div>
          </div>
          <div className="pt-3 break-words max-w-full">{post?.content}</div>
        </>
      )}
    </div>
  );
};

export const TopicsIdPageComponent = ({
  session,
  params,
  searchParams,
}: {
  session: Session | null;
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const { id } = params;
  const isMobile = useIsMobile();
  const router = useRouter();
  const [switchingPages, setSwitchingPages] = useState(false);
  const [selectedPost, setSelectedPost] = useState<TPost>();
  const page = Number(searchParams.page);
  const [selectedPostToEdit, setSelectedPostToEdit] = useState<TPost>();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { data: topic, isLoading } = useQuery({
    queryKey: ["topic__id"],
    queryFn: async () => await getTopic(id),
    enabled: !!id,
  });

  const { mutate } = useMutation({
    mutationFn: async () => await getTopic(id),
  });

  const pages = Math.ceil((topic?.posts.length || 0) / POSTS_PER_PAGE);
  const {
    isOpen: quoteIsOpen,
    onOpen: quoteOnOpen,
    onOpenChange: quoteOnOpenChange,
    onClose: quoteOnClose,
  } = useDisclosure();

  const {
    isOpen: editIsOpen,
    onOpen: editOnOpen,
    onOpenChange: editOnOpenChange,
  } = useDisclosure();

  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onOpenChange: deleteOnOpenChange,
  } = useDisclosure();

  const {
    isOpen: settingsIsOpen,
    onOpen: settingsOnOpen,
    onOpenChange: settingsOnOpenChange,
  } = useDisclosure();

  const like = async ({ id, user }: { id: string; user: string }) => {
    const post = topic?.posts.filter((e) => e.id === id)[0];
    const liked = post?.likes?.filter((e) => e?.userId === post?.userId) || [];
    if (liked.length > 0) return toast.error("Already liked post.");
    const res = await likePost({ id, user });
    if (res) {
      toast.success("Post liked successfully");
      mutate();
    } else toast.error("Something went wrong.");
  };

  const hide_post = async (id: string) => {
    const res = await hidePost({ id, email: session?.user.email! });
    if (res) {
      toast.success("Successfully hided post.");
      mutate();
    } else toast.error("Something went wrong.");
  };

  const unhide_post = async (id: string) => {
    const res = await unHidePost({ id, email: session?.user.email! });
    if (res) {
      toast.success("Successfully unhided post.");
      mutate();
    } else toast.error("Something went wrong.");
  };

  const items = useMemo(() => {
    const start = (page - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;

    return topic?.posts.slice(start, end);
  }, [page, topic?.posts]);

  return (
    <>
      {session?.user ? (
        <>
          <div className="my-4">
            <div className="bg-neutral-200 dark:bg-neutral-900 flex items-center justify-between px-8 py-2 mt-2">
              <div>{topic?.title}</div>
              <div className="space-x-2">
                {isMobile ? (
                  <Button
                    isIconOnly
                    variant="flat"
                    size="sm"
                    radius="sm"
                    onPress={onOpen}
                  >
                    <Reply className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    startContent={<Reply className="w-4 h-4" />}
                    variant="flat"
                    size="sm"
                    radius="sm"
                    onPress={onOpen}
                  >
                    Reply
                  </Button>
                )}
                {session?.user?.groups.includes(Role.Moderator) && (
                  <Button
                    isIconOnly
                    size="sm"
                    radius="sm"
                    variant="ghost"
                    onPress={settingsOnOpen}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="bg-neutral-200 dark:bg-neutral-900 flex items-center gap-2 px-8 py-2 mt-2">
              <Button
                isDisabled={Number(searchParams.page) === 1 || switchingPages}
                isIconOnly
                size="sm"
                radius="sm"
                variant="ghost"
                onClick={() => {
                  if (Number(searchParams.page) === 1) return;
                  setSwitchingPages(true);
                  router.push(`?page=${Number(searchParams.page) - 1}`);
                  setSwitchingPages(false);
                }}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {!isLoading && (
                <Pagination
                  radius="full"
                  size="sm"
                  isCompact
                  showShadow
                  isDisabled={switchingPages}
                  initialPage={Number(searchParams.page)}
                  page={Number(searchParams.page)}
                  total={pages}
                  onChange={(e) => {
                    setSwitchingPages(true);
                    router.push(`?page=${e}`);
                    setSwitchingPages(false);
                  }}
                />
              )}
              <Button
                isDisabled={
                  Number(searchParams.page) === pages || switchingPages
                }
                isIconOnly
                size="sm"
                radius="sm"
                variant="ghost"
                onClick={() => {
                  if (Number(searchParams.page) === pages || switchingPages)
                    return;
                  setSwitchingPages(true);
                  router.push(`?page=${Number(searchParams.page) + 1}`);
                  setSwitchingPages(false);
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="z-0 overflow-y-auto pb-20">
            {items?.map((post, index) => (
              <div
                className={`flex items-strech gap-2 mt-2 ${
                  post.hidden && "border-2 border-danger"
                }`}
                key={post.id}
              >
                {index % 2 === 0 && <MiniProfile email={post.user.email!} />}
                <div
                  className="bg-neutral-100 dark:bg-neutral-950 px-6 py-2 w-full flex flex-col"
                  key={post.id}
                >
                  <div className="px-6 py-2 flex items-center justify-between text-small">
                    <div className={`md:hidden ${textColors[post.user.role]}`}>
                      {post.user.name}
                    </div>
                    <div className="italic max-md:hidden">{`${
                      user_date(post.createdAt).date
                    } at ${user_date(post.createdAt).time}`}</div>
                    <div>
                      {isMobile ? (
                        <Tooltip
                          showArrow
                          radius="sm"
                          size="sm"
                          content="Like"
                          placement="top"
                        >
                          <Button
                            variant="ghost"
                            radius="sm"
                            size="sm"
                            onPress={() =>
                              like({
                                id: post.id,
                                user: session?.user.email as string,
                              })
                            }
                            isIconOnly
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </Button>
                        </Tooltip>
                      ) : (
                        <Tooltip
                          showArrow
                          radius="sm"
                          size="sm"
                          content="Like"
                          placement="top"
                        >
                          <Button
                            variant="ghost"
                            radius="sm"
                            size="sm"
                            onPress={() =>
                              like({
                                id: post.id,
                                user: session?.user.email as string,
                              })
                            }
                            className="inline-flex items-center md:gap-2"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span className="max-sm:hidden">
                              {post.likes.length}
                            </span>
                          </Button>
                        </Tooltip>
                      )}
                      <Tooltip
                        showArrow
                        radius="sm"
                        size="sm"
                        content="Quote"
                        placement="top"
                      >
                        <Button
                          isIconOnly
                          variant="ghost"
                          radius="sm"
                          size="sm"
                          className="mx-2 max-sm:mx-1"
                          onPress={() => {
                            setSelectedPost(post);
                            quoteOnOpen();
                          }}
                        >
                          <Quote className="w-4 h-4" />
                        </Button>
                      </Tooltip>
                      <Tooltip
                        showArrow
                        radius="sm"
                        content="Settings"
                        placement="top"
                      >
                        <Dropdown
                          radius="sm"
                          size="sm"
                          placement="bottom-end"
                          aria-label="edit-post"
                          showArrow
                        >
                          <DropdownTrigger>
                            <Button
                              isIconOnly
                              radius="sm"
                              variant="ghost"
                              size="sm"
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu aria-label="edit-post-menu">
                            {session?.user.email === post.user.email ||
                            session?.user.role === Role.Admin ? (
                              <DropdownItem
                                startContent={<Edit className="w-4 h-4" />}
                                onPress={() => {
                                  setSelectedPostToEdit(post);
                                  editOnOpen();
                                }}
                              >
                                Edit
                              </DropdownItem>
                            ) : (
                              <DropdownItem className="h-0 p-0"></DropdownItem>
                            )}
                            {session?.user?.role === Role.Admin ||
                            session?.user?.role === Role.Moderator ? (
                              post.hidden ? (
                                <DropdownItem
                                  startContent={<Eye className="w-4 h-4" />}
                                  showDivider
                                  onPress={() => unhide_post(post.id)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>UnHide</div>
                                    <Tooltip
                                      content={
                                        <span className="text-center">
                                          Hidden by <br />
                                          {getUsernameById(post.hiddenBy!)}
                                        </span>
                                      }
                                      placement="top"
                                      showArrow
                                      size="sm"
                                      radius="sm"
                                    >
                                      <AlertCircle className="w-4 h-4" />
                                    </Tooltip>
                                  </div>
                                </DropdownItem>
                              ) : (
                                <DropdownItem
                                  startContent={<EyeOff className="w-4 h-4" />}
                                  showDivider
                                  onPress={() => hide_post(post.id)}
                                >
                                  Hide
                                </DropdownItem>
                              )
                            ) : (
                              <DropdownItem className="h-0 p-0"></DropdownItem>
                            )}
                            {session?.user?.role === Role.Admin ||
                            session?.user?.role === Role.Moderator ||
                            post.user.email === session?.user?.email ? (
                              <DropdownItem
                                startContent={<Trash className="w-4 h-4" />}
                                color="danger"
                                className="text-danger-300"
                                onPress={() => {
                                  setSelectedPostToEdit(post);
                                  deleteOnOpen();
                                }}
                              >
                                Delete
                              </DropdownItem>
                            ) : (
                              <DropdownItem className="h-0 p-0"></DropdownItem>
                            )}
                          </DropdownMenu>
                        </Dropdown>
                      </Tooltip>
                    </div>
                  </div>
                  <Divider />
                  <div className="py-2 px-6 max-w-full">
                    {!isLoading && post.reply && (
                      <QuotePost id={post.postId!} />
                    )}
                    <div>{post.content}</div>
                  </div>
                </div>
                {index % 2 !== 0 && <MiniProfile email={post.user.email!} />}
              </div>
            ))}
          </div>
          <ReplyModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onClose={onClose}
            session={session}
            topic={topic}
            mutate={mutate}
          />
          <QuoteModal
            isOpen={quoteIsOpen}
            onOpenChange={quoteOnOpenChange}
            onClose={quoteOnClose}
            mutate={mutate}
            session={session}
            topic={topic}
            post={selectedPost as TPost}
          />
          <EditModal
            isOpen={editIsOpen}
            onOpenChange={editOnOpenChange}
            post={selectedPostToEdit}
            mutate={mutate}
          />
          <DeleteModal
            isOpen={deleteIsOpen}
            onOpenChange={deleteOnOpenChange}
            post={selectedPostToEdit as TPost}
            mutate={mutate}
          />
          <SettingsModal
            isOpen={settingsIsOpen}
            onOpenChange={settingsOnOpenChange}
            topicId={id}
          />
        </>
      ) : (
        <div className="text-xl text-center font-semibold">
          Waiting for authentication
        </div>
      )}
    </>
  );
};
