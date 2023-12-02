"use server";

import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

export const DeleteBadge = async ({ id }: { id: string }) =>
  await prisma.badge.delete({ where: { id } });
export const FetchAllBadges = async () => await prisma.badge.findMany();
export const UserBadges = async ({ email }: { email: string }) => {
  const badges = await prisma.badge.findMany({
    where: {
      user: { email },
    },
  });

  return badges;
};

export const CreateBadge = async ({
  name,
  price,
  description,
  limited,
  image,
  purchasable,
}: {
  name: string;
  price: string;
  description: string;
  limited: boolean;
  image: string;
  purchasable: boolean;
}) => {
  const exist = await prisma.badge.findFirst({
    where: {
      name,
    },
  });

  if (exist) return { error: "Item name already exists." };
  const badge = await prisma.badge.create({
    data: {
      name,
      price: parseFloat(price),
      description,
      limited,
      purchasable,
      image,
    },
  });

  if (!badge) return { error: "Something went wrong." };
};

// UPDATES
export const UpdateBadgeName = async ({
  id,
  name,
}: {
  id: string;
  name: string;
}) => {
  const exist = await prisma.badge.findFirst({ where: { name } });
  if (exist) return;

  await prisma.badge.update({
    where: { id },
    data: { name },
  });
};

export const UpdateBadgePrice = async ({
  id,
  price,
}: {
  id: string;
  price: string;
}) => {
  await prisma.badge.update({
    where: { id },
    data: { price: parseFloat(price) },
  });
};

export const UpdateBadgeImage = async ({
  id,
  image,
}: {
  id: string;
  image: string;
}) => {
  await prisma.badge.update({
    where: { id },
    data: { image },
  });
};

export const UpdateBadgeDescription = async ({
  id,
  description,
}: {
  id: string;
  description: string;
}) => {
  await prisma.badge.update({
    where: { id },
    data: { description },
  });
};

export const UpdateBadgeLimited = async ({
  id,
  limited,
}: {
  id: string;
  limited: boolean;
}) => {
  await prisma.badge.update({
    where: { id },
    data: { limited },
  });
};

export const UpdateBadgePurchasable = async ({
  id,
  purchasable,
}: {
  id: string;
  purchasable: boolean;
}) => {
  await prisma.badge.update({
    where: { id },
    data: { purchasable },
  });
};

// USER
export const UserInventory = async ({ email }: { email?: string }) => {
  const session = await getAuthSession();

  const badges = email
    ? await prisma.badge.findMany({
        where: {
          user: { email },
        },
      })
    : await prisma.badge.findMany({
        where: {
          user: { email: session?.user.email },
        },
      });

  console.log(email);

  return badges;
};

export const PurchaseBadge = async ({ productId }: { productId: string }) => {
  const session = await getAuthSession();
  if (!session || !session.user) return;
  const user = session.user;

  const product = await prisma.badge.findFirst({
    where: { id: productId },
  });

  if (!product) return;

  const addBadge = prisma.user.update({
    where: {
      email: user.email!,
    },
    data: {
      badges: {
        connect: {
          id: productId,
        },
      },
    },
  });

  const takeOutFromBalance = prisma.user.update({
    where: { email: user.email! },
    data: { balance: Number(user.balance) - product.price },
  });

  return prisma.$transaction([addBadge, takeOutFromBalance]);
};

export const BadgeFunction = async ({ id }: { id: string }) => {
  const session = await getAuthSession();
  if (!session) return;

  const badge = await prisma.user.findFirst({
    where: {
      email: session?.user.email!,
      badges: {
        some: {
          id,
        },
      },
    },
  });

  return badge;
};
