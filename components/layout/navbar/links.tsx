"use client";

import { cn } from "@/lib/utils";
import { Home, Mail, User, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const routes = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  /* {
    label: "About",
    route: "/about",
    icon: BsExclamationCircle,
  },
  {
    label: "Contact",
    route: "/contact",
    icon: Phone,
  }, */
  {
    label: "Profile",
    href: `/profile/`,
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
  const pathname = usePathname();

  return (
    <>
      {routes.map((route) => (
        <Link
          href={route.href}
          as={route.href}
          key={route.label}
          className={cn("flex items-center justify-center transition", pathname === route.href ? "font-bold text-danger" : "text-white hover:text-danger/70")}
        >
          <div className="w-6 h-6 md:hidden">
            <route.icon />
          </div>
          <span className="max-md:hidden">{route.label}</span>
        </Link>
      ))}
    </>
  );
};
