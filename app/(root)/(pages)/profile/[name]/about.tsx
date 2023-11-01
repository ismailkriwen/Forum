"use client";

import { getUser } from "@/lib/actions/user.actions";
import { Spinner, useDisclosure } from "@nextui-org/react";
import { useQuery } from "react-query";
import { FollowingsModal } from "./modals/followings";
import { FollowersModal } from "./modals/follwers";

export const ProfileAbout = ({ name }: { name: string | null }) => {
  const {
    isOpen: followingsIsOpen,
    onOpen: followingsOnOpen,
    onOpenChange: followingsOnOpenChange,
  } = useDisclosure();

  const {
    isOpen: followersIsOpen,
    onOpen: followersOnOpen,
    onOpenChange: followersOnOpenChange,
  } = useDisclosure();

  const { data: info, isLoading } = useQuery({
    queryKey: ["user_about"],
    queryFn: async () => getUser({ name: name! }),
  });

  return (
    <>
      <div className="bg-gray-3200/90 dark:bg-neutral-900/80 px-6 py-4 mt-2">
        {!isLoading ? (
          <>
            <div>
              <div className="flex justify-between items-center text-left">
                <div className="w-full">
                  {info?.location !== "" && <div>Location</div>}
                  <div>Posts</div>
                  <div>Likes</div>
                  <div>Followings</div>
                  <div>Followers</div>
                </div>
                <div className="w-full">
                  {info?.location !== "" && (
                    <div className="w-fit">{info?.location}</div>
                  )}
                  <div className="w-fit">{info?.posts.length}</div>
                  <div className="w-fit">{info?.likes.length}</div>
                  <div
                    onClick={followingsOnOpen}
                    className="w-fit cursor-pointer"
                  >
                    {info?.followings.length}
                  </div>
                  <div
                    onClick={followersOnOpen}
                    className="w-fit cursor-pointer"
                  >
                    {info?.followers.length}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <Spinner color="default" />
          </div>
        )}
      </div>
      <FollowingsModal
        name={name!}
        isOpen={followingsIsOpen}
        onOpenChange={followingsOnOpenChange}
      />
      <FollowersModal
        name={name!}
        isOpen={followersIsOpen}
        onOpenChange={followersOnOpenChange}
      />
    </>
  );
};
