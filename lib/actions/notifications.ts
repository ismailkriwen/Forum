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
  if (!session || !session.user) return;

  const notifications = await prisma.notification.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { id: "desc" },
  });

  return notifications;
};

const GetNotificationCount = async () => {
  const session = await getAuthSession();
  if (!session) return 0;

  const { user } = session;
  const count = await prisma.notification.count({
    where: { user: { email: user.email }, seen: false },
  });

  return count;
};

const MarkNotificationsAsRead = async () => {
  const session = await getAuthSession();
  if (!session || !session.user) return;

  const res = await prisma.notification.updateMany({
    where: {
      user: { email: session.user.email },
      seen: false,
    },
    data: {
      seen: true,
    },
  });

  return res;
};

export {
  notifyFollowers,
  getNotifications,
  MarkNotificationsAsRead,
  GetNotificationCount,
};
