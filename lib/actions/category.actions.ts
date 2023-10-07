"use server";

import { prisma } from "@/lib/db";

import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { Role } from "@prisma/client";

const getCategory = async (name: string) => {
  const cat = await prisma.category.findFirst({
    where: { name: { mode: "insensitive", equals: name } },
  });
  return cat;
};

const getCategories = async (query?: {}) => {
  if (query) {
    const categories = await prisma.category.findMany(query);
    return categories;
  } else {
    const categories = await prisma.category.findMany({
      include: { topics: true },
    });
    return categories;
  }
};

const deleteCategory = async ({ name }: { name: string }) => {
  const session = await getAuthSession();
  if (!session || session.user.role !== Role.Admin) return;

  await prisma.category.delete({ where: { name } });
  await prisma.user.update({
    where: { email: session?.user?.email as string },
    data: {
      logs: {
        create: {
          content: `${session?.user?.name} Deleted ${name}`,
        },
      },
    },
  });
};

const createCategory = async ({
  name,
  color,
}: {
  name: string;
  color: string;
}) => {
  const nameExists = await prisma.category.findUnique({ where: { name } });
  const colorExists = await prisma.category.findFirst({ where: { color } });

  if (nameExists) return { error: "Name already exists" };
  if (colorExists) return { error: "Color already exists" };

  await prisma.category.create({
    data: { name, color },
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

  if (colorExists) return { error: "Color already exists" };

  await prisma.category.update({
    where: { name },
    data: { color },
  });
};

export {
  getCategory,
  getCategories,
  deleteCategory,
  createCategory,
  updateName,
  updateColor,
};
