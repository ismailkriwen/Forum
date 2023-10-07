"use client";

import { createContext, useContext, useState } from "react";

type TContext = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ToggleSidebarContext = createContext<TContext | null>(null);

export const ToggleSidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <ToggleSidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </ToggleSidebarContext.Provider>
  );
};

export const useToggleSidebarContext = () => {
  const context = useContext(ToggleSidebarContext);
  if (!context) {
    throw new Error(
      "Toggle sidebar context must be used inside the toggle sidebar provider"
    );
  }

  return context;
};
