"use client";

import { useIsMobile } from "@/components/hooks/useIsMobile";
import { GetNotificationCount } from "@/lib/actions/notifications";
import { pusherClient } from "@/lib/pusher";
import { Badge } from "@nextui-org/react";
import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import { useMutation, useQuery } from "react-query";

type Props = {};

export const NotificationsTracker = ({}: Props) => {
  const isMobile = useIsMobile();
  const { data: session } = useSession();
  const { data } = useQuery({
    queryFn: async () => await GetNotificationCount(),
  });

  const { mutate } = useMutation({
    mutationFn: async () => await GetNotificationCount(),
  });

  useEffect(() => {
    if (!session || !session?.user) return;
    const channel = pusherClient.subscribe(session?.user.email!);
    channel.bind("notify", () => mutate());

    return () => {
      pusherClient.unsubscribe(session?.user.email!);
    };
  }, [session, session?.user]);

  return (
    <Link href="/notifications">
      <Badge
        size={isMobile ? "sm" : "md"}
        color="danger"
        variant="shadow"
        content={data}
        isInvisible={data == 0}
        className="mt-2"
      >
        <Bell className="w-6 h-6 max-sm:h-6 max-sm:w-6 mt-2" />
      </Badge>
    </Link>
  );
};
