"use client";

import { SignInProvider } from "@/components/hooks/useSignIn";
import { SignOutProvider } from "@/components/hooks/useSignOut";
import { SignUpProvider } from "@/components/hooks/useSignUp";
import { SessionProvider } from "./session-provider";
import { ThemeProvider } from "./theme-provider";

export const ProvidersContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <SessionProvider>
      <ThemeProvider>
        <SignInProvider>
          <SignOutProvider>
            <SignUpProvider>{children}</SignUpProvider>
          </SignOutProvider>
        </SignInProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};
