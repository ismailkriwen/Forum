"use server";

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

const getTopics = async (cat?: string) => {
  if (cat) {
    const topics = await prisma.topic.findMany({
      where: {
        categories: { some: { name: { mode: "insensitive", equals: cat } } },
      },
      include: { posts: true, categories: true },
    });

    return topics;
  } else {
    const topics = await prisma.topic.findMany({
      include: { posts: true, categories: true },
    });
    return topics;
  }
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

export { createTopic, getTopics, getTopic };
