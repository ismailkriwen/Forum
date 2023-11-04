import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { Content } from "./content";
import { redirect } from "next/navigation";
import { SignInAlert } from "@/components/SinInAlert";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Members",
};

const MembersPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  if (!searchParams.page) redirect("?page=1");
  const session = await getAuthSession();

  return session ? <Content searchParams={searchParams} /> : <SignInAlert />;
};

export default MembersPage;
