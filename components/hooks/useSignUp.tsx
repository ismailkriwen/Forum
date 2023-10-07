"use client";

import { useDisclosure } from "@nextui-org/react";
import { createContext, useContext } from "react";

type TContext = {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
  onClose: () => void;
};

export const SignUpContext = createContext<TContext | null>(null);

export const SignUpProvider = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <SignUpContext.Provider value={{ isOpen, onOpen, onOpenChange, onClose }}>
      {children}
    </SignUpContext.Provider>
  );
};

export const useSignUpContext = () => {
  const context = useContext(SignUpContext);
  if (!context) {
    throw new Error("Sign up context must be used upside the sign up provider");
  }

  return context;
};
