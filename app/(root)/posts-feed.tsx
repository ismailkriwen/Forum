"use client";

import { getCategories } from "@/lib/actions/category.actions";
import { latestPosts, postsByCategory } from "@/lib/actions/posts.actions";
import { user_date } from "@/lib/date";
import {
  Avatar,
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Link,
  Spinner,
} from "@nextui-org/react";
import { Category, Post, Topic, User } from "@prisma/client";
import { Check, ChevronDown, ExternalLink } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";

type TCategory = {
  id: string;
  name: string;
};

type TPost = {
  user: User;
  topic: {
    categories: Category[];
  } & Topic;
} & Post;

const Skeleton = () => {
  return (
    <div className="bg-neutral-100 dark:bg-neutral-900 rounded-md flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-neutral-600 animate-pulse w-14 aspect-square"></div>
        <div className="flex flex-col w-full h-full gap-2">
          <div className="w-20 h-3 bg-neutral-600 animate-pulse rounded-md"></div>
          <div className="w-5 h-2 bg-neutral-600 animate-pulse rounded-lg ml-2"></div>
        </div>
      </div>
      <div className="bg-neutral-600 animate-pulse rounded-md w-28 h-3"></div>
    </div>
  );
};

export const PostsFeed = () => {
  const [filterBy, setFilterBy] = useState("latest");
  const [posts, setPosts] = useState<TPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const query = { select: { id: true, name: true } };

  const { data: categories, isLoading: fetchingcategories } = useQuery({
    queryKey: ["categories", query],
    queryFn: async () => await getCategories(query),
    staleTime: Infinity,
  });

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res =
        filterBy === "latest"
          ? await latestPosts()
          : await postsByCategory(filterBy);
      res && setPosts(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [filterBy]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, filterBy]);

  return (
    <>
      <div className="flex items-center justify-end my-2 gap-2">
        <Dropdown placement="bottom-end" radius="sm" showArrow>
          <DropdownTrigger>
            <Button
              variant="bordered"
              radius="sm"
              endContent={
                fetchingcategories ? (
                  <Spinner color="default" size="sm" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )
              }
              className="capitalize"
              isDisabled={fetchingcategories}
            >
              {filterBy}
            </Button>
          </DropdownTrigger>
          <DropdownMenu variant="faded" aria-label="dropdown">
            <DropdownSection title="Main" showDivider>
              <DropdownItem
                onPress={() => setFilterBy("latest")}
                endContent={
                  filterBy === "latest" && <Check className="w-4 h-4" />
                }
              >
                Latest
              </DropdownItem>
              <DropdownItem
                onPress={() => setFilterBy("popular")}
                endContent={
                  filterBy === "popular" && <Check className="w-4 h-4" />
                }
              >
                Popular
              </DropdownItem>
            </DropdownSection>
            <DropdownSection title="Categories">
              {categories ? (
                categories?.map((category: Category) => {
                  return (
                    <DropdownItem
                      key={category.id}
                      onPress={() => setFilterBy(category?.name!)}
                      endContent={
                        filterBy == category.name && (
                          <Check className="w-4 h-4" />
                        )
                      }
                    >
                      {category.name}
                    </DropdownItem>
                  );
                })
              ) : (
                <DropdownItem textValue="placeholder"></DropdownItem>
              )}
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
        <Button
          as={Link}
          href="/topics?page=1"
          radius="sm"
          variant="ghost"
          endContent={<ExternalLink className="w-4 h-4" />}
        >
          Topics
        </Button>
      </div>
      <div className="flex gap-2 flex-col">
        {!isLoading || posts?.length == 0 ? (
          posts?.map((post: TPost) => (
            <div
              key={post.id}
              className="bg-neutral-100 dark:bg-neutral-900 rounded-md flex items-center justify-between px-6 py-4"
            >
              <div className="flex items-center gap-4">
                <div>
                  <Avatar
                    src={post.user.image!}
                    showFallback
                    radius="full"
                    size="md"
                    as={Link}
                    href={`/profile/${post.user?.name}`}
                  />
                </div>
                <div className="flex flex-col w-full h-full gap-1">
                  <Link href={`/topics/${post.topic.id}`} color="foreground">
                    {post.topic.title}
                  </Link>
                  {post.topic?.categories?.map((category: Category) => (
                    <div className="flex items-center gap-2" key={category.id}>
                      <Chip
                        variant="bordered"
                        size="sm"
                        style={{
                          color: category.color!,
                          borderColor: category.color!,
                        }}
                        className="text-xs"
                        key={category.id}
                      >
                        {category.name}
                      </Chip>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-default-400 italic text-small">
                {user_date(post.createdAt).date}
              </div>
            </div>
          ))
        ) : (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        )}
        {!posts ||
          (posts?.length === 0 && !isLoading && (
            <div className="text-default-700 text-center">
              No results found.
            </div>
          ))}
      </div>
    </>
  );
};
