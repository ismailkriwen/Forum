"use server";

import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { Post, User } from "@prisma/client";

type TPost = {
  user: User;
} & Post;

const notifyFollowers = async ({ post }: { post: TPost }) => {
  post.user.followers.map(async (user) => {
    await prisma.user.update({
      where: { email: user },
      data: {
        notifications: {
          create: {
            type: "following_posted",
            from: post.user?.name,
            post: post.topicId,
          },
        },
      },
    });
    pusherServer.trigger(user, "notify", null);
  });
};

const getNotifications = async () => {
  const session = await getAuthSession();
  if (!session) return;
  const notifications = await prisma.notification.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { id: "desc" },
  });
  return notifications;
};

const seenNotifications = async () => {
  const session = await getAuthSession();
  if (!session) return;
  const d = await prisma.user.update({
    where: { email: session.user.email! },
    data: {
      notifications: {
        updateMany: {
          where: { seen: false },
          data: { seen: true },
        },
      },
    },
  });
};

export { notifyFollowers, getNotifications, seenNotifications };
