"use client";

import Link from "next/link";
import { BsDiscord } from "react-icons/bs";
import { FaFacebook, FaInstagramSquare } from "react-icons/fa";
import { routes } from "./navbar/links";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@nextui-org/button";
import { SignIn } from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
import { useSignUpContext } from "@/components/hooks/useSignUp";
import { useSignInContext } from "@/components/hooks/useSignIn";

const socialLinks = [
  {
    href: "https://discord.com/",
    icon: BsDiscord,
    color: "text-indigo-600"
  },
  {
    href: "https://facebook.com/",
    icon: FaFacebook,
    color: "text-blue-500"
  },
  {
    href: "https://instagram.com/",
    icon: FaInstagramSquare,
    color: "text-rose-600"
  },
];

export const Sidebar = () => {
  const pathname = usePathname()
  const { onOpen } = useSignInContext();
  const { onOpen: signUpOnOpen } = useSignUpContext();

  return (
    <div className="space-y-4 py-4 flex justify-between flex-col h-full bg-black/75 text-white">
      <div className="px-3 py-2 flex-1 mt-5">
        <div className="space-y-1">
          {routes.map(route => (
            <Link href={route.href} key={route.href} className={cn("text-sm group flex p-3 w-full justify-start font-medium cursor-pointer", pathname === route.href ? "text-white bg-white/10" : "text-zinc-400")}>
            <div className="flex items-center flex-1">
              <route.icon className="h-5 w-5 mr-3" />
              {route.label}
            </div>
          </Link>
          ))}
        </div>
      </div>
      <div>
        <div className="flex gap-x-5 items-center justify-center mb-5">
          {socialLinks.map(link => (
            <Link href={link.href} key={link.href}>
              <link.icon className={cn("h-6 w-6", link.color)} />
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-2 px-4">
          <Button
            onClick={onOpen}
            radius="sm"
            variant="light"
            color="primary"
            className="w-full"
          >
            Sign In
          </Button>
          <Button
            onClick={signUpOnOpen}
            radius="sm"
            variant="ghost"
            color="primary"
            className="w-full"
          >
            Sign Up
          </Button>
          <SignIn />
          <SignUp />
        </div>
      </div>
    </div>
  );
};
