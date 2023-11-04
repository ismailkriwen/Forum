import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { SignInAlert } from "@/components/SinInAlert";
import { Overview } from "./overview";
import { Metadata } from "next";
import { unslug } from "@/lib/slugify";

export const generateMetadata = async ({
  params,
}: {
  params: { name: string };
}): Promise<Metadata> => {
  return {
    title: unslug(params.name),
  };
};

const ProfilePage = async ({ params }: { params: { name: string } }) => {
  const session = await getAuthSession();
  const { name } = params;

  return (
    <>{session && session?.user ? <Overview name={name} /> : <SignInAlert />}</>
  );
};

export default ProfilePage;
