import { colors } from "@/constants";
import { getUserByEmail } from "@/lib/actions/user.actions";
import { Avatar, Divider, Link, Spinner, Tooltip } from "@nextui-org/react";
import { Like, Post, User, Badge } from "@prisma/client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type TUser = {
  posts: Post[];
  likes: Like[];
  badges: Badge[];
} & User;

export const MiniProfile = ({ email }: { email: string }) => {
  const [user, setUser] = useState<TUser>();
  const [loading, setLoading] = useState(false);
  const fetcher = useCallback(
    async (email: string) => {
      try {
        setLoading(true);
        const res = await getUserByEmail({ email });
        res && setUser(res as TUser);
      } catch (err) {
        return false;
      } finally {
        setLoading(false);
      }
    },
    [email]
  );

  useEffect(() => {
    fetcher(email);
  }, [fetcher, email]);

  return (
    <>
      {loading ? (
        <>
          <div className="max-md:hidden flex items-center justify-center px-4 py-2 min-w-[200px] bg-neutral-100 dark:bg-neutral-950">
            <Spinner color="default" />
          </div>
        </>
      ) : (
        <div className="max-md:hidden text-center flex items-center justify-between gap-2 flex-col px-4 py-2 min-w-[200px] bg-neutral-100 dark:bg-neutral-950">
          <div>
            {/* @ts-ignore */}
            <Link href={`/profile/${user?.name}`} color={colors[user?.role]}>
              {user?.name}
            </Link>
            <div className="text-small text-default-400">{user?.role}</div>
          </div>
          <Avatar
            src={user?.image!}
            showFallback
            className="w-20 h-20 text-large my-2"
          />
          <div className="flex gap-2 items-center justify-center text-small">
            <div>Posts: {user?.posts?.length}</div>
            <Divider orientation="vertical" />
            <div>Likes: {user?.likes?.length}</div>
          </div>
          <div className="flex flex-wrap my-1">
            {user?.badges?.map((badge) => (
              <Tooltip
                size="sm"
                radius="sm"
                showArrow
                content={badge.name}
                key={badge.id}
              >
                <div className="w-6 h-6 relative">
                  <Image
                    src={badge.image}
                    alt={badge.name}
                    fill
                    className="rounded-full object-contain"
                  />
                </div>
              </Tooltip>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
