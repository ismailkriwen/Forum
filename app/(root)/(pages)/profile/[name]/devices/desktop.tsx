import { getUser } from "@/lib/actions/user.actions";
import { useSession } from "next-auth/react";

import { unslug } from "@/lib/slugify";
import { Button, useDisclosure } from "@nextui-org/react";
import { Settings } from "lucide-react";
import { useQuery } from "react-query";
import { ProfileAbout } from "../about";
import { Controls } from "../components/Controls";
import { UserInfo } from "../components/UserInfo";
import { EditModal } from "../modals/edit";

export const Desktop = ({ name }: { name: string }) => {
  const { data: session } = useSession();
  const owner = session?.user?.name === unslug(name) || false;

  const { data: user } = useQuery({
    queryKey: ["profile_info"],
    queryFn: async () => await getUser({ name: unslug(name) }),
    enabled: !!name,
  });

  const {
    isOpen: editIsOpen,
    onOpen: editOnOpen,
    onOpenChange: editOnOpenChange,
  } = useDisclosure();

  return (
    <>
      <div className="rounded bg-gray-200/70 dark:bg-neutral-800/90 min-h-[200px] mt-6 container py-2">
        <div className="bg-gray-300/60 dark:bg-neutral-900/80 px-6 py-4 flex items-center justify-between !h-full">
          <div>
            <UserInfo owner={owner} user={user} />
          </div>
          <div className="flex items-center gap-3">
            <Controls owner={owner} user={user} session={session} />
            <Button isIconOnly variant="ghost" radius="sm" onPress={editOnOpen}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <ProfileAbout name={unslug(name)} />
      </div>
      <EditModal
        user={user}
        isOpen={editIsOpen}
        onOpen={editOnOpen}
        onOpenChange={editOnOpenChange}
      />
    </>
  );
};
