import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { SignInAlert } from "./SinInAlert";
import { Content } from "./content";
import { redirect } from "next/navigation";

const MembersPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const session = await getAuthSession();
  if (!session) return <SignInAlert />;

  if (!searchParams.page) redirect("?page=1");

  return <Content searchParams={searchParams} />;
};

export default MembersPage;
