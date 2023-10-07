"use client";

import { useState } from "react";
import { Desktop } from "./devices/desktop";

import { useIsMobile } from "@/components/hooks/useIsMobile";
import { Mobile } from "./devices/mobile";

export const Overview = ({ name }: { name: string }) => {
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? (
        <Mobile name={name} setLoading={setLoading} />
      ) : (
        <Desktop name={name} setLoading={setLoading} />
      )}
    </>
  );
};
