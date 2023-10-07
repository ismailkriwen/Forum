import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { Overview } from "./overview";
import { SignInRequirement } from "./sign-in-requirement";

const ProfilePage = async ({ params }: { params: { name: string } }) => {
  const session = await getAuthSession();
  const { name } = params;

  return <>{session ? <Overview name={name} /> : <SignInRequirement />}</>;
};

export default ProfilePage;
