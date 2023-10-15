"use client";

import { getUser, updateInfo } from "@/lib/actions/user.actions";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

export const Settings = ({ name }: { name: string }) => {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState("");

  const { data: user, isLoading } = useQuery({
    queryKey: ["settings_profile"],
    queryFn: async () => await getUser({ name }),
  });

  const submit = async () => {
    setUpdating(true);
    const res = await updateInfo({
      email: user?.email!,
      bio: bio!,
      location: location!,
      gender: gender!,
    });
    if (res) {
      toast.success("Settings Updated.");
      router.push(`/profile/${name}`);
    } else toast.error("Something went wrong.");
    setUpdating(false);
  };

  useEffect(() => {
    if (bio == "" || location == "" || gender == "" || !user) return;
    user.bio && setBio(user.bio);
    user.location && setLocation(user.location);
    user.gender && setGender(user.gender);
  }, [user, bio, gender, location]);

  return (
    <>
      <div className="rounded bg-gray-200/70 dark:bg-neutral-800/90 min-h-[200px] w-fit min-w-[300px] mt-6 container py-2">
        {isLoading ? (
          <div className="w-full !h-full flex items-center justify-center">
            <Spinner color="default" />
          </div>
        ) : (
          <>
            <div className="dark:text-white text-black py-3 text-2xl">
              Update Settings
            </div>
            <div className="md:w-[400px] max-md:w-full h-full flex items-center flex-col gap-2">
              <Textarea
                variant="bordered"
                radius="sm"
                label="Bio"
                value={bio!}
                onChange={({ target }) => setBio(target.value)}
              />
              <Input
                variant="bordered"
                radius="sm"
                label="Location"
                value={location!}
                onChange={({ target }) => setLocation(target.value)}
              />
              <Select
                labelPlacement="outside"
                aria-label="gender"
                variant="bordered"
                radius="sm"
                onChange={({ target }) => setGender(target.value)}
              >
                <SelectItem key="Male" color="primary">
                  Male
                </SelectItem>
                <SelectItem key="Female" color="danger">
                  Female
                </SelectItem>
              </Select>
              <div className="flex items-center justify-end w-full pb-1 pt-3">
                <Button
                  color="success"
                  variant="ghost"
                  isDisabled={
                    (bio == user?.bio &&
                      location == user?.location &&
                      gender == user?.gender) ||
                    (bio == "" && location == "" && gender == "")
                  }
                  isLoading={updating}
                  onPress={submit}
                >
                  Update
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
