"use client";

import { redirect } from "next/navigation";
import { TopicsIdPageComponent } from "./post";

import { useSignInContext } from "@/components/hooks/useSignIn";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const TopicsIdPage = ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  if (!searchParams.page) redirect(`/topics/${params.id}?page=1`);
  const { data: session } = useSession();
  const { onOpen: signInOnOpen, setDismissable } = useSignInContext();

  useEffect(() => {
    if (!session?.user) {
      setDismissable(false);
      signInOnOpen();
    }
  }, [session]);

  return (
    <>
      {session?.user && (
        <TopicsIdPageComponent
          session={session}
          params={params}
          searchParams={searchParams}
        />
      )}
    </>
  );
};

export default TopicsIdPage;
