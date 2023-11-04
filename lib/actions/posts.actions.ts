"use server";

import { TPost } from "@/app/(root)/(pages)/topics/[id]/post";
import { prisma } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { Role } from "@prisma/client";

const createPost = async ({
  topicId,
  content,
  creator,
}: {
  topicId: string;
  content: string;
  creator: string;
}) => {
  const post = await prisma.post.create({
    data: {
      content,
      user: { connect: { email: creator } },
      topic: { connect: { id: topicId } },
    },
    include: { user: true },
  });

  return post;
};

const getPost = async (id: string) => {
  const post = await prisma.post.findFirst({
    where: { id },
    include: { user: true },
  });

  return post;
};

const replyToPost = async ({
  topicId,
  content,
  creator,
  postId,
}: {
  topicId: string;
  content: string;
  creator: string;
  postId: string;
}) => {
  const post = await prisma.post.create({
    data: {
      content,
      user: { connect: { email: creator } },
      topic: { connect: { id: topicId } },
      reply: true,
      postId,
    },
    include: { user: true },
  });

  if (!post) return;

  const session = await getAuthSession();
  if (!session) return;
  const postReplied = await prisma.post.findFirst({
    where: { id: postId },
    include: { user: true },
  });
  if (!postReplied) return;

  await prisma.user.update({
    where: { email: postReplied.user.email! },
    data: {
      notifications: {
        create: {
          type: "quote",
          from: session.user.name,
          post: topicId,
        },
      },
    },
  });

  pusherServer.trigger(`${postReplied.user.email}`, "notify", null);

  return post;
};

const likePost = async ({ id, user }: { id: string; user: string }) => {
  const exists = await prisma.like.findFirst({ where: { post: { id } } });
  if (exists) return false;

  const post = await prisma.post.update({
    where: { id },
    data: {
      likes: {
        create: {
          user: {
            connect: {
              email: user,
            },
          },
        },
      },
    },
    include: { user: true },
  });

  const session = await getAuthSession();

  if (!session) return;

  await prisma.user.update({
    where: { email: post.user.email! },
    data: {
      notifications: {
        create: {
          type: "liked",
          from: session.user.name,
          post: post.topicId,
        },
      },
    },
  });

  pusherServer.trigger(`${post.user.email}`, "notify", null);

  if (post) return true;
  else return false;
};

const latestPosts = async () => {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { topic: { include: { category: true } }, user: true },
  });

  return posts;
};

const postsByCategory = async (category: string) => {
  const posts = await prisma.post.findMany({
    where: {
      topic: {
        category: { name: category },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { topic: { include: { category: true } }, user: true },
  });

  return posts;
};

const editPostContent = async ({
  post,
  content,
}: {
  post: TPost;
  content: string;
}) => {
  const update = await prisma.post.update({
    where: {
      id: post.id,
    },
    data: {
      content,
    },
  });

  return update;
};

const deletePost = async (id: string) => {
  const session = await getAuthSession();
  if (!session || !session.user.groups.includes(Role.Admin)) return;

  const de = await prisma.post.delete({ where: { id } });
  const postsCount = await prisma.topic.count({ where: { id: de.topicId } });
  if (postsCount == 0) await prisma.topic.delete({ where: { id: de.topicId } });

  return de;
};

const hidePost = async ({ id, email }: { id: string; email: string }) => {
  const session = await getAuthSession();
  if (!session) return;

  const postHidden = await prisma.post.findFirst({
    where: { id },
    select: { hidden: true },
  });
  if (postHidden?.hidden === true) return;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  const post = await prisma.post.update({
    where: { id },
    data: {
      hidden: true,
      hiddenBy: user.id,
    },
  });

  if (!post) return;

  await prisma.logs.create({
    data: {
      content: `${user.name} hided post with the ID: ${id}`,
      userId: user.id,
    },
  });

  return true;
};

const unHidePost = async ({ id, email }: { id: string; email: string }) => {
  const session = await getAuthSession();
  if (!session) return;

  const postHidden = await prisma.post.findFirst({
    where: { id },
    select: { hidden: true },
  });
  if (postHidden?.hidden === false) return;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  const post = await prisma.post.update({
    where: { id },
    data: {
      hidden: false,
    },
  });

  if (!post) return;

  await prisma.logs.create({
    data: {
      content: `${user.name} unhided post with the ID: ${id}`,
      userId: user.id,
    },
  });

  return true;
};

export {
  createPost,
  likePost,
  latestPosts,
  postsByCategory,
  replyToPost,
  getPost,
  editPostContent,
  deletePost,
  hidePost,
  unHidePost,
};
