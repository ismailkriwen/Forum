"use client";

import { AvatarProfile } from "@/components/avatar-profile";
import { Menu } from "lucide-react";
import { useToggleSidebarContext } from "./context/useToggle";

export const Navbar = () => {
  const { open, setOpen } = useToggleSidebarContext();

  return (
    <div
      className={`shadow-md dark:shadow-gray-200/10 ${!open && "w-full"} h-14`}
    >
      <div className="flex items-center justify-between px-4 py-2">
        <Menu
          className="cursor-pointer w-8 h-8"
          onClick={() => setOpen((prev) => !prev)}
        />
        <div>
          <AvatarProfile placement="bottom" />
        </div>
      </div>
    </div>
  );
};
