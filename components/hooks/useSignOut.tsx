"use client";

import { useDisclosure } from "@nextui-org/react";
import { createContext, useContext } from "react";

type TContext = {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
  onClose: () => void;
};

export const SignOutContext = createContext<TContext | null>(null);

export const SignOutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <SignOutContext.Provider value={{ isOpen, onOpen, onOpenChange, onClose }}>
      {children}
    </SignOutContext.Provider>
  );
};

export const useSignOutContext = () => {
  const context = useContext(SignOutContext);
  if (!context) {
    throw new Error(
      "Sign out context must be used outside the sign out provider"
    );
  }

  return context;
};
