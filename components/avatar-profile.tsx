"use client";

import { Role } from "@prisma/client";
import { LogOut, Moon, Sun } from "lucide-react";
import { useSession } from "next-auth/react";
import { FaUserCog } from "react-icons/fa";

import { useIsMobile } from "@/components/hooks/useIsMobile";
import { useSignOutContext } from "@/components/hooks/useSignOut";
import { formatPrice } from "@/lib/utils";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Switch,
} from "@nextui-org/react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { SignOut } from "./sign-out";

type Props = {
  placement:
    | "top-start"
    | "top"
    | "top-end"
    | "bottom-start"
    | "bottom"
    | "bottom-end"
    | "left-start"
    | "left"
    | "left-end"
    | "right-start"
    | "right"
    | "right-end";
};

export const AvatarProfile = ({ placement }: Props) => {
  const router = useRouter();
  const { data: session } = useSession();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { onOpen } = useSignOutContext();
  const isMobile = useIsMobile();

  return (
    <>
      <Dropdown placement={placement} radius="sm" size={isMobile ? "sm" : "md"}>
        <DropdownTrigger className="cursor-pointer">
          <Avatar
            src={session?.user?.image as string}
            size={isMobile ? "sm" : "md"}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="profile-dropdown">
          <DropdownItem textValue="username" showDivider>
            <div className="flex items-center justify-between">
              <div>{session?.user?.name}</div>
              <div onClick={() => router.push("/topup")}>
                {/* @ts-ignore */}
                {formatPrice(session?.user?.balance)}
              </div>
            </div>
          </DropdownItem>
          {!pathname.includes("/admin") &&
          session?.user?.groups.includes(Role.Admin) ? (
            <DropdownItem
              startContent={<FaUserCog className="w-4 h-4" />}
              onPress={() => router.push("/admin")}
            >
              Admin
            </DropdownItem>
          ) : (
            <DropdownItem
              textValue="admin"
              className="w-0 p-0 hover:bg-transparent"
            ></DropdownItem>
          )}
          <DropdownItem isReadOnly showDivider textValue="dark mode">
            <div className="flex items-center justify-between">
              <div>Theme</div>
              <Switch
                defaultSelected
                size="sm"
                isSelected={theme === "light"}
                onValueChange={() =>
                  theme === "light" ? setTheme("dark") : setTheme("light")
                }
                startContent={<Sun className="w-4 h-4" />}
                endContent={<Moon className="w-4 h-4" />}
              />
            </div>
          </DropdownItem>
          <DropdownItem
            key="sign-out"
            startContent={<LogOut className="w-4 h-4" />}
            onPress={onOpen}
          >
            Sign out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <SignOut />
    </>
  );
};
