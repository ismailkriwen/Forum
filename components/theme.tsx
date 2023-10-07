"use client";

import { useTheme } from "next-themes";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { Moon, Settings, Sun } from "lucide-react";

export const ThemeController = () => {
  const { setTheme } = useTheme();

  return (
    <>
      <Dropdown showArrow placement="left-end" radius="sm">
        <DropdownTrigger>
          <Settings className="w-6 h-6 cursor-pointer fixed bottom-5 right-4" />
        </DropdownTrigger>
        <DropdownMenu aria-label="theme-controller">
          <DropdownItem
            onPress={() => setTheme("light")}
            startContent={<Sun className="w-4 h-4" />}
            key="light"
          >
            Light
          </DropdownItem>
          <DropdownItem
            onPress={() => setTheme("dark")}
            startContent={<Moon className="w-4 h-4" />}
            key="dark"
          >
            Dark
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};
