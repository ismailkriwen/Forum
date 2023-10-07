"use client";

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
  ExternalLink,
  Eye,
  EyeOff,
  Quote,
  Reply,
  Settings,
  ThumbsUp,
  Trash,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Toaster, toast } from "sonner";
import { DeleteModal } from "./actions/delete";
import { EditModal } from "./actions/edit";
import { QuoteModal } from "./quote";
import { ReplyModal } from "./reply";
import { useSignInContext } from "@/components/hooks/useSignIn";
import { useIsMobile } from "@/components/hooks/useIsMobile";

export type TPost = {
  user: User;
  likes: Like[];
} & Post;

export type TTopic = {
  posts: TPost[];
} & Topic;

const POSTS_PER_PAGE = 10;

const QuotePost = ({ id }: { id: string }) => {
  const [post, setPost] = useState<TPost>();
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    const res = await getPost(id);
    // @ts-expect-error
    res && setPost(res);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <div className="px-6 py-4 rounded border border-gray-400/80 mt-2">
      {loading ? (
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
              <div className={`${textColors[post?.user.role as string]}`}>
                {post?.user.name}
              </div>
            </div>
            <div className="italic max-md:hidden">{`${
              user_date(post?.createdAt as Date).date
            } at ${user_date(post?.createdAt as Date).time}`}</div>
          </div>
          <pre className="pt-3 break-words max-w-full">{post?.content}</pre>
        </>
      )}
    </div>
  );
};

const TopicsIdPage = ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const { id } = params;
  const { onOpen: signInOnOpen, setDismissable } = useSignInContext();
  const isMobile = useIsMobile();
  if (!searchParams.page) redirect(`/topics/${id}?page=1`);
  const { data: session } = useSession();
  const router = useRouter();
  const [topic, setTopic] = useState<TTopic>();
  const [fetching, setFetching] = useState(false);
  const [switchingPages, setSwitchingPages] = useState(false);
  const [selectedPost, setSelectedPost] = useState<TPost>();
  const page = Number(searchParams.page);
  const pages = Math.ceil((topic?.posts.length || 0) / POSTS_PER_PAGE);
  const [selectedPostToEdit, setSelectedPostToEdit] = useState<TPost>();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
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

  const fetcher = useCallback(async () => {
    setFetching(true);
    const res = await getTopic(id);
    res && setTopic(res);
    setFetching(false);
  }, [id]);

  const like = async ({ id, user }: { id: string; user: string }) => {
    const post = topic?.posts.filter((e) => e.id === id)[0];
    const liked = post?.likes?.filter((e) => e?.userId === post?.userId) || [];
    if (liked.length > 0) return toast.error("Already liked post.");
    const res = await likePost({ id, user });
    if (res) {
      toast.success("Post liked successfully");
      fetcher();
    } else toast.error("Something went wrong.");
  };

  const hide_post = async (id: string) => {
    if (!session) return;
    const res = await hidePost({ id, email: session.user.email as string });
    if (res) {
      toast.success("Successfully hided post.");
      fetcher();
    } else toast.error("Something went wrong.");
  };

  const unhide_post = async (id: string) => {
    if (!session) return;
    const res = await unHidePost({ id, email: session.user.email as string });
    if (res) {
      toast.success("Successfully unhided post.");
      fetcher();
    } else toast.error("Something went wrong.");
  };

  const items = useMemo(() => {
    const start = (page - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;

    return topic?.posts.slice(start, end);
  }, [page, topic?.posts]);

  useEffect(() => {
    if (!session?.user) {
      setDismissable(false);
      signInOnOpen();
      return;
    } else fetcher();
  }, [session, fetcher, signInOnOpen, setDismissable]);

  return (
    <>
      {session?.user ? (
        <>
          <div className="my-4">
            <Toaster position="bottom-right" richColors expand={true} />
            <div className="bg-neutral-200 dark:bg-neutral-900 flex items-center justify-between px-8 py-2 mt-2">
              <div>{topic?.title}</div>
              <Button
                startContent={<Reply className="w-4 h-4" />}
                variant="light"
                size="sm"
                onPress={onOpen}
              >
                Reply
              </Button>
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
              {!fetching && (
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
          <div className="z-0 overflow-y-auto">
            {items?.map((post, index) => (
              <div
                className={`flex items-strech gap-2 mt-2 ${
                  post.hidden && "border-2 border-danger"
                }`}
                key={post.id}
              >
                {index % 2 === 0 && (
                  <div
                    key={index}
                    className="max-md:hidden text-center flex items-center justify-between gap-2 flex-col px-4 py-2 min-w-[200px] bg-neutral-100 dark:bg-neutral-950"
                  >
                    <div className={`${textColors[post.user.role]}`}>
                      <div>{post.user.name}</div>
                      <div className="text-small text-default-400">
                        {post.user.role}
                      </div>
                    </div>
                    <Avatar
                      src={post.user.image as string}
                      showFallback
                      color={
                        colors[post.user.role] as
                          | "primary"
                          | "success"
                          | "default"
                      }
                      isBordered
                      className="w-20 h-20 text-large my-2"
                      classNames={{
                        icon: "dark:bg-default-900",
                      }}
                    />
                    <Button
                      as={Link}
                      showAnchorIcon
                      variant="ghost"
                      href={`/profile/${post.user.name}`}
                      target="_blank"
                    >
                      Visit Profile
                    </Button>
                  </div>
                )}
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
                  <div className="py-2 px-6">
                    {!fetching && post.reply && (
                      <QuotePost id={post.postId as string} />
                    )}
                    <pre className="break-words pt-2">{post.content}</pre>
                  </div>
                </div>
                {index % 2 !== 0 && (
                  <div
                    key={index}
                    className="max-md:hidden text-center flex items-center justify-between gap-2 flex-col px-4 py-2 min-w-[200px] bg-neutral-100 dark:bg-neutral-950"
                  >
                    <div className={`${textColors[post.user.role]}`}>
                      <div>{post.user.name}</div>
                      <div className="text-small text-default-400">
                        {post.user.role}
                      </div>
                    </div>
                    <Avatar
                      src={post.user.image as string}
                      showFallback
                      color={
                        colors[post.user.role] as
                          | "primary"
                          | "success"
                          | "default"
                      }
                      isBordered
                      className="w-20 h-20 text-large my-2"
                      classNames={{
                        icon: "bg-default-900",
                      }}
                    />
                    <Button
                      as={Link}
                      variant="ghost"
                      href={`/profile/${post.user.name}`}
                      target="_blank"
                      startContent={
                        <ExternalLink className="w-4 h-4 rotate-[270deg]" />
                      }
                    >
                      Visit Profile
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <ToastContainer
            position="bottom-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <ReplyModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onClose={onClose}
            session={session}
            topic={topic}
            mutate={fetcher}
          />
          <QuoteModal
            isOpen={quoteIsOpen}
            onOpenChange={quoteOnOpenChange}
            onClose={quoteOnClose}
            mutate={fetcher}
            session={session}
            topic={topic}
            post={selectedPost as TPost}
          />
          <EditModal
            isOpen={editIsOpen}
            onOpenChange={editOnOpenChange}
            post={selectedPostToEdit}
            mutate={fetcher}
          />
          <DeleteModal
            isOpen={deleteIsOpen}
            onOpenChange={deleteOnOpenChange}
            post={selectedPostToEdit as TPost}
            mutate={fetcher}
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

export default TopicsIdPage;
