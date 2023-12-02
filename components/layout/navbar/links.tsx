"use client";

import { NAV_LINKS } from "@/constants";
import { unslug } from "@/lib/slugify";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavbarLinks = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <>
      {NAV_LINKS.map((route) => {
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
              unslug(pathname) === path
                ? "font-bold text-secondary"
                : "hover:opacity-80"
            )}
          >
            <span>{route.label}</span>
          </Link>
        );
      })}
    </>
  );
};
