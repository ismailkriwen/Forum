import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { NotificationsComponent } from "./content";

const NotificationsPage = async () => {
  const session = await getAuthSession();
  if (!session || !session?.user) redirect("/");

  return <NotificationsComponent />;
};

export default NotificationsPage;
