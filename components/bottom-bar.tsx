"use client";

import { routes } from "@/components/layout/navbar/links";
import { cn } from "@/lib/utils";
import { Link } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { AvatarProfile } from "@/components/avatar-profile";
import { unslug } from "@/lib/slugify";

export const BottomBar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 bg-neutral-100 dark:bg-neutral-900 shadow-[0_-4px_16px_-1px] dark:shadow-white/10 px-4 !z-50">
      <div className="container flex items-center justify-between w-full">
        {routes.map((route) => {
          const path =
            route.href === "/profile"
              ? `/profile/${session?.user?.name}`
              : route.href;
          return (
            <Link
              href={path}
              key={path}
              color="foreground"
              className={cn(
                "flex flex-col pt-3 pb-1.5",
                unslug(pathname) === unslug(path) &&
                  "text-secondary border-t-4 border-t-secondary px-2"
              )}
            >
              <route.icon className="w-5 h-5 max-sm:h-6 max-sm:w-6" />
              <span className="max-sm:hidden">{route.label}</span>
            </Link>
          );
        })}
        <AvatarProfile placement="top" />
      </div>
    </div>
  );
};
