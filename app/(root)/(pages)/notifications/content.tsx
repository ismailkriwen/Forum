"use client";

import {
  MarkNotificationsAsRead,
  getNotifications,
} from "@/lib/actions/notifications";
import { user_date } from "@/lib/date";
import { getPostTopicById } from "@/lib/helpers";
import { Button, Link, Spinner } from "@nextui-org/react";
import { Fragment, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

const Post = ({ id, post }: { id: string; post: string | null }) => {
  const [title, setTitle] = useState("");
  const fetcher = async () => {
    const res = await getPostTopicById(id);
    res && setTitle(res);
  };

  useEffect(() => {
    fetcher();
  }, [fetcher]);

  return (
    <>
      <Link href={`/topics/${post}`} color="secondary" underline="hover">
        {title}
      </Link>
    </>
  );
};

export const NotificationsComponent = () => {
  const [loading, setLoading] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["getting_notifications"],
    queryFn: async () => await getNotifications(),
  });

  const markAsRead = async () => {
    try {
      setLoading(true);
      const res = await MarkNotificationsAsRead();
      res
        ? toast.info("Marked all as Read")
        : toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark:bg-neutral-900 rounded-md px-6 py-3 mt-4">
      {isLoading ? (
        <div className="text-center h-full">
          <Spinner color="default" />
        </div>
      ) : data?.length == 0 ? (
        <div className="text-center text-default-500">No notifications.</div>
      ) : (
        <>
          <div className="pb-2 flex items-center justify-end">
            <Button
              radius="sm"
              variant="ghost"
              onPress={markAsRead}
              isDisabled={data?.filter((e) => !e.seen).length == 0}
              isLoading={loading}
            >
              Mark all as Read
            </Button>
          </div>
          <div className="space-y-3">
            {data?.map((notification) => (
              <div
                key={notification.id}
                className={`flex flex-col gap-1 ${
                  notification.seen && "opacity-75"
                }`}
              >
                <div>
                  {notification.type === "quote" ? (
                    <Fragment key={notification.id}>
                      <div>
                        <Link
                          href={`/profile/${notification.from}`}
                          underline="hover"
                          color="secondary"
                        >
                          {notification.from}
                        </Link>{" "}
                        Quoted you in{" "}
                        <Post id={notification.id} post={notification.post} />
                      </div>
                      <div className="italic text-xs text-default-400 pt-1">
                        {user_date(notification.createdAt).time} at{" "}
                        {user_date(notification.createdAt).time}
                      </div>
                    </Fragment>
                  ) : notification.type === "liked" ? (
                    <Fragment key={notification.id}>
                      <div>
                        <Link
                          href={`/profile/${notification.from}`}
                          underline="hover"
                          color="secondary"
                        >
                          {notification.from}
                        </Link>{" "}
                        Liked your post in{" "}
                        <Post id={notification.id} post={notification.post} />
                      </div>
                      <div className="italic text-xs text-default-400 pt-1">
                        {user_date(notification.createdAt).time} at{" "}
                        {user_date(notification.createdAt).time}
                      </div>
                    </Fragment>
                  ) : notification.type == "follow" ? (
                    <Fragment key={notification.id}>
                      <div>
                        <Link
                          href={`/profile/${notification.from}`}
                          underline="hover"
                          color="secondary"
                        >
                          {notification.from}
                        </Link>{" "}
                        Followed you
                      </div>
                      <div className="italic text-xs text-default-400 pt-1">
                        {user_date(notification.createdAt).time} at{" "}
                        {user_date(notification.createdAt).time}
                      </div>
                    </Fragment>
                  ) : (
                    <Fragment key={notification.id}>
                      <div>
                        <Link
                          href={`/profile/${notification.from}`}
                          underline="hover"
                          color="secondary"
                        >
                          {notification.from}
                        </Link>{" "}
                        You follow posted in{" "}
                        <Post id={notification.id} post={notification.post} />
                      </div>
                      <div className="italic text-xs text-default-400 pt-1">
                        {user_date(notification.createdAt).time} at{" "}
                        {user_date(notification.createdAt).time}
                      </div>
                    </Fragment>
                  )}
                  )
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
