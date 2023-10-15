"use client";

import { NewPostModal } from "@/components/actions/new-post-modal";
import { useSignInContext } from "@/components/hooks/useSignIn";
import { colors } from "@/constants";
import { getCategory } from "@/lib/actions/category.actions";
import { getTopics } from "@/lib/actions/topics.actions";
import { getUserByAny } from "@/lib/actions/user.actions";
import {
  Avatar,
  Button,
  Chip,
  Pagination,
  Tooltip,
  Link as UILink,
  useDisclosure,
} from "@nextui-org/react";
import { Category, Post, Topic } from "@prisma/client";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";

const TOPICS_PER_PAGE = 10;

type TTopic = {
  posts: Post[];
  categories: Category[];
} & Topic;

const UserInfo = ({ id }: { id: string }) => {
  const { data: user } = useQuery({
    queryKey: ["user_info__topics"],
    queryFn: async () => await getUserByAny({ query: { where: { id } } }),
  });

  return (
    <UILink href={`/profile/${user?.name}`}>
      <Avatar
        src={user?.image as string}
        showFallback
        isBordered
        color={
          user?.role
            ? (colors[user.role] as "primary" | "success" | "default")
            : "default"
        }
      />
    </UILink>
  );
};

const TopicsPage = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  if (!searchParams.page) redirect("/topics?page=1");

  const { onOpen: signInOnOpen, setDismissable } = useSignInContext();

  const router = useRouter();
  const { data: session } = useSession();
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [switchingPages, setSwitchingPages] = useState(false);
  const [topics, setTopics] = useState<TTopic[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [category, setCategory] = useState<Category | null>(null);

  const page = Number(searchParams.page);
  const pages = Math.ceil(topics.length / TOPICS_PER_PAGE);

  const fetchCat = useCallback(async () => {
    const res = await getCategory(String(searchParams.category));
    res && setCategory(res);
  }, [searchParams]);

  const fetcher = useCallback(async () => {
    setTopicsLoading(true);
    const res = searchParams.category
      ? await getTopics(String(searchParams.category))
      : await getTopics();
    res && setTopics(res);
    setTopicsLoading(false);
  }, [searchParams.category]);

  const items = useMemo(() => {
    const start = (page - 1) * TOPICS_PER_PAGE;
    const end = start + TOPICS_PER_PAGE;

    return topics.slice(start, end).reverse();
  }, [page, topics]);

  useEffect(() => {
    if (!session || !session.user) return;
    fetcher();
    if (searchParams.category) fetchCat();
  }, [fetcher, searchParams, session, fetchCat]);

  useEffect(() => {
    if (!session?.user) {
      setDismissable(false);
      signInOnOpen();
    }
  }, [session, setDismissable, signInOnOpen]);

  return (
    <>
      {session?.user ? (
        <>
          <div className="my-4">
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
              {!topicsLoading && (
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
            {items.map((topic) => (
              <div
                className="flex items-center justify-between w-full"
                key={topic.id}
              >
                <div className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-300/50 dark:hover:bg-neutral-800/50 transition-colors">
                  <Link href={`/topics/${topic.id}`}>
                    <div className="pb-2 hover:underline">{topic.title}</div>
                    <div className="flex gap-2 items-center">
                      {topic.categories.map((cat) => (
                        <Chip
                          variant="bordered"
                          size="sm"
                          as={UILink}
                          href={`?page=${searchParams.page}&category=${cat.name}`}
                          style={{
                            color: cat.color as string,
                            borderColor: cat.color as string,
                          }}
                          className="text-xs"
                          key={cat.id}
                        >
                          {cat.name}
                        </Chip>
                      ))}
                    </div>
                  </Link>
                  <div className="text-center">{topic.posts.length}</div>
                  <div className="text-right">
                    <UserInfo id={topic?.posts[0]?.userId} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="fixed bottom-14 right-3">
            <Tooltip
              content="New Topic"
              showArrow
              placement="left"
              radius="sm"
              size="sm"
              color="secondary"
            >
              <Button
                isIconOnly
                size="sm"
                radius="full"
                variant="ghost"
                color="secondary"
                onPress={onOpen}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </Tooltip>
          </div>
          <NewPostModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            session={session}
            cat={category}
          />
        </>
      ) : (
        <div className="text-center font-semibold text-lg">
          Waiting for authentication.
        </div>
      )}
    </>
  );
};

export default TopicsPage;
