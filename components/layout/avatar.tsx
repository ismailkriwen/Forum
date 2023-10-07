"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";

export const Avatar = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="w-8 h-8 bg-gray-400 animate-pulse rounded-full"></div>
    );
  }

  return (
    <>
      {!session?.user?.image ? (
        <div className="w-8 h-8 bg-gray-400 animate-pulse rounded-full"></div>
      ) : (
        <Image
          src={session?.user?.image as string}
          alt="Profile image"
          height={32}
          width={32}
          priority
          className="rounded-full object-contain"
        />
      )}
    </>
  );
};
