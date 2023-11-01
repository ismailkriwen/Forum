"use client";

import {
  getAnnouncement,
  updateAnnouncement,
} from "@/lib/actions/general.actions";
import { Button, Spinner, Switch, Textarea } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const Announcement = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [content, setContent] = useState("");

  const fetcher = useCallback(async () => {
    setIsLoading(true);
    const res = await getAnnouncement();
    if (res) {
      setContent(res.content as string);
      setIsEnabled(res.shown);
    }
    setIsLoading(false);
  }, []);

  const update = async () => {
    setIsUpdating(true);
    const res = await updateAnnouncement({ content, shown: isEnabled });
    res
      ? toast.success("Updated Announcement")
      : toast.error("Something went wrong");
    setIsUpdating(false);
  };

  useEffect(() => {
    fetcher();
  }, [fetcher]);

  return (
    <>
      <div className="rounded py-2 px-4 dark:bg-neutral-900 bg-neutral-200 text-white">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Spinner color="default" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-semibold">
                Announcement Settings
              </div>
              <Switch
                isSelected={isEnabled}
                onValueChange={setIsEnabled}
                aria-label="enabled"
                size="sm"
                className="z-0"
              />
            </div>
            <div className="mt-4">
              <Textarea
                variant="bordered"
                radius="sm"
                readOnly={!isEnabled}
                isDisabled={!isEnabled}
                value={content}
                onChange={({ target }) => setContent(target.value)}
                label="Content"
              />
            </div>
            <div className="flex items-center justify-end mt-3 pb-1">
              <Button
                isLoading={isUpdating}
                variant="ghost"
                color="primary"
                onPress={update}
              >
                {isUpdating ? "Saving" : "Save"}
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
