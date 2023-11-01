"use client";
import { textColors } from "@/constants";
import { grabInfo } from "@/lib/actions/general.actions";
import { Spinner, Tooltip } from "@nextui-org/react";
import { Role } from "@prisma/client";
import { File, MessageCircle, UserPlus, Users } from "lucide-react";
import Link from "next/link";

import { useQuery } from "react-query";

const Skeleton = () => (
  <div className="dark:bg-neutral-800 rounded-sm px-6 py-2 flex items-center justify-center flex-1 max-w-xs">
    <Spinner color="default" />
  </div>
);

export const Statistics = () => {
  const roles = Object.keys(Role);
  const { data: info, isLoading } = useQuery({
    queryKey: ["statistics"],
    queryFn: async () => await grabInfo(),
  });

  return (
    <>
      <div className="grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 gap-5 mt-6">
        {isLoading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} />
            ))}
          </>
        ) : (
          <>
            <div className="bg-zinc-200/70 dark:bg-neutral-800 rounded-sm px-6 py-2 flex items-center justify-center flex-1 gap-2 max-w-xs border-l-3 border-l-emerald-500 max-sm:py-4 mx-auto w-full">
              <Tooltip
                content="Topics"
                placement="top"
                showArrow
                radius="sm"
                size="sm"
              >
                <MessageCircle className="w-8 h-8 text-emerald-500" />
              </Tooltip>
              <span>{info?.topics}</span>
            </div>
            <div className="bg-zinc-200/70 dark:bg-neutral-800 rounded-sm px-6 py-2 flex items-center justify-center flex-1 gap-2 max-w-xs border-l-3 border-l-lime-500 max-sm:py-4 mx-auto w-full">
              <Tooltip
                content="Posts"
                placement="top"
                showArrow
                radius="sm"
                size="sm"
              >
                <File className="w-8 h-8 text-lime-500" />
              </Tooltip>
              <span>{info?.posts}</span>
            </div>
            <div className="bg-zinc-200/70 dark:bg-neutral-800 rounded-sm px-6 py-2 flex items-center justify-center flex-1 gap-2 max-w-xs border-l-3 border-l-rose-600 max-sm:py-4 mx-auto w-full">
              <Tooltip
                content="Total Users"
                placement="top"
                showArrow
                radius="sm"
                size="sm"
              >
                <Users className="w-8 h-8 text-rose-600" />
              </Tooltip>
              <span>{info?.users}</span>
            </div>
            <div className="bg-zinc-200/70 dark:bg-neutral-800 rounded-sm rounded-l-[4px] px-6 py-2 flex items-center justify-center flex-col flex-1 gap-2 max-w-xs border-l-3 border-l-purple-500 max-sm:py-4 mx-auto w-full">
              <Tooltip
                content="Latest User"
                placement="top"
                showArrow
                radius="sm"
                size="sm"
              >
                <UserPlus className="w-6 h-6 text-purple-500" />
              </Tooltip>
              <span>
                <Link
                  href={`/profile/${info?.latest?.name}`}
                  /* @ts-ignore */
                  className={textColors[info?.latest?.role]}
                  target="_blank"
                >
                  {info?.latest?.name}
                </Link>
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
};
