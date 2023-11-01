"use client";

import { updateName, updatePassword } from "@/lib/actions/user.actions";
import { Button, Input } from "@nextui-org/react";
import { User } from "@prisma/client";
import { Eye, EyeOff } from "lucide-react";
import { Session } from "next-auth";
import { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  user: User | null | undefined;
  session: Session | null;
};

export const MainSettings = ({ user, session }: Props) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const saveName = async () => {
    if (name == user?.name || name == "") return;
    const res = await updateName({ email: user?.email!, name });
    if (res?.err) toast.error(res.err);
    else toast.info(`Updated username: ${name}`);
  };
  const savePassword = async () => {
    if (password == "") return;
    const res = await updatePassword({ email: user?.email!, password });
    res ? toast.info("Updated password") : toast.error("Something went wrong.");
  };

  return (
    <>
      <div className="flex items-center justify-between gap-5">
        <Input
          variant="underlined"
          placeholder={user?.name!}
          labelPlacement="outside"
          radius="sm"
          size="sm"
          value={name}
          onValueChange={setName}
        />
        <Button
          isDisabled={name == user?.name || name == ""}
          variant="ghost"
          size="sm"
          radius="sm"
          onPress={saveName}
        >
          Save
        </Button>
      </div>
      {user?.email === session?.user?.email && (
        <div className="my-2 flex items-center justify-between gap-5">
          <Input
            label="Password"
            variant="underlined"
            size="sm"
            radius="sm"
            value={password}
            onValueChange={setPassword}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={() => setIsVisible((prev) => !prev)}
              >
                {isVisible ? (
                  <Eye className="w-4 h-4 text-default-400 pointer-events-none" />
                ) : (
                  <EyeOff className="w-4 h-4 text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
          />
          <Button
            isDisabled={password == ""}
            variant="ghost"
            size="sm"
            radius="sm"
            onPress={savePassword}
          >
            Save
          </Button>
        </div>
      )}
    </>
  );
};
