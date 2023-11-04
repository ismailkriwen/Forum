import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { TopicsPageComponent } from "./content";
import { SignInAlert } from "@/components/SinInAlert";

export const metadata: Metadata = {
  title: "Topics",
};

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const TopicsPage = async ({ searchParams }: Props) => {
  const session = await getAuthSession();
  if (!searchParams.page) redirect("?page=1");

  return session ? (
    <TopicsPageComponent searchParams={searchParams} session={session} />
  ) : (
    <SignInAlert />
  );
};

export default TopicsPage;
