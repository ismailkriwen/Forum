"use client";

import { getCategories } from "@/lib/actions/category.actions";
import { latestPosts } from "@/lib/actions/posts.actions";
import { user_date } from "@/lib/date";
import { cn } from "@/lib/utils";
import { Avatar, Link } from "@nextui-org/react";
import { Category } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";

const Skeleton = () => {
  return (
    <div className="bg-neutral-100 dark:bg-neutral-900 rounded-md flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-2">
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
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [fetchingCategories, setFetchingCategories] = useState(false);
  const query = useCallback(async () => {
    try {
      setFetchingCategories(true);
      const res = await getCategories();
      res && setCategories(res);
    } finally {
      setFetchingCategories(false);
    }
  }, []);

  useEffect(() => {
    query();
  }, [query]);

  const { data: posts, isLoading: isLoading } = useQuery({
    queryKey: ["latest_posts"],
    queryFn: async () => await latestPosts(),
  });

  return (
    <>
      <div className="grid gap-5 grid-cols-4">
        <div className="flex gap-2 flex-col col-span-3 max-lg:col-span-4">
          {!fetchingCategories ? (
            categories &&
            typeof categories.map === "function" &&
            categories?.map((category: Category) =>
              category.ranks.length == 0 ? (
                <div
                  key={category.id}
                  className={cn(
                    "bg-neutral-100 dark:bg-neutral-900 rounded-r-md flex items-center justify-between px-6 py-4 border-l-4"
                  )}
                  style={{
                    borderLeftColor: category.color!,
                  }}
                >
                  <div>
                    <Link
                      underline="hover"
                      size="md"
                      href={`/category/${category.name}`}
                      className="cursor-pointer"
                      style={{
                        color: category.color!,
                        borderColor: category.color!,
                      }}
                    >
                      {category.name}
                    </Link>
                    <div className="italic text-default-500 py-1 text-small">
                      {category.description}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {category.ranks.some((e) =>
                    session?.user?.groups.includes(e)
                  ) && (
                    <div
                      key={category.id}
                      className={cn(
                        "bg-neutral-100 dark:bg-neutral-900 rounded-r-md flex items-center justify-between px-6 py-4 border-l-4"
                      )}
                      style={{
                        borderLeftColor: category.color!,
                      }}
                    >
                      <div>
                        <Link
                          underline="hover"
                          size="md"
                          href={`/category/${category.name}`}
                          className="cursor-pointer"
                          style={{
                            color: category.color!,
                            borderColor: category.color!,
                          }}
                        >
                          {category.name}
                        </Link>
                        <div className="text-default-500 py-1 text-small">
                          {category.description}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )
            )
          ) : (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} />
              ))}
            </>
          )}
          {categories?.length === 0 && !fetchingCategories && (
            <div className="text-default-700 text-center">
              No results found.
            </div>
          )}
        </div>
        <div className="col-span-1 max-lg:col-span-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg px-6 py-4">
          <div className="font-semibold font-lg pb-2 text-neutral-900 dark:text-white">
            Latest posts
          </div>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {posts?.map((post) => (
                <div
                  key={post.id}
                  className="bg-neutral-100 dark:bg-neutral-900 rounded-md flex items-center justify-between max-md:flex-col max-md:gap-y-2 px-6 py-4"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <Avatar
                        src={post.user.image!}
                        showFallback
                        radius="full"
                        size="sm"
                        as={Link}
                        href={`/profile/${post.user?.name}`}
                      />
                    </div>
                    <div className="flex flex-col w-full h-full gap-1">
                      <Link
                        href={`/topics/${post.topic.id}`}
                        color="foreground"
                      >
                        {post.topic.title}
                      </Link>
                    </div>
                  </div>
                  <div className="text-default-400 italic text-small">
                    {user_date(post.createdAt).date}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
