"use client";

import { MiniProfile } from "@/components/mini-profile";
import { textColors } from "@/constants";
import { getConversation } from "@/lib/actions/conversation.actions";
import { user_date } from "@/lib/date";
import { Button, Divider, Pagination, useDisclosure } from "@nextui-org/react";
import {
  type Conversation as TConversation,
  type Message as TMessage,
  type User as TUser,
} from "@prisma/client";
import { ChevronLeft, ChevronRight, Reply } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ReplyModal } from "./reply";
import { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> => {
  const conversation = await getConversation({ id: params.id });
  if (!conversation)
    return { title: "Not Found", description: "This page is not found" };

  return {
    title: conversation.title,
  };
};

interface IMessage extends TMessage {
  user: TUser;
}

const MESSAGES_PER_PAGE = 10;

export const Messages = ({
  id,
  searchParams,
}: {
  id: string;
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [switchingPages, setSwitchingPages] = useState(false);
  const [conversation, setConversation] = useState<TConversation>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const page = Number(searchParams.page);
  const pages = Math.ceil(messages.length / MESSAGES_PER_PAGE);

  const items = useMemo(() => {
    const start = (page - 1) * MESSAGES_PER_PAGE;
    const end = start + MESSAGES_PER_PAGE;

    return messages.slice(start, end);
  }, [page, messages]);

  const fetcher = useCallback(async () => {
    setIsLoading(true);
    const data = await getConversation({ id });
    if (data) {
      setConversation(data);
      setMessages(data.messages);
    }
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    fetcher();
  }, [fetcher]);

  return (
    <>
      <div className="my-4">
        <div className="bg-neutral-200 dark:bg-neutral-900 flex items-center justify-between px-8 py-2 rounded-t-md">
          <div>{conversation?.title}</div>
          <Button
            variant="light"
            startContent={<Reply className="w-5 h-5" />}
            radius="sm"
            onPress={onOpen}
          >
            Reply
          </Button>
        </div>
        <div className="bg-neutral-200 dark:bg-neutral-900 flex items-center gap-2 px-8 py-2 mt-2">
          <Button
            isDisabled={Number(searchParams.page) === 1 || switchingPages}
            isIconOnly
            onClick={() => {
              if (Number(searchParams.page) === 1) return;
              setSwitchingPages(true);
              router.push(`?page=${Number(searchParams.page) - 1}`);
              setSwitchingPages(false);
            }}
            size="sm"
            radius="sm"
            variant="ghost"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {!isLoading && (
            <Pagination
              radius="full"
              size="sm"
              isCompact
              showShadow
              isDisabled={switchingPages}
              initialPage={Number(searchParams.page)}
              page={Number(searchParams.page)}
              total={pages}
              onChange={(e) => {
                setSwitchingPages(true);
                router.push(`?page=${e}`);
                setSwitchingPages(false);
              }}
            />
          )}
          <Button
            isDisabled={Number(searchParams.page) === pages || switchingPages}
            isIconOnly
            size="sm"
            radius="sm"
            variant="ghost"
            onClick={() => {
              if (Number(searchParams.page) === pages || switchingPages) return;
              setSwitchingPages(true);
              router.push(`?page=${Number(searchParams.page) + 1}`);
              setSwitchingPages(false);
            }}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="z-0">
          {items.map((message) => (
            <div className="flex items-strech gap-2 mt-2" key={message.id}>
              <MiniProfile email={message.user.email!} />
              <div className="bg-neutral-100 dark:bg-neutral-950 px-6 py-2 w-full flex flex-col">
                <div className="px-6 py-2 flex items-center justify-between text-small">
                  <div className={`md:hidden ${textColors[message.user.role]}`}>
                    {message.user.name}
                  </div>
                  <div className="italic">{`${
                    user_date(message.createdAt).date
                  } at ${user_date(message.createdAt).time}`}</div>
                </div>
                <Divider />
                <div className="py-2 px-6">{message.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ReplyModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        id={id}
        title={conversation?.title as string}
        mutate={fetcher}
      />
    </>
  );
};
