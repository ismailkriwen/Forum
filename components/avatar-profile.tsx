"use client";

import { Role } from "@prisma/client";
import { LogOut, Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import { FaUserCog } from "react-icons/fa";

import { useSignOutContext } from "@/components/hooks/useSignOut";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { SignOut } from "./sign-out";

export const AvatarProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const pathname = usePathname();
  const { onOpen } = useSignOutContext();

  return (
    <>
      <Dropdown placement="bottom-end" radius="sm">
        <DropdownTrigger className="cursor-pointer">
          <Avatar src={session?.user?.image as string} />
        </DropdownTrigger>
        <DropdownMenu aria-label="profile-dropdown">
          <DropdownItem showDivider>{session?.user?.name}</DropdownItem>
          <DropdownItem
            startContent={<Settings className="w-4 h-4" />}
            onPress={() =>
              router.push(`/profile/${session?.user?.name}/settings`)
            }
          >
            Settings
          </DropdownItem>
          <DropdownItem
            key="sign-out"
            showDivider={
              !pathname.includes("/admin") && session?.user?.role === Role.Admin
            }
            startContent={<LogOut className="w-4 h-4" />}
            onPress={onOpen}
          >
            Sign out
          </DropdownItem>
          {!pathname.includes("/admin") &&
          session?.user?.role === Role.Admin ? (
            <DropdownItem
              startContent={<FaUserCog className="w-4 h-4" />}
              onPress={() => router.push("/admin")}
            >
              Admin
            </DropdownItem>
          ) : (
            <DropdownItem className="w-0 p-0 hover:bg-transparent"></DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
      <SignOut />
    </>
  );
};
