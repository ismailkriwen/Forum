"use client";
import { textColors } from "@/constants";
import { grabInfo } from "@/lib/actions/general.actions";
import { Divider, Spinner } from "@nextui-org/react";
import { Role } from "@prisma/client";
import Link from "next/link";
import { Fragment } from "react";

import { useQuery } from "react-query";

export const Statistics = () => {
  const roles = Object.keys(Role);
  const { data: info, isLoading } = useQuery({
    queryKey: ["statistics"],
    queryFn: async () => await grabInfo(),
  });

  return (
    <>
      <div className="my-4 dark:bg-neutral-900 bg-neutral-200 py-2 px-4 rounded overflow-hidden break-words">
        <div className="pb-1 font-semibold">Legends</div>
        <div className="pl-2">
          {roles.map((role, idx) => (
            <Fragment key={idx}>
              <Link
                href={`/members?page=1&filter=${role}`}
                key={role}
                className={textColors[role as Role]}
                target="_blank"
              >
                {role}
              </Link>
              {roles.length - 1 !== idx && <span className="pr-2">&#44;</span>}
            </Fragment>
          ))}
        </div>
        <Divider className="my-2" />
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Spinner color="default" />
          </div>
        ) : (
          <>
            <div className="pb-1 font-semibold">Forum Stats</div>
            <div className="pl-2 flex items-center gap-2">
              <span>
                Total topics: {info?.topics}{" "}
                <span className="max-sm:hidden">&bull;</span>
              </span>
              <span>
                Total posts: {info?.posts}{" "}
                <span className="max-sm:hidden">&bull;</span>
              </span>
              <span>
                Total users: {info?.users}{" "}
                <span className="max-sm:hidden">&bull;</span>
              </span>
              <span>
                Latest user:{" "}
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
        <Divider className="my-2" />
        <div className="pb-1 font-semibold">Online Users</div>
        <div className="pl-2 italic text-small">Coming soon..</div>
      </div>
    </>
  );
};
