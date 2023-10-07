"use client";

import { Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";

const PageLoading = () => {
  const { status } = useSession();

  return (
    status === "loading" && (
      <div className="fixed inset-0 bg-black/75 z-50">
        <div className="flex items-center justify-center h-full fixed top-16 left-1/2 -translate-y-1/2">
          <Spinner className="text-white animate-spin w-8 h-8" />
        </div>
      </div>
    )
  );
};

const ContentLoading = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Spinner className="text-white animate-spin w-8 h-8" />
    </div>
  );
};

export { PageLoading, ContentLoading };
