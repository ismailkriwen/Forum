import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Conversations } from "./conversations";
import { SignInAlert } from "@/components/SinInAlert";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages",
};

const ConversationPage = async () => {
  const session = await getAuthSession();
  if (!session) redirect("/");

  return session ? <Conversations /> : <SignInAlert />;
};

export default ConversationPage;
