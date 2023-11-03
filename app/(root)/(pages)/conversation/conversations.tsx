"use client";

import { PageLoading } from "@/components/layout/loading";
import { colors } from "@/constants";
import { getConversations } from "@/lib/actions/conversation.actions";
import { getUserByEmail } from "@/lib/actions/user.actions";
import {
  Avatar,
  Button,
  Input,
  Link,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import {
  Message,
  Conversation as TConversation,
  User as TUser,
} from "@prisma/client";
import { MailPlus, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { NewMessage } from "./new-modal";

interface IConversation extends TConversation {
  messages: Message[];
}

const ROWS_PER_PAGE = 10;

const UserInfo = ({ email }: { email: string }) => {
  const { data: user } = useQuery({
    queryKey: ["profile_by_email__conversation__userInfo"],
    queryFn: async () => await getUserByEmail({ email }),
    enabled: !!email,
  });

  return (
    <Link href={`/profile/${user?.name}`}>
      <Avatar
        src={user?.image as string}
        showFallback
        isBordered
        color={
          user?.role
            ? (colors[user.role] as "primary" | "success" | "default")
            : "default"
        }
      />
    </Link>
  );
};

export const Conversations = () => {
  const { data: session } = useSession();
  const [contentLoading, setContentLoading] = useState(false);
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const fetcher = async () => {
    setContentLoading(true);
    const data = await getConversations();
    data && setConversations(data);
    setContentLoading(false);
  };

  const {
    isOpen: msgIsOpen,
    onOpen: msgOnOpen,
    onOpenChange: msgOnOpenChange,
  } = useDisclosure();

  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(contentLoading ? 0 : 1);
  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredConversations = [...conversations];

    if (hasSearchFilter) {
      filteredConversations = filteredConversations.filter((conversation) =>
        conversation.title?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filteredConversations;
  }, [conversations, filterValue, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / ROWS_PER_PAGE);

  const items = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;

    return filteredItems.slice(start, end).reverse();
  }, [page, filteredItems]);

  const onSearchCahnge = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else setFilterValue("");
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by subject..."
            startContent={<Search className="w-4 h-4" />}
            value={filterValue}
            onValueChange={onSearchCahnge}
            onClear={onClear}
          />
          <div className="flex items-center justify-end gap-2 w-full">
            <Button
              variant="ghost"
              radius="sm"
              startContent={<MailPlus className="w-4 h-4" />}
              onPress={msgOnOpen}
            >
              New Message
            </Button>
          </div>
        </div>
      </div>
    );
  }, [filterValue, onSearchCahnge, onClear, msgOnOpen]);

  const bottomContent = useMemo(() => {
    return (
      <div className="p-2 flex items-center justify-between">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
          size="md"
          radius="full"
        />
        <span className="text-default-400 text-small">
          {page}/{pages}
        </span>
      </div>
    );
  }, [page, pages]);

  useEffect(() => {
    fetcher();
  }, []);

  if (contentLoading) return <PageLoading />;

  return (
    <>
      <Table
        aria-label="conversations-table"
        hideHeader
        isCompact
        fullWidth
        removeWrapper
        topContent={topContent}
        topContentPlacement="outside"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          table: "rounded-b-sm",
          tr: "hover:bg-slate-300/50 dark:hover:bg-neutral-800/50 transition-colors",
          td: "py-4 px-6",
        }}
        className="mt-4"
      >
        <TableHeader>
          <TableColumn align="start">Title</TableColumn>
          <TableColumn align="center">Messages</TableColumn>
          <TableColumn align="end">Creator</TableColumn>
        </TableHeader>
        <TableBody
          loadingState={contentLoading ? "loading" : "idle"}
          loadingContent={<Spinner />}
          emptyContent={!contentLoading && "No messages to display."}
          items={items}
        >
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Link
                  href={`/conversation/${item.id}`}
                  underline="hover"
                  color="foreground"
                >
                  {item.title}
                </Link>
              </TableCell>
              <TableCell className="text-center">
                {item.messages.length}
              </TableCell>
              <TableCell className="flex items-center justify-end">
                <UserInfo email={item.creator} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <NewMessage
        isOpen={msgIsOpen}
        onOpenChange={msgOnOpenChange}
        sender={session?.user as TUser}
      />
    </>
  );
};
