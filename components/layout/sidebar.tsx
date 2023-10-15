"use client";

import { cn } from "@/lib/utils";
import { Avatar, Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { routes } from "./navbar/links";
import { useSignOutContext } from "../hooks/useSignOut";
import { LogOut, Settings, UserCog } from "lucide-react";
import { Role } from "@prisma/client";
import { unslug } from "@/lib/slugify";

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { onOpen } = useSignOutContext();

  return (
    <div className="space-y-4 py-4 flex justify-between flex-col h-full bg-slate-800/50 text-white">
      <div className="px-3 py-2 flex-1">
        <div className="space-y-1 mt-5">
          {routes.map((route) => {
            const path =
              route.href === "/profile"
                ? `/profile/${session?.user?.name}`
                : route.href;
            return (
              <Link
                href={path}
                key={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer",
                  unslug(pathname) === path
                    ? "text-white bg-white/10"
                    : "text-zinc-400"
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className="h-5 w-5 mr-3" />
                  {route.label}
                </div>
              </Link>
            );
          })}
          <Link
            href={`/profile/${session?.user?.name}/settings`}
            className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer text-zinc-400"
          >
            <div className="flex items-center flex-1">
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </div>
          </Link>
          {session?.user?.role == Role.Admin && (
            <Link
              href="/admin"
              className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer text-zinc-400"
            >
              <div className="flex items-center flex-1">
                <UserCog className="h-5 w-5 mr-3" />
                Admin
              </div>
            </Link>
          )}
        </div>
      </div>
      <div className="px-3 py-2 bg-white/10 mx-2 rounded-lg flex items-center justify-between">
        <div className="flex items-start gap-3">
          <Avatar
            src={session?.user?.image!}
            showFallback
            onClick={() => router.push(`/profile/${session?.user?.name}`)}
          />
          <div className="flex flex-col text-small">
            <div>{session?.user?.name}</div>
            <div className="text-sm text-default-400">
              {session?.user?.role}
            </div>
          </div>
        </div>
        <div>
          <Button variant="light" isIconOnly radius="sm" onPress={onOpen}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
