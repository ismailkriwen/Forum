import { Home, Mail, Store, User, Users } from "lucide-react";

const TOPUP_BONUS = 2;
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

const TOPUP_ITEMS = [
  {
    id: "price_1OPS5FG4hGF5jbW4WaKRkvjD",
    price: "1",
  },
  {
    id: "price_1OPS5PG4hGF5jbW4NI7g2qJ1",
    price: "2",
  },
  {
    id: "price_1OPRMMG4hGF5jbW4MgmafufV",
    price: "5",
  },
  {
    id: "price_1OPS4pG4hGF5jbW4LmhLtXQa",
    price: "10",
  },
  {
    id: "price_1OPS5ZG4hGF5jbW4yHhM6A90",
    price: "15",
  },
];

export { NAV_LINKS, SITE_NAME, colors, textColors, TOPUP_BONUS, TOPUP_ITEMS };
