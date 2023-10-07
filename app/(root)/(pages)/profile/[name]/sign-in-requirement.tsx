"use client";

import { useSignInContext } from "@/components/hooks/useSignIn";

export const SignInRequirement = () => {
  const { onOpen, setDismissable } = useSignInContext();
  setDismissable(false);
  onOpen();
  return <></>;
};
