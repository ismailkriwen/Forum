import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { SignInAlert } from "@/components/SinInAlert";
import { PageComponent } from "./main";
import { redirect } from "next/navigation";

const ShopPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const session = await getAuthSession();
  if (!searchParams.page) redirect("?page=1");

  return (
    <>
      {session && session.user ? (
        <PageComponent searchParams={searchParams} />
      ) : (
        <SignInAlert />
      )}
    </>
  );
};

export default ShopPage;
