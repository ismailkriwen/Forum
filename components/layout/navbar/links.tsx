"use client";

import { unslug } from "@/lib/slugify";
import { cn } from "@/lib/utils";
import { Home, Mail, User, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const routes = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    label: "Messages",
    href: "/conversation",
    icon: Mail,
  },
  {
    label: "Members",
    href: "/members",
    icon: Users,
  },
];

export const NavbarLinks = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <>
      {routes.map((route) => {
        const path =
          route.href === "/profile"
            ? `/profile/${session?.user?.name}`
            : route.href;
        return (
          <Link
            href={path}
            as={path}
            key={route.label}
            className={cn(
              "flex items-center justify-center transition-opacity",
              unslug(pathname) === path && "font-bold text-danger",
              unslug(pathname) !== path && "hover:opacity-80"
            )}
          >
            <div className="w-6 h-6 md:hidden">
              <route.icon />
            </div>
            <span className="max-md:hidden">{route.label}</span>
          </Link>
        );
      })}
    </>
  );
};
