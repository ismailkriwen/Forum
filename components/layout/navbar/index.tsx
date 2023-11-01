"use client";

import { useSession } from "next-auth/react";

import { Button } from "@nextui-org/react";
import { NavbarLinks } from "./links";

import { AvatarProfile } from "@/components/avatar-profile";
import { useSignInContext } from "@/components/hooks/useSignIn";
import { NotificationsTracker } from "@/components/notifications-tracker";
import { SearchComponent } from "@/components/search";
import { SignIn } from "@/components/sign-in";
import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
  const { data: session } = useSession();
  const { onOpen } = useSignInContext();

  return (
    <div className="shadow-md dark:shadow-white/10 sticky inset-x-0 top-0 !z-50 bg-neutral-100 dark:bg-black dark:text-white">
      <div className="container flex items-center justify-between py-2">
        <Link href="/">
          <div className="w-full flex items-center gap-2">
            <Image src="/icon.png" alt="Icon" width={24} height={24} />
            <span className="text-secondary font-bold text-lg">kяipsa</span>
          </div>
        </Link>
        {session?.user && (
          <div className="max-md:hidden flex items-center justify-center gap-3">
            <NavbarLinks />
          </div>
        )}
        <div>
          {session?.user ? (
            <div className="flex items-center justify-end">
              <span className="max-md:hidden flex items-center gap-x-4">
                <NotificationsTracker />
                {session?.user && <SearchComponent />}
                <AvatarProfile placement="bottom-end" />
              </span>
              <div className="md:hidden flex gap-2 items-center">
                {session?.user && <SearchComponent />}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Button
                onClick={onOpen}
                radius="sm"
                className="max-md:text-sm"
                variant="ghost"
                color="secondary"
              >
                Sign In
              </Button>
              <SignIn />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
