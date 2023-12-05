import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { SignInAlert } from "@/components/SinInAlert";
import { TopupComponent } from "./main";

const TopupPage = async () => {
  const session = await getAuthSession();

  return session?.user ? <TopupComponent session={session} /> : <SignInAlert />;
};

export default TopupPage;
