import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const ProfilePage = async () => {
  const session = await getAuthSession();
  if (!session) redirect("/");
  else redirect(`/profile/${session.user.name}`);
};

export default ProfilePage;
