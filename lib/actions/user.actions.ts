"use server";

import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";

import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { compare, hash } from "bcrypt";
import { pusherServer } from "@/lib/pusher";

const getUserByEmail = async ({ email }: { email: string }) => {
  const res = await prisma.user.findFirst({
    where: { email },
    include: { likes: true, posts: true, notifications: true },
  });
  return res;
};

const getUserById = async ({ id }: { id: string }) => {
  const res = await prisma.user.findFirst({
    where: { id },
    include: { likes: true, posts: true, notifications: true },
  });
  return res;
};

const getUser = async ({ name }: { name: string }) => {
  const res = await prisma.user.findFirst({
    where: { name },
    include: { likes: true, posts: true, notifications: true },
  });
  return res;
};

const getUsers = async (query: Object) => {
  const users = await prisma.user.findMany(query);

  return users;
};

const deleteUser = async ({ name, email }: { name: string; email: string }) => {
  const session = await getAuthSession();
  if (!session || !session.user.groups.includes(Role.Admin)) return;

  await prisma.user.delete({ where: { email } });
  await prisma.user.update({
    where: { email: session?.user?.email! },
    data: {
      logs: {
        create: {
          content:
            name == session?.user?.name
              ? `${name} Deleted his account`
              : `${session?.user?.name} Deleted ${name}`,
        },
      },
    },
  });

  return true;
};

const updateName = async ({ email, name }: { email: string; name: string }) => {
  const nameExists = await prisma.user.findFirst({ where: { name } });

  if (nameExists) return { error: "Username is already taken." };

  await prisma.user.update({
    where: { email },
    data: { name },
  });
};

const updateRole = async ({ email, role }: { email: string; role: Role }) => {
  const user = await prisma.user.update({
    where: { email },
    data: { role },
  });
  return user;
};

const updateGroups = async ({
  email,
  groups,
}: {
  email: string;
  groups: Role[];
}) => {
  await prisma.user.update({
    where: { email },
    data: { groups },
  });
};

const updatePassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const hashedPass = await hash(password, 12);

  await prisma.user.update({
    where: { email },
    data: { password: hashedPass },
  });
};

const userExistance = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const emailExists = await prisma.user.findUnique({ where: { email } });
  if (!emailExists) return { error: "No such user with this email" };

  if (!emailExists.password) return { error: "You need to provide a password" };
  const validPass = await compare(password, emailExists.password);
  if (!validPass) return { error: "Password is incorrect" };
};

const createUser = async ({
  username: name,
  email,
  password: pass,
}: {
  username: string;
  email: string;
  password: string;
}) => {
  const emailExists = await prisma.user.findUnique({ where: { email } });
  if (emailExists) return { error: "Email already exists" };

  const nameExists = await prisma.user.findFirst({ where: { name } });
  if (nameExists) return { error: "Username already exists" };

  const password = await hash(pass, 12);
  const user = await prisma.user.create({
    data: { name, email, password },
  });

  if (!user) return { error: "Something went wrong." };
};

const updateInfo = async ({
  email,
  bio,
  gender,
}: {
  email: string;
  bio: string;
  gender: string;
}) => {
  const user = await prisma.user.update({
    where: { email },
    data: {
      bio,
      gender,
    },
  });

  return user;
};

const updateImage = async ({
  email,
  image,
}: {
  email: string;
  image: string;
}) => {
  const user = await prisma.user.update({
    where: { email },
    data: { image },
  });

  return user;
};

const followUser = async ({ email }: { email: string }) => {
  const session = await getAuthSession();
  if (!session) return;
  const { user: sender } = session;

  const target = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // @ts-ignore
  const list = target.followers.filter((e) => e.email != sender.email!) || [];
  if (list.length > 0) return;

  const first = prisma.user.update({
    where: { email },
    data: {
      followers: { push: sender.email! },
    },
  });

  const second = prisma.user.update({
    where: { email: sender?.email! },
    data: {
      followings: {
        push: target?.email!,
      },
    },
  });

  const res = await prisma.$transaction([first, second]);
  if (!res) return;

  await prisma.user.update({
    where: { email: target?.email! },
    data: {
      notifications: {
        create: {
          type: "follow",
          from: sender.name,
        },
      },
    },
  });

  pusherServer.trigger(`${target?.email}`, "notify", null);

  return res;
};

const unfollowUser = async ({ email }: { email: string }) => {
  const session = await getAuthSession();
  if (!session) return;
  const { user: sender } = session;

  const target = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // @ts-ignore
  const list = target.followers.filter((e) => e.email != sender.email!) || [];
  if (list.length == 0) return;

  const first = prisma.user.update({
    where: { email },
    data: {
      followers: {
        // @ts-ignore
        set: target?.followers.filter((e) => e.email == sender?.email),
      },
    },
  });

  const pullUser = await prisma.user.findUnique({
    where: { email: sender?.email! },
  });

  const second = prisma.user.update({
    where: { email: sender?.email! },
    data: {
      followings: {
        // @ts-ignore
        set: pullUser?.followings.filter((e) => e.email == target.email),
      },
    },
  });

  const res = await prisma.$transaction([first, second]);
  if (!res) return;

  return res;
};

const followingsList = async ({ name }: { name: string }) => {
  const user = await prisma.user.findFirst({
    where: { name },
  });

  if (!user) return;

  return user.followings;
};

const followersList = async ({ name }: { name: string }) => {
  const user = await prisma.user.findFirst({
    where: { name },
  });

  if (!user) return;

  return user.followers;
};

const updateGender = async ({
  email,
  gender,
}: {
  email: string;
  gender: string;
}) => {
  const session = await getAuthSession();
  if (!session) return;

  const res = await prisma.user.update({
    where: { email },
    data: { gender },
  });

  return res;
};

const updateLocation = async ({
  email,
  location,
}: {
  email: string;
  location: string;
}) => {
  const session = await getAuthSession();
  if (!session) return;

  const res = await prisma.user.update({
    where: { email },
    data: { location },
  });

  return res;
};

export {
  getUserByEmail,
  getUserById,
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateName,
  updatePassword,
  updateRole,
  userExistance,
  updateInfo,
  updateImage,
  followUser,
  unfollowUser,
  followingsList,
  followersList,
  updateGroups,
  updateGender,
  updateLocation,
};
