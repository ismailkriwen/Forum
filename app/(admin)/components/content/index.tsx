"use client";

import { Stats } from "@/app/(admin)/components/content/stats/stats";
import { Users } from "@/app/(admin)/components/content/users/users";
import { Categories } from "@/app/(admin)/components/content/categories/categories";

import {
  useTabContext,
  type tabs,
} from "@/app/(admin)/components/context/useTab";

const tabs = {
  stats: Stats,
  users: Users,
  categories: Categories,
};

export const AdminContentPage = () => {
  const { tab } = useTabContext();
  const View = tabs[tab];
  return <View />;
};
