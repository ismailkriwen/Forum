"use server";

import { prisma } from "@/lib/db";

import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

const getConversations = async () => {
  const session = await getAuthSession();
  if (!session || !session.user.email) return;

  const conversations = await prisma.$transaction([
    prisma.conversation.findMany({
      where: { creator: session?.user?.email },
      include: { messages: true },
    }),
    prisma.conversation.findMany({
      where: { receiver: session?.user?.email },
      include: { messages: true },
    }),
  ]);

  return [...conversations[0], ...conversations[1]];
};

const createMessage = async ({
  title,
  content,
  creator,
  receiver,
}: {
  title: string;
  content: string;
  creator: string;
  receiver: string;
}) => {
  const session = await getAuthSession();
  if (!session) return;

  const conversation = await prisma.conversation.create({
    data: {
      title,
      creator,
      receiver,
    },
  });

  await prisma.user.update({
    where: { email: creator },
    data: {
      messages: {
        create: {
          content,
          conversation: { connect: conversation },
        },
      },
    },
  });

  return conversation.id;
};

const getConversation = async ({ id }: { id: string }) => {
  const conversation = await prisma.conversation.findFirst({
    where: { id },
    include: { messages: { include: { user: true } } },
  });
  return conversation;
};

const addMessage = async ({
  content,
  id,
  email,
}: {
  content: string;
  id: string;
  email: string;
}) => {
  const session = await getAuthSession();
  if (!session || !session.user) return;

  const conversation = await prisma.conversation.findFirst({ where: { id } });
  if (!conversation) return;

  const msg = await prisma.user.update({
    where: { email },
    data: {
      messages: {
        create: {
          content,
          conversation: { connect: conversation },
        },
      },
    },
  });

  if (!msg) return { error: "Something went wrong" };

  revalidatePath(`/conversation/${id}`);
};

export { addMessage, createMessage, getConversation, getConversations };
