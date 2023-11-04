import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { Stats } from "@/app/(admin)/components/content/stats/stats";

const AdminPage = async () => {
  const session = await getAuthSession();
  if (!session || !session.user.groups.includes(Role.Admin)) redirect("/");

  return <Stats />;
};

export default AdminPage;
