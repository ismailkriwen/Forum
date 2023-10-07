"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextThemeProvider
      attribute="class"
      storageKey="__blog-theme__"
      themes={["light", "dark"]}
      enableSystem={false}
      enableColorScheme={true}
    >
      {children}
    </NextThemeProvider>
  );
};
