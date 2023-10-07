"use client";

import { useSession } from "next-auth/react";

import { Button } from "@nextui-org/react";
import { NavbarLinks } from "./links";

import { AvatarProfile } from "@/components/avatar-profile";
import { useSignInContext } from "@/components/hooks/useSignIn";
import { useSignUpContext } from "@/components/hooks/useSignUp";
import { SignIn } from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
import Link from "next/link";
import { Notifications } from "@/components/layout/notifications";
import { MobileSide } from "./mobile-sidebar";

export const Navbar = () => {
  const { data: session } = useSession();
  const { onOpen } = useSignInContext();
  const { onOpen: signUpOnOpen } = useSignUpContext();

  return (
    <div className="shadow-md dark:shadow-gray-200/25">
      <div className="container flex items-center justify-between py-2">
        <Link href="/" className="font-extrabold text-2xl">
          Forum
        </Link>
        {session?.user && (
          <div className="max-md:hidden flex items-center justify-center gap-3">
            <NavbarLinks />
          </div>
        )}
        <div>
          {session?.user ? (
            <div className="flex items-center justify-end gap-3">
              <span className="max-md:hidden">
                <AvatarProfile />
              </span>
              <div className="md:hidden flex gap-x-1 items-center">
                <Notifications session={session} />
                <MobileSide />
              </div>
            </div>
          ) : (
            <>
              <Button
                onClick={onOpen}
                radius="sm"
                variant="light"
                color="primary"
                className="mr-2 max-md:text-sm"
              >
                Sign In
              </Button>
              <Button
                onClick={signUpOnOpen}
                radius="sm"
                variant="ghost"
                color="primary"
                className="max-md:text-sm"
              >
                Sign Up
              </Button>
              <SignIn />
              <SignUp />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
