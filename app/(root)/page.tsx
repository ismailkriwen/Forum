import { NewPost } from "../../components/actions/new-post-button";
import { getAuthSession } from "../api/auth/[...nextauth]/route";
import { PostsFeed } from "./posts-feed";

import { Statistics } from "./statistics";

const HomePage = async () => {
  const session = await getAuthSession();

  return (
    <>
      <div>{session && <NewPost session={session} />}</div>
      <div className="mt-4 pb-20">
        <PostsFeed />
        <Statistics />
      </div>
    </>
  );
};

export default HomePage;
