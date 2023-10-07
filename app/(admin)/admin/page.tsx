import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { AdminContentPage } from "@/app/(admin)/components/content";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

const AdminPage = async () => {
  const session = await getAuthSession();
  if (!session || session.user.role !== Role.Admin) redirect("/");

  return <AdminContentPage />;
};

export default AdminPage;
