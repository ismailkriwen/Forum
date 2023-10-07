"use server";

import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

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

export { getNotifications, seenNotifications };
