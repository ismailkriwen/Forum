"use server";

import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

const createTopic = async ({
  categoryId,
  title,
}: {
  categoryId: string;
  title: string;
}) => {
  const topic = await prisma.topic.create({
    data: { title, categories: { connect: { id: categoryId } } },
  });

  return topic;
};

const getTopics = async () => {
  const topics = await prisma.topic.findMany({
    include: { posts: true, categories: true },
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
      categories: {
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

export { createTopic, getTopics, getTopic, CreateTopic };
