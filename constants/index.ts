import { Home, Mail, Store, User, Users } from "lucide-react";

const SITE_NAME = "Kripsa";
const textColors = {
  Admin: "text-danger",
  Moderator: "text-success",
  Member: "text-default-foreground",
  Hacker: "text-secondary",
};

const colors = {
  Admin: "danger",
  Moderator: "success",
  Member: "default",
  Hacker: "secondary",
};

const NAV_LINKS = [
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
  {
    label: "Shop",
    href: "/shop",
    icon: Store,
  },
];

export { NAV_LINKS, SITE_NAME, colors, textColors };
