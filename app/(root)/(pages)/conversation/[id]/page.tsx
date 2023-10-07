import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { Messages } from "./messages";
import { redirect } from "next/navigation";

const Message = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const session = await getAuthSession();
  if (!session) redirect("/");
  const { id } = params;
  if (!searchParams.page) redirect(`/conversation/${id}?page=1`);

  return <Messages id={id} searchParams={searchParams} />;
};

export default Message;
