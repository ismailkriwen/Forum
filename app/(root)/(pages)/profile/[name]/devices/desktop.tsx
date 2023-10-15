import { getUser } from "@/lib/actions/user.actions";
import { Role, type User as TUser } from "@prisma/client";
import { useSession } from "next-auth/react";

import { unslug } from "@/lib/slugify";
import { Avatar, Button, useDisclosure } from "@nextui-org/react";
import { Camera, Settings, UserPlus } from "lucide-react";
import { BiSolidMessageAdd } from "react-icons/bi";
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";
import { useQuery } from "react-query";
import { ProfileAbout } from "../about";
import { EditModal } from "../modals/edit";
import { NewMessage } from "../modals/msg";
import { UploadImageModal } from "../modals/uploadImage";

export const Desktop = ({ name }: { name: string }) => {
  const { data: session } = useSession();
  const owner = session?.user?.name === unslug(name) || false;

  const { data: user } = useQuery({
    queryKey: ["profile_info"],
    queryFn: async () => await getUser({ name: unslug(name) }),
  });

  const {
    isOpen: editIsOpen,
    onOpen: editOnOpen,
    onOpenChange: editOnOpenChange,
  } = useDisclosure();

  const {
    isOpen: msgIsOpen,
    onOpen: msgOnOpen,
    onOpenChange: msgOnOpenChange,
  } = useDisclosure();

  const {
    isOpen: imgIsOpen,
    onOpen: imgOnOpen,
    onOpenChange: imgOnOpenChange,
    onClose: imgOnClose,
  } = useDisclosure();

  return (
    <>
      <div className="rounded bg-gray-200/70 dark:bg-neutral-800/90 min-h-[200px] mt-6 container py-2">
        <div className="bg-gray-300/60 dark:bg-neutral-900/80 px-6 py-4 flex items-center justify-between !h-full">
          <div>
            <div className="flex gap-4">
              {owner ? (
                <div className="relative group w-16">
                  <Avatar
                    src={user?.image!}
                    showFallback
                    className="w-16 h-16 z-0"
                  />
                  <div
                    className="absolute cursor-pointer inset-0 rounded-full bg-black/30 hidden group-hover:flex items-center justify-center"
                    onClick={imgOnOpen}
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                </div>
              ) : (
                <Avatar
                  src={user?.image!}
                  showFallback
                  className="w-16 h-16 z-0"
                />
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
              <div className="italic text-default-600 mt-2">{user.bio}</div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {!owner && (
              <>
                <Button
                  radius="sm"
                  startContent={<UserPlus className="w-4 h-4" />}
                >
                  Add Friend
                </Button>
                <Button
                  radius="sm"
                  variant="ghost"
                  startContent={<BiSolidMessageAdd />}
                  onPress={msgOnOpen}
                >
                  Message
                </Button>
              </>
            )}
            <Button isIconOnly variant="ghost" radius="sm" onPress={editOnOpen}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <ProfileAbout name={unslug(name)} />
      </div>
      <EditModal
        user={user}
        editRole={
          session?.user?.role === Role.Admin ||
          session?.user?.role === Role.Moderator
        }
        isOpen={editIsOpen}
        onOpen={editOnOpen}
        onOpenChange={editOnOpenChange}
      />
      <NewMessage
        isOpen={msgIsOpen}
        onOpenChange={msgOnOpenChange}
        receiver={user as TUser}
        sender={session?.user as TUser}
      />
      {owner && (
        <UploadImageModal
          user={user}
          isOpen={imgIsOpen}
          onOpenChange={imgOnOpenChange}
          onClose={imgOnClose}
        />
      )}
    </>
  );
};
