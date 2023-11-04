import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Messages } from "./messages";
import { SignInAlert } from "@/components/SinInAlert";

const Message = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  if (!searchParams.page) redirect(`?page=1`);
  const session = await getAuthSession();

  return session ? (
    <Messages id={params.id} searchParams={searchParams} />
  ) : (
    <SignInAlert />
  );
};

export default Message;
