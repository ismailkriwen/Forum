import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Conversations } from "./conversations";

const ConversationPage = async () => {
  const session = await getAuthSession();
  if (!session) redirect("/");

  return (
    <>
      <Conversations />
    </>
  );
};

export default ConversationPage;
