"use client";

import { NewPostModal } from "../modals/new-post";
import { useSignInContext } from "@/components/hooks/useSignIn";
import { colors } from "@/constants";
import { getCategory } from "@/lib/actions/category.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { cn } from "@/lib/utils";
import {
  Avatar,
  Button,
  Pagination,
  Tooltip,
  Link,
  useDisclosure,
  Divider,
} from "@nextui-org/react";
import { Category, Post, Topic } from "@prisma/client";
import { ChevronLeft, ChevronRight, Pin, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
          underline="hover"
          href={`/topics/${topic.id}`}
          className="w-full text-left col-span-5"
        >
          <div
            className={cn({
              "flex items-center gap-2": topic.pinned,
            })}
          >
            {topic.pinned && <Pin className="w-4 h-4" />}
            {topic.title}
          </div>
        </Link>
        <div className="text-center col-span-2">{topic?.posts?.length}</div>
        <div className="w-full col-span-5 text-right">
          <UserInfo id={topic?.posts[0]?.userId} />
        </div>
      </div>
    </div>
  );
};

export const CategoryPageComponent = ({
  params,
  searchParams,
}: {
  params: { name: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  if (!searchParams.page) redirect("?page=1");

  const { name } = params;
  const { onOpen: signInOnOpen, setDismissable } = useSignInContext();

  const router = useRouter();
  const { data: session } = useSession();
  const [switchingPages, setSwitchingPages] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { data: topics, isLoading: topicsLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await getCategory(name),
  });

  const page = Number(searchParams.page);
  // @ts-ignore
  const pages = Math.ceil(topics?.topics?.length / TOPICS_PER_PAGE);

  const items = useMemo(() => {
    const start = (page - 1) * TOPICS_PER_PAGE;
    const end = start + TOPICS_PER_PAGE;

    return topics?.topics.slice(start, end).reverse();
  }, [page, topics]);

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
                  radius="sm"
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
                  classNames={{
                    item: "bg-transparent",
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
          <div className="overflow-y-auto">
            {items?.length == 0 ? (
              <div className="text-center text-default-600">No Topics.</div>
            ) : (
              <>
                {items
                  ?.filter((e) => e.pinned)
                  .map((topic) => (
                    <TopicComponent key={topic.id} topic={topic} />
                  ))}
                {items && items?.filter((e) => e.pinned).length > 0 && (
                  <Divider className="my-2" />
                )}
                {items
                  ?.filter((e) => !e.pinned)
                  .map((topic) => (
                    <TopicComponent key={topic.id} topic={topic} />
                  ))}
              </>
            )}
          </div>
          <div className="fixed max-md:bottom-16 bottom-3 right-3">
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
        </>
      ) : (
        <div className="text-center font-semibold text-lg">
          Waiting for authentication.
        </div>
      )}
      <NewPostModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        session={session}
        cat={params.name}
      />
    </>
  );
};
