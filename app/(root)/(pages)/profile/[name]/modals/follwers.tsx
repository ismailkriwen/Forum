"use client";

import { colors } from "@/constants";
import { followersList, getUserByEmail } from "@/lib/actions/user.actions";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import { Avatar, Link, Spinner } from "@nextui-org/react";
import { useQuery } from "react-query";

type Props = {
  name: string;
  isOpen: boolean;
  onOpenChange: () => void;
};

const UserInfo = ({ email }: { email: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["follower_user"],
    queryFn: async () => await getUserByEmail({ email }),
  });

  return (
    <>
      {/* @ts-ignore */}
      {isLoading ? (
        <>
          <div className="flex gap-3 items-center">
            <div className="w-10 aspect-square bg-neutral-700 animate-pulse rounded-full"></div>
            <div className="flex flex-col gap-1">
              <div className="w-20 h-[8px] bg-neutral-700 animate-pulse rounded-full"></div>
              <div className="w-12 h-[8px] bg-neutral-700 animate-pulse rounded-full"></div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex gap-3 items-center rounded-md px-4 py-2 cursor-pointer hover:bg-gray-600/30 transition-colors">
            <Avatar src={data?.image!} showFallback />
            <div className="flex flex-col">
              <Link
                target="_blank"
                href={`/profile/${data?.name}`} /* @ts-ignore */
                color={colors[data?.role]}
              >
                {data?.name}
              </Link>
              <div className="text-xs text-default-500">{data?.role}</div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export const FollowersModal = ({ name, isOpen, onOpenChange }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["followers_list"],
    queryFn: async () => await followersList({ name }),
  });

  return (
    <Modal radius="sm" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader className="font-bold text-lg">Followers</ModalHeader>
        <ModalBody className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Spinner color="default" />
            </div>
          ) : (
            <div className="space-y-3">
              {data?.map((item) => (
                <UserInfo email={item} />
              ))}
            </div>
          )}
          {!isLoading && data?.length == 0 && (
            <div className="text-center py-2">No Followers</div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
