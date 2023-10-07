"use client";

import { colors } from "@/constants";
import { getUsers } from "@/lib/actions/user.actions";
import {
  Avatar,
  Button,
  Input,
  Link,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Role, User } from "@prisma/client";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const filterByItems = ["all", ...Object.keys(Role)];

export const Content = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const router = useRouter();
  if (!searchParams.filter)
    router.push(`/members?page=${searchParams.page}&filter=all`);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [switchingPages, setSwitchingPages] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const [members, setMembers] = useState<User[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const page = Number(searchParams.page);
  const hasSearchFilter = Boolean(filterValue);
  const filteredItems = useMemo(() => {
    let filteredMembers = [...members];

    if (hasSearchFilter) {
      filteredMembers = filteredMembers.filter((member) =>
        member.name?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filteredMembers;
  }, [members, filterValue, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end).reverse();
  }, [page, filteredItems, rowsPerPage]);

  const onSearchCahnge = useCallback(
    (value?: string) => {
      if (value) {
        setFilterValue(value);
        router.push("?page=1");
      } else setFilterValue("");
    },
    [router]
  );

  const onClear = useCallback(() => {
    setFilterValue("");
    router.push("?page=1");
  }, [router]);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center max-md:flex-col justify-between gap-3">
          {!contentLoading && members.length > 0 && (
            <Input
              isClearable
              className="w-full sm:max-w-[44%]"
              placeholder="Search by username..."
              startContent={<Search className="w-4 h-4" />}
              value={filterValue}
              onValueChange={onSearchCahnge}
              onClear={onClear}
            />
          )}
          <div className="w-full flex items-center justify-end gap-2">
            <Select
              defaultSelectedKeys={["all"]}
              onChange={({ target }) => {
                router.push(`?page=1&filter=${String(target.value)}`);
              }}
              labelPlacement="outside"
              size="sm"
              radius="sm"
              className="max-w-[200px]"
              aria-label="role-filter"
            >
              {filterByItems.map((item) => (
                <SelectItem className="capitalize" key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </Select>
            <Select
              defaultSelectedKeys={["10"]}
              onChange={({ target }) => {
                setRowsPerPage(Number(target.value));
                router.push("?page=1");
              }}
              size="sm"
              radius="sm"
              className="max-w-[100px]"
              labelPlacement="outside"
              aria-label="selection"
            >
              <SelectItem key="5">5</SelectItem>
              <SelectItem key="10">10</SelectItem>
              <SelectItem key="15">15</SelectItem>
            </Select>
          </div>
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchCahnge,
    onClear,
    rowsPerPage,
    contentLoading,
    members,
    router,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="p-2 flex items-center justify-between">
        <div className="w-fit flex items-center gap-1">
          {!contentLoading && members.length > 0 && (
            <>
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
              <Pagination
                isCompact
                showShadow
                isDisabled={switchingPages}
                color="primary"
                page={Number(searchParams.page)}
                total={pages}
                onChange={(e) => {
                  setSwitchingPages(true);
                  router.push(`?page=${e}`);
                  setSwitchingPages(false);
                }}
                classNames={{
                  wrapper: "bg-transparent",
                  item: "bg-transparent rounded-none",
                  cursor: "rounded-md",
                }}
              />
              <Button
                isDisabled={
                  Number(searchParams.page) === pages || switchingPages
                }
                isIconOnly
                size="sm"
                radius="sm"
                variant="ghost"
                onClick={() => {
                  if (Number(searchParams.page) === pages || switchingPages)
                    return;
                  setSwitchingPages(true);
                  router.push(`?page=${Number(searchParams.page) + 1}`);
                  setSwitchingPages(false);
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
        <span className="text-default-400 text-small">
          {page}/{pages}
        </span>
      </div>
    );
  }, [page, pages, contentLoading, members, switchingPages, router]);

  const fetcher = useCallback(async () => {
    setContentLoading(true);
    const query =
      searchParams.filter == "all"
        ? {
            include: { posts: true, likes: true },
          }
        : {
            include: { posts: true, likes: true },
            where: { role: searchParams.filter },
          };
    const data = await getUsers(query);
    data && setMembers(data as User[]);
    setContentLoading(false);
  }, [searchParams]);

  useEffect(() => {
    fetcher();
  }, [fetcher]);

  return (
    <>
      <Table
        aria-label="Members table"
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
          <TableColumn align="start">Avatar</TableColumn>
          <TableColumn align="center">Username</TableColumn>
          <TableColumn align="end">Date Joined</TableColumn>
        </TableHeader>
        <TableBody
          loadingState={contentLoading ? "loading" : "idle"}
          loadingContent={<Spinner color="default" />}
          emptyContent={!contentLoading && "No members to display."}
          items={items}
        >
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Avatar src={item.image!} showFallback />
              </TableCell>
              <TableCell>
                <Link
                  href={`/profile/${item.name}`}
                  underline="hover"
                  /* @ts-ignore */
                  color={colors[item.role]}
                  isExternal
                >
                  {item.name}
                </Link>
              </TableCell>
              <TableCell className="flex items-center justify-end">
                Date
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};
