"use client";

import { SignInProvider } from "@/components/hooks/useSignIn";
import { SignOutProvider } from "@/components/hooks/useSignOut";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <NextUIProvider className="h-full">
          <ThemeProvider
            attribute="class"
            storageKey="__blog-theme__"
            themes={["light", "dark"]}
            enableSystem={false}
            enableColorScheme={true}
            defaultTheme="dark"
          >
            <SignInProvider>
              <SignOutProvider>{children}</SignOutProvider>
            </SignInProvider>
          </ThemeProvider>
        </NextUIProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};
