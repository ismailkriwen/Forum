"use server";

import { prisma } from "@/lib/db";

const getAnnouncement = async () =>
  await prisma.announcement.findFirst({
    select: { shown: true, content: true },
  });

const updateAnnouncement = async ({
  content,
  shown,
}: {
  content: string;
  shown: boolean;
}) => {
  const announcement = await prisma.announcement.findFirst({
    select: { id: true },
  });
  if (!announcement) return false;

  const u = await prisma.announcement.update({
    where: { id: announcement.id },
    data: {
      content,
      shown,
    },
  });

  return u != undefined || u != null;
};

const grabInfo = async () => {
  const topics = await prisma.topic.count();
  const posts = await prisma.post.count();
  const users = await prisma.user.count();
  const latest = await prisma.user.findMany({
    orderBy: { id: "desc" },
    take: 1,
  });

  return { topics, posts, users, latest: latest[0] };
};

export { getAnnouncement, updateAnnouncement, grabInfo };
