"use client";

import { useToggleSidebarContext } from "@/app/(admin)/components/context/useToggle";
import { BarChart2, Home, LayoutList, LogOut } from "lucide-react";
import Link from "next/link";

import { useSignOutContext } from "@/components/hooks/useSignOut";
import { SignOut } from "@/components/sign-out";
import { usePathname } from "next/navigation";
import { AiOutlineClose } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";

const iconSize = "w-6 h-6";
const adminLinks = [
  {
    item: "stats",
    href: "/admin",
    icon: <BarChart2 className={iconSize} />,
  },
  {
    item: "users",
    href: "/admin/users",
    icon: <FaUsers className={iconSize} />,
  },

  {
    item: "categories",
    href: "/admin/categories",
    icon: <LayoutList className={iconSize} />,
  },
] as const;

export const Sidebar = () => {
  const { open, setOpen } = useToggleSidebarContext();
  const { onOpen } = useSignOutContext();
  const pathname = usePathname();

  return (
    <>
      <div
        className={`h-full max-md:fixed max-md:w-72 max-md:top-0 max-md:bottom-0 max-md:bg-neutral-900 z-10 ${
          open ? "md:w-72 left-0" : "md:w-24 -left-full"
        } shadow-md dark:shadow-gray-200/10 transition-all duration-500`}
      >
        <div className="flex flex-col justify-between h-full">
          <Link
            href="/admin"
            className={`max-md:hidden px-6 py-4 rounded hover:bg-gray-500/20 dark:hover:bg-gray-50/20 transition-colors mx-4 mt-4 flex items-start justify-center gap-2`}
          >
            <div>
              <Home className={iconSize} />
            </div>
            <div className={`${!open && "hidden"}`}>Home</div>
          </Link>
          <div className="md:hidden flex items-center justify-between gap-4">
            <Link
              href="/"
              className={`px-6 py-4 rounded hover:bg-gray-500/20 dark:hover:bg-gray-50/20 transition-colors mx-4 mt-4 flex items-start justify-center gap-2`}
            >
              <div>
                <Home className={iconSize} />
              </div>
              <div className={`${!open && "hidden"}`}>Home</div>
            </Link>
            <div
              className="md:hidden px-4 py-2 mr-4 rounded mt-4 hover:bg-gray-500/20 dark:hover:bg-gray-50/20 transition-colors"
              onClick={() => setOpen(false)}
            >
              <AiOutlineClose className={iconSize} />
            </div>
          </div>
          <div className="mx-4 flex flex-col items-start justify-center gap-2">
            {adminLinks.map((link) => (
              <Link
                href={`${link.href}`}
                key={link.href}
                className={`px-6 py-4 rounded w-full flex items-start justify-center gap-2 ${
                  pathname === `${link.href}`
                    ? "bg-gray-500/20 dark:bg-gray-50/20"
                    : "hover:bg-gray-500/20 dark:hover:bg-gray-50/20"
                } transition-colors cursor-pointer`}
              >
                <div>{link.icon}</div>
                <div className={`${!open && "hidden"} capitalize`}>
                  {link.item}
                </div>
              </Link>
            ))}
          </div>
          <div
            className={`px-6 py-4 rounded hover:bg-gray-500/20 dark:hover:bg-gray-50/20 transition-colors mx-4 mb-4 flex items-start cursor-pointer justify-center gap-2`}
            onClick={onOpen}
          >
            <div>
              <LogOut className={iconSize} />
            </div>
            <div className={`${!open && "hidden"}`}>Sign Out</div>
          </div>
        </div>
      </div>
      <SignOut />
    </>
  );
};
