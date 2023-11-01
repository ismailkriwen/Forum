"use client";

import { useIsMobile } from "@/components/hooks/useIsMobile";
import { Desktop } from "./devices/desktop";
import { Mobile } from "./devices/mobile";

export const Overview = ({ name }: { name: string }) => {
  const isMobile = useIsMobile();

  return <>{isMobile ? <Mobile name={name} /> : <Desktop name={name} />}</>;
};
