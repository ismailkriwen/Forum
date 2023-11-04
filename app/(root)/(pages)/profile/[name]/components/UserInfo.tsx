"use client";

import { Avatar, useDisclosure } from "@nextui-org/react";
import { User } from "@prisma/client";
import { Camera } from "lucide-react";
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";
import { UploadImageModal } from "../modals/uploadImage";

type Props = {
  owner: boolean;
  user: User | null | undefined;
};

export const UserInfo = ({ owner, user }: Props) => {
  const {
    isOpen: imgIsOpen,
    onOpen: imgOnOpen,
    onOpenChange: imgOnOpenChange,
  } = useDisclosure();

  return (
    <>
      <div className="flex gap-4">
        {owner ? (
          <div className="relative group w-16">
            <Avatar src={user?.image!} showFallback className="w-16 h-16 z-0" />
            <div
              className="absolute cursor-pointer inset-0 rounded-full bg-black/30 hidden group-hover:flex items-center justify-center"
              onClick={imgOnOpen}
            >
              <Camera className="w-4 h-4 text-white" />
            </div>
          </div>
        ) : (
          <Avatar src={user?.image!} showFallback className="w-16 h-16 z-0" />
        )}
        <div className="flex items-start justify-center flex-col">
          <div className="flex items-center gap-1">
            {user?.name}{" "}
            {user?.gender == "Male" && (
              <BsGenderMale className="text-primary inline-block text-small" />
            )}
            {user?.gender === "Female" && (
              <BsGenderFemale className="text-rose-500 inline-block text-small" />
            )}
          </div>
          <div className="text-small text-default-400">{user?.role}</div>
        </div>
      </div>
      {user?.bio && (
        <div className="italic text-default-600 mt-3">{user.bio}</div>
      )}
      {owner && (
        <UploadImageModal
          user={user}
          isOpen={imgIsOpen}
          onOpenChange={imgOnOpenChange}
        />
      )}
    </>
  );
};
