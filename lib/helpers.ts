"use server";

import { getUserById } from "@/lib/actions/user.actions";
import { prisma } from "@/lib/db";
import { Topic, User } from "@prisma/client";

const getUsernameById = async (id: string) => {
  const user = await getUserById({ id });
  return user?.name;
};

const getPostTopicById = async (id: string) => {
  if (!id) return;

  const topic = await prisma.topic.findFirst({
    where: { id },
  });

  return topic?.title;
};

const FetchGlobal = async ({
  search,
  usersEnabled,
  topicsEnabled,
}: {
  search: string;
  usersEnabled: boolean;
  topicsEnabled: boolean;
}) => {
  let users: User[] = [];
  let topics: Topic[] = [];

  if (usersEnabled) {
    users = await prisma.user.findMany({
      where: { name: { contains: search, mode: "insensitive" } },
    });
  }

  if (topicsEnabled) {
    topics = await prisma.topic.findMany({
      where: { title: { contains: search, mode: "insensitive" } },
    });
  }

  return [users, topics];
};

export { getUsernameById, getPostTopicById, FetchGlobal };
