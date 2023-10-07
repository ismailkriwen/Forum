"use client";

import { createContext, useContext, useState } from "react";

export type tabs = "stats" | "users" | "categories";

type TContext = {
  tab: tabs;
  setTab: React.Dispatch<React.SetStateAction<tabs>>;
};

export const TabContext = createContext<TContext | null>(null);

export const TabProvider = ({ children }: { children: React.ReactNode }) => {
  const [tab, setTab] = useState<tabs>("stats");

  return (
    <TabContext.Provider value={{ tab, setTab }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTabContext = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("Tab context must be used inside the tab provider");
  }

  return context;
};
