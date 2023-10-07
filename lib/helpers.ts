"use server";

import { getUserByAny } from "./actions/user.actions";
import { prisma } from "@/lib/db";

const getUsernameById = async (id: string) => {
  const user = await getUserByAny({
    query: { where: { id }, select: { name: true } },
  });
  return user?.name;
};

const getPostTopicById = async (id: string) => {
  const topic = await prisma.topic.findFirst({
    where: { id },
  });

  return topic?.title;
};

export { getUsernameById, getPostTopicById };
