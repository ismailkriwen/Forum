"use client";

import { NextUIProvider as NextUI } from "@nextui-org/react";

export const NextUIProvider = ({ children }: { children: React.ReactNode }) => {
  return <NextUI className="h-screen mb-4">{children}</NextUI>;
};
