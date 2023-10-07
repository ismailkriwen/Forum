"use client";

import { getUserByAny } from "@/lib/actions/user.actions";
import { Spinner } from "@nextui-org/react";
import { User } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";

type TUser = {
  posts: [];
  likes: [];
} & User;

export const ProfileAbout = ({ name }: { name: string | null }) => {
  const [info, setInfo] = useState<TUser | null>(null);

  const fetcher = useCallback(async () => {
    if (!name) return;
    const res = await getUserByAny({
      query: { where: { name }, include: { posts: true, likes: true } },
    });
    // @ts-ignore
    res && setInfo(res);
  }, [name]);

  useEffect(() => {
    fetcher();
  }, [fetcher]);

  return (
    <div className="bg-gray-3200/90 dark:bg-neutral-900/80 px-6 py-4 mt-2">
      {info ? (
        <>
          <div>
            <div className="flex justify-between items-center text-left">
              <div className="w-full">
                {info.location && <div>Location</div>}
                <div>Posts</div>
                <div>Likes</div>
              </div>
              <div className="w-full">
                {info.location && <div>{info.location}</div>}
                <div>
                  <div>{info.posts.length}</div>
                </div>
                <div>
                  <div>{info.likes.length}</div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <Spinner color="default" />
        </div>
      )}
    </div>
  );
};
