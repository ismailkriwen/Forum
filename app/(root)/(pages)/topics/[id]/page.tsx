import { redirect } from "next/navigation";
import { TopicsIdPageComponent } from "./post";

import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { Metadata } from "next";
import { GetTopicName } from "@/lib/actions/topics.actions";
import { SignInAlert } from "@/components/SinInAlert";

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> => {
  const topic = await GetTopicName({ id: params.id });

  if (!topic?.title) {
    return {
      title: "Not Found",
      description: "This page is not found.",
    };
  }
  return {
    title: topic?.title,
  };
};

const TopicsIdPage = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const session = await getAuthSession();
  if (!searchParams.page) redirect(`?page=1`);

  return (
    <>
      {session?.user ? (
        <TopicsIdPageComponent
          session={session}
          params={params}
          searchParams={searchParams}
        />
      ) : (
        <SignInAlert />
      )}
    </>
  );
};

export default TopicsIdPage;
