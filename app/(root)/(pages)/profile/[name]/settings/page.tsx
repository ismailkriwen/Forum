import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { unslug } from "@/lib/slugify";
import { redirect } from "next/navigation";
import { SignInRequirement } from "../sign-in-requirement";
import { Settings } from "./Settings";

const SettingsPage = async ({ params }: { params: { name: string } }) => {
  const session = await getAuthSession();
  const { name } = params;
  if (session?.user.name !== unslug(name)) redirect("/profile");

  return (
    <>{session ? <Settings name={unslug(name)} /> : <SignInRequirement />}</>
  );
};

export default SettingsPage;
