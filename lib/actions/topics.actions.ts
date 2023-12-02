"use server";

import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";

const createTopic = async ({
  categoryId,
  title,
}: {
  categoryId: string;
  title: string;
}) => {
  const topic = await prisma.topic.create({
    data: { title, category: { connect: { id: categoryId } } },
  });

  return topic;
};

const getTopics = async () => {
  const topics = await prisma.topic.findMany({
    include: { posts: true, category: true },
  });

  return topics;
};

const getTopic = async (id: string) => {
  const topic = await prisma.topic.findFirst({
    where: { id },
    include: {
      posts: {
        include: { user: true, likes: { include: { user: true } } },
      },
    },
  });
  return topic;
};

const CreateTopic = async ({
  title,
  content,
  cat,
}: {
  title: string;
  content: string;
  cat: string;
}) => {
  const session = await getAuthSession();
  if (!session) return;
  const { user } = session;

  const topic = await prisma.topic.create({
    data: {
      title,
      category: {
        connect: { name: cat },
      },
    },
  });

  if (!topic) return;
  const post = await prisma.post.create({
    data: {
      content,
      user: { connect: { email: user.email! } },
      topic: { connect: { id: topic.id } },
    },
    include: { user: true },
  });

  return post;
};

const GetCategoryByTopicId = async ({ id }: { id: string }) => {
  const topic = await prisma.topic.findFirst({
    where: { id },
    include: { category: true },
  });

  return topic;
};

const DeleteTopic = async ({ id }: { id: string }) => {
  const session = await getAuthSession();
  if (
    !session ||
    !session.user ||
    !session.user.groups.includes(Role.Moderator)
  )
    return;

  const topic = await prisma.topic.delete({
    where: { id },
  });

  return topic;
};

const GetTopicName = async ({ id }: { id: string }) =>
  await prisma.topic.findFirst({ where: { id } });

const PinTopic = async ({ id }: { id: string }) =>
  await prisma.topic.update({ where: { id }, data: { pinned: true } });
const UnpinTopic = async ({ id }: { id: string }) =>
  await prisma.topic.update({ where: { id }, data: { pinned: false } });

export {
  createTopic,
  getTopics,
  getTopic,
  CreateTopic,
  GetCategoryByTopicId,
  DeleteTopic,
  GetTopicName,
  PinTopic,
  UnpinTopic,
};
