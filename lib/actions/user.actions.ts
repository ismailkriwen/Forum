"use server";

import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";

import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { compare, hash } from "bcrypt";

const getUser = async ({ name }: { name: string }) => {
  const res = await prisma.user.findFirst({ where: { name } });
  return res;
};

const getUserByAny = async ({ query }: { query: {} }) =>
  await prisma.user.findFirst(query);

const getUsers = async (query: Object) => {
  const users = await prisma.user.findMany(query);

  return users;
};

const deleteUser = async ({ name, email }: { name: string; email: string }) => {
  const session = await getAuthSession();
  if (!session || session.user.role !== Role.Admin) return;

  await prisma.user.delete({ where: { email } });
  await prisma.user.update({
    where: { email: session?.user?.email as string },
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
  await prisma.user.update({
    where: { email },
    data: { role },
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

const oldUserExistance = async ({
  email,
  username: name,
}: {
  email: string;
  username: string;
}) => {
  const emailExists = await prisma.user.findUnique({ where: { email } });
  if (emailExists) return { error: "Email already exists" };

  const nameExists = await prisma.user.findFirst({ where: { name } });
  if (nameExists) return { error: "Username already exists" };
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
  const password = await hash(pass, 12);
  const user = await prisma.user.create({
    data: { name, email, password },
  });

  if (user) return { success: true };
};

const updateStatus = async ({
  email,
  status,
}: {
  email: string;
  status: boolean;
}) => {
  await prisma.user.update({
    where: { email },
    data: {
      online: status,
    },
  });
};

const updateInfo = async ({
  email,
  bio,
  location,
  gender,
}: {
  email: string;
  bio: string;
  location: string;
  gender: string;
}) => {
  const user = await prisma.user.update({
    where: { email },
    data: {
      bio,
      location,
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

export {
  createUser,
  deleteUser,
  getUser,
  getUserByAny,
  getUsers,
  oldUserExistance,
  updateName,
  updatePassword,
  updateRole,
  updateStatus,
  userExistance,
  updateInfo,
  updateImage,
};
