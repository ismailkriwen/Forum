"use server";

import { prisma } from "@/lib/db";

import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { Role } from "@prisma/client";

const getCategory = async (name: string) => {
  const cat = await prisma.category.findFirst({
    where: { name: { mode: "insensitive", equals: name } },
    include: {
      topics: {
        include: { posts: true, category: true },
      },
    },
  });
  return cat;
};

const getCategories = async () => {
  const categories = await prisma.category.findMany({
    include: { topics: { include: { posts: true } } },
    orderBy: { order: "asc" },
  });

  return categories;
};

const deleteCategory = async ({ id }: { id: string }) => {
  const session = await getAuthSession();
  if (!session || !session.user.groups.includes(Role.Admin)) return;

  await prisma.category.delete({ where: { id } });
};

const createCategory = async ({
  name,
  color,
  description,
  ranks,
}: {
  name: string;
  color: string;
  description: string;
  ranks: Role[];
}) => {
  const nameExists = await prisma.category.findUnique({ where: { name } });
  const colorExists = await prisma.category.findFirst({ where: { color } });

  if (nameExists) return { error: "Name already exists" };
  if (colorExists) return { error: "Color already exists" };

  const count = await prisma.category.count();

  await prisma.category.create({
    data: { name, color, description, ranks, order: count + 1 },
  });
};

const updateName = async ({
  name,
  newName,
}: {
  name: string;
  newName: string;
}) => {
  const nameExists = await prisma.category.findUnique({
    where: { name: newName },
  });

  if (nameExists) return { error: "Name already exists" };

  await prisma.category.update({
    where: { name },
    data: { name: newName },
  });
};

const updateColor = async ({
  name,
  color,
}: {
  name: string;
  color: string;
}) => {
  const colorExists = await prisma.category.findFirst({ where: { name } });

  if (colorExists && colorExists.color == color)
    return { error: "Color already exists" };

  await prisma.category.update({
    where: { name },
    data: { color },
  });
};

const updateDescription = async ({
  name,
  description,
}: {
  name: string;
  description: string;
}) => {
  const res = await prisma.category.update({
    where: { name },
    data: { description },
  });

  return res;
};

const updateRanks = async ({
  name,
  ranks,
}: {
  name: string;
  ranks: Role[];
}) => {
  const res = await prisma.category.update({
    where: { name },
    data: { ranks },
  });

  return res;
};

const CheckRankRequirement = async ({ name }: { name: string }) => {
  const session = await getAuthSession();
  if (!session) return false;

  const category = await prisma.category.findFirst({ where: { name } });
  if (
    category?.ranks?.length > 0 &&
    !category?.ranks.some((e) => session?.user.groups.includes(e))
  )
    return false;
  return true;
};

export {
  getCategory,
  getCategories,
  deleteCategory,
  createCategory,
  updateName,
  updateColor,
  updateDescription,
  updateRanks,
  CheckRankRequirement,
};
