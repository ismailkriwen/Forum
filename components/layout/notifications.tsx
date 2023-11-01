import {
  getNotifications,
  seenNotifications,
} from "@/lib/actions/notifications";
import {
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Link,
  Spinner,
} from "@nextui-org/react";
import { Notification } from "@prisma/client";
import { Bell } from "lucide-react";
import { Fragment, useEffect, useState } from "react";

import { user_date } from "@/lib/date";
import { getPostTopicById } from "@/lib/helpers";
import { pusherClient } from "@/lib/pusher";
import { Session } from "next-auth";

import { useMutation, useQuery } from "react-query";

export const Notifications = ({ session }: { session: Session | null }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => await getNotifications(),
  });

  const { mutate } = useMutation({
    mutationFn: async () => await getNotifications(),
  });

  const markAsRead = async () => {
    if (!isVisible) return;
    await seenNotifications();
    setIsVisible(true);
  };

  useEffect(() => {
    const channel = pusherClient.subscribe(session?.user.email!);
    channel.bind("notify", () => {
      mutate();
      setIsVisible(true);
    });

    return () => {
      pusherClient.unsubscribe(session?.user.email!);
    };
  }, [session]);

  useEffect(() => {
    if (data) {
      const s = data.filter((e) => !e.seen);
      if (s.length == 0) isVisible === false && setIsVisible(false);
      else setIsVisible(true);
    } else isVisible === false && setIsVisible(false);
  }, [data, isVisible]);

  return (
    <>
      <Dropdown placement="bottom-end" radius="sm">
        <DropdownTrigger as="button">
          <div className="relative cursor-pointer flex items-center">
            <Badge
              content={data?.length}
              isInvisible={!isVisible}
              color="danger"
            >
              <Bell className="w-5 h-5" />
            </Badge>
          </div>
        </DropdownTrigger>
        <DropdownMenu
          className="w-96 max-h-72 max-sm:w-full overflow-y-auto"
          aria-label="notifications"
        >
          {isLoading ? (
            <DropdownItem className="text-center" textValue="Loading">
              <Spinner color="default" />
            </DropdownItem>
          ) : data && data?.length > 0 ? (
            data?.map((item: Notification, idx) => (
              <DropdownSection key={idx}>
                {idx === 0 ? (
                  <DropdownItem
                    aria-label="mark as read"
                    showDivider
                    className="data-[hover]:bg-transparent"
                  >
                    <Button
                      variant="ghost"
                      radius="sm"
                      size="sm"
                      onPress={markAsRead}
                    >
                      Mark as Read
                    </Button>
                  </DropdownItem>
                ) : (
                  <DropdownItem
                    textValue="nothing"
                    aria-label="empty"
                    className="data-[hover]:bg-transparent p-0 h-0 m-0"
                  ></DropdownItem>
                )}
                <DropdownItem isReadOnly key={item.id} textValue="placeholder">
                  {item.type === "quote" ? (
                    <Fragment key={item.id}>
                      <div>
                        <Link
                          href={`/profile/${item.from}`}
                          underline="hover"
                          color="secondary"
                        >
                          {item.from}
                        </Link>{" "}
                        Quoted you in{" "}
                        <Link
                          href={`/topics/${item.post}`}
                          color="secondary"
                          underline="hover"
                        >
                          {getPostTopicById(item.post!)}
                        </Link>
                      </div>
                      <div className="italic text-xs text-default-400 pt-1">
                        {user_date(item.createdAt).time} at{" "}
                        {user_date(item.createdAt).time}
                      </div>
                    </Fragment>
                  ) : item.type === "liked" ? (
                    <Fragment key={item.id}>
                      <div>
                        <Link
                          href={`/profile/${item.from}`}
                          underline="hover"
                          color="secondary"
                        >
                          {item.from}
                        </Link>{" "}
                        Liked your{" "}
                        <Link
                          href={`/topics/${item.post}`}
                          color="secondary"
                          underline="hover"
                        >
                          post
                        </Link>
                      </div>
                      <div className="italic text-xs text-default-400 pt-1">
                        {user_date(item.createdAt).time} at{" "}
                        {user_date(item.createdAt).time}
                      </div>
                    </Fragment>
                  ) : (
                    <Fragment key={item.id}>
                      <div>
                        <Link
                          href={`/profile/${item.from}`}
                          underline="hover"
                          color="secondary"
                        >
                          {item.from}
                        </Link>{" "}
                        Posted in{" "}
                        <Link
                          href={`/topics/${item.post}`}
                          color="secondary"
                          underline="hover"
                        >
                          {getPostTopicById(item.post!)}
                        </Link>
                      </div>
                      <div className="italic text-xs text-default-400 pt-1">
                        {user_date(item.createdAt).time} at{" "}
                        {user_date(item.createdAt).time}
                      </div>
                    </Fragment>
                  )}
                </DropdownItem>
              </DropdownSection>
            ))
          ) : (
            <DropdownItem className="text-center text-lg">
              No Notifications.
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    </>
  );
};
