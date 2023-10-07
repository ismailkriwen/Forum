"use client";

import { useDisclosure } from "@nextui-org/react";
import { createContext, useContext, useState } from "react";

type TContext = {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
  onClose: () => void;
  dimissable: boolean;
  setDismissable: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SignInContext = createContext<TContext | null>(null);

export const SignInProvider = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [dimissable, setDismissable] = useState(true);

  return (
    <SignInContext.Provider
      value={{
        isOpen,
        onOpen,
        onOpenChange,
        onClose,
        dimissable,
        setDismissable,
      }}
    >
      {children}
    </SignInContext.Provider>
  );
};

export const useSignInContext = () => {
  const context = useContext(SignInContext);
  if (!context) {
    throw new Error("Sign in context must be used inside the sign in provider");
  }

  return context;
};
