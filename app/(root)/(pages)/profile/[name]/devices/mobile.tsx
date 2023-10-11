import { getUser } from "@/lib/actions/user.actions";
import { Role, type User as TUser } from "@prisma/client";
import { useSession } from "next-auth/react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

import { unslug } from "@/lib/slugify";
import { Avatar, Button, useDisclosure } from "@nextui-org/react";
import { Camera, Settings, UserPlus } from "lucide-react";
import { BiSolidMessageAdd } from "react-icons/bi";
import { ProfileAbout } from "../about";
import { EditModal } from "../modals/edit";
import { NewMessage } from "../modals/msg";
import { UploadImageModal } from "../modals/uploadImage";
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";

export const Mobile = ({
  name,
  setLoading,
}: {
  name: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
}) => {
  const { data: session } = useSession();
  const [user, setUser] = useState<TUser | null>(null);
  const owner = session?.user?.name === unslug(name) || false;

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

  const fetchUser = useCallback(async () => {
    if (!name) return;
    setLoading(true);
    const res = await getUser({ name: unslug(name) });
    if (res) setUser(res);
    setLoading(false);
  }, [name, setLoading]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <>
      <div className="rounded bg-gray-200/70 dark:bg-neutral-800/90 min-h-[200px] mt-6 container py-2">
        <div className="bg-gray-300/60 dark:bg-neutral-900/80 px-4 py-2 flex items-center gap-2 justify-between flex-col !w-full !h-full">
          <Avatar
            src={user?.image!}
            showFallback
            className="w-16 h-16 z-0"
            onClick={() => {
              if (!owner) return;
              imgOnOpen();
            }}
          />
          <div className="text-center">
            <div className="text-small pb-[2px]">
              {user?.name}{" "}
              {user?.gender == "Male" && (
                <BsGenderMale className="text-primary inline-block text-small" />
              )}
              {user?.gender === "Female" && (
                <BsGenderFemale className="text-rose-500 inline-block text-small" />
              )}
            </div>
            <div className="text-default-500 text-small pb-[2px]">
              {user?.role}
            </div>
            {user?.bio && (
              <div className="italic text-default-600 text-small">
                {user.bio}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {!owner && (
              <>
                <Button radius="sm" isIconOnly size="sm">
                  <UserPlus className="w-4 h-4" />
                </Button>
                <Button
                  radius="sm"
                  size="sm"
                  variant="ghost"
                  isIconOnly
                  onPress={msgOnOpen}
                >
                  <BiSolidMessageAdd />
                </Button>
              </>
            )}
            <Button
              isIconOnly
              variant="ghost"
              radius="sm"
              size="sm"
              onPress={editOnOpen}
            >
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
