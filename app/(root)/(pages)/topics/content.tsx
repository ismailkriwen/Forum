"use client";

import { NewPostModal } from "@/components/actions/new-post-modal";
import { colors } from "@/constants";
import { getTopics } from "@/lib/actions/topics.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { cn } from "@/lib/utils";
import {
  Avatar,
  Button,
  Chip,
  Divider,
  Link,
  Pagination,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { Category, Post, Topic } from "@prisma/client";
import { ChevronLeft, ChevronRight, Pin, Plus } from "lucide-react";
import { Session } from "next-auth";
import { redirect, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";

const TOPICS_PER_PAGE = 10;

type TTopic = {
  posts: Post[];
  category: Category;
} & Topic;

const UserInfo = ({ id }: { id: string }) => {
  const { data: user } = useQuery({
    queryKey: ["user_info__topics"],
    queryFn: async () => await getUserById({ id }),
  });

  return (
    <Link href={`/profile/${user?.name}`}>
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
    </Link>
  );
};

const TopicComponent = ({ topic }: { topic: TTopic }) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="w-full grid grid-cols-12 place-content-between place-items-center px-6 py-4 hover:bg-slate-300/50 dark:hover:bg-neutral-800/50 transition-colors">
        <Link
          color="foreground"
          href={`/topics/${topic.id}`}
          className="flex flex-col col-span-5 justify-start items-start w-full"
        >
          <div
            className={cn("pb-2 hover:underline", {
              "flex items-center gap-2": topic.pinned,
            })}
          >
            {topic.pinned && <Pin className="w-4 h-4" />}
            {topic.title}
          </div>
          <div>
            <Chip
              variant="bordered"
              size="sm"
              as={Link}
              href={`/category/${topic.category.name}`}
              style={{
                color: topic.category.color!,
                borderColor: topic.category.color!,
              }}
              key={topic.category.id}
              className="ml-1 text-[10px]"
            >
              {topic.category.name}
            </Chip>
          </div>
        </Link>
        <div className="text-center col-span-2">{topic.posts.length}</div>
        <div className="text-right col-span-5 w-full">
          <UserInfo id={topic?.posts[0]?.userId} />
        </div>
      </div>
    </div>
  );
};

export const TopicsPageComponent = ({
  searchParams,
  session,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  session: Session | null;
}) => {
  const router = useRouter();
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [switchingPages, setSwitchingPages] = useState(false);
  const [topics, setTopics] = useState<TTopic[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const page = Number(searchParams.page);
  const pages = Math.ceil(topics.length / TOPICS_PER_PAGE);

  const fetcher = useCallback(async () => {
    setTopicsLoading(true);
    const res = await getTopics();
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
  }, [fetcher, searchParams, session]);

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
            {items
              .filter((e) => e.pinned)
              .map((topic) => (
                <TopicComponent key={topic.id} topic={topic} />
              ))}
            {items.filter((e) => e.pinned).length > 0 && (
              <Divider className="my-2" />
            )}
            {items
              .filter((e) => !e.pinned)
              .map((topic) => (
                <TopicComponent key={topic.id} topic={topic} />
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
            cat={null}
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
