"use client";

import { PageLoading } from "@/components/layout/loading";
import { getUsers } from "@/lib/actions/user.actions";
import { Role, type User as TUser } from "@prisma/client";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
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
  User,
  useDisclosure,
} from "@nextui-org/react";
import { ExternalLink, Pen, Search, Trash } from "lucide-react";
import Link from "next/link";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { DeleteModal } from "./modals/delete";
import { EditModal } from "./modals/edit";

export interface IUser {
  name: string | null;
  email: string | null;
  groups: Role[] | null;
}

export const Users = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<TUser[]>([]);
  const [selectedUserToEdit, setSelectedUserToEdit] = useState<IUser | null>(
    null
  );

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onOpenChange: deleteOnOpenChange,
  } = useDisclosure();

  const [filterValue, setFilterValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter)
      filteredUsers = filteredUsers.filter((user) =>
        user.name?.toLowerCase().includes(filterValue.toLowerCase())
      );
    return filteredUsers;
  }, [users, filterValue, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else setFilterValue("");
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const users = await getUsers({
      select: {
        id: true,
        name: true,
        role: true,
        groups: true,
        email: true,
        image: true,
      },
    });
    setUsers(users);
    setLoading(false);
  };

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<Search className="w-4 h-4" />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex items-center justify-end gap-2 w-full">
            <span>Rows per page:</span>
            <Select
              className="text-default-400 text-small w-20"
              size="sm"
              radius="sm"
              onChange={onRowsPerPageChange}
              aria-label="Rows per page"
              labelPlacement="outside"
              defaultSelectedKeys={["5"]}
            >
              <SelectItem key="5" value="5">
                5
              </SelectItem>
              <SelectItem key="10" value="10">
                10
              </SelectItem>
              <SelectItem key="15" value="15">
                15
              </SelectItem>
            </Select>
          </div>
        </div>
      </div>
    );
  }, [filterValue, onSearchChange, onRowsPerPageChange, onClear]);

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
          Total {users.length} Users
        </span>
      </div>
    );
  }, [page, pages, users.length, setPage]);

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <PageLoading />;

  return (
    <>
      <Table
        aria-label="Users table"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        topContent={topContent}
        topContentPlacement="outside"
        fullWidth
        removeWrapper
        className="z-0"
      >
        <TableHeader>
          <TableColumn align="start">Name</TableColumn>
          <TableColumn align="start">Email</TableColumn>
          <TableColumn align="start">Role</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={"No users found"}
          items={items}
          loadingState={loading ? "loading" : "idle"}
          loadingContent={<Spinner />}
        >
          {items.map((user) => {
            return (
              <TableRow key={user.id}>
                <TableCell>
                  <User
                    avatarProps={{ radius: "full", src: user.image as string }}
                    description={user.email}
                    name={user.name}
                  >
                    {user.name}
                  </User>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <p className="text-bold text-small capitalize">
                      {user.role}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="relative flex justify-end items-center gap-2">
                    <Dropdown
                      placement="left-start"
                      size="sm"
                      radius="sm"
                      showArrow
                    >
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onClick={() => {
                            const { name, email, groups } = user;
                            setSelectedUserToEdit({
                              name,
                              email,
                              groups,
                            });
                          }}
                        >
                          <BiDotsVerticalRounded className="w-5 h-5" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="user-dropdown">
                        <DropdownItem
                          startContent={<ExternalLink className="w-4 h-4" />}
                          className="w-full"
                        >
                          <Link
                            href="/profile"
                            as={`/profile/${user?.name}`}
                            target="_blank"
                          >
                            Visit Profile
                          </Link>
                        </DropdownItem>
                        <DropdownItem
                          startContent={<Pen className="w-4 h-4" />}
                          onPress={onOpen}
                        >
                          Edit
                        </DropdownItem>
                        {user?.role !== Role.Admin ? (
                          <DropdownItem
                            startContent={<Trash className="w-4 h-4" />}
                            color="danger"
                            className="text-danger"
                            onPress={deleteOnOpen}
                          >
                            Delete
                          </DropdownItem>
                        ) : (
                          <DropdownItem className="w-0 p-0 hover:bg-transparent"></DropdownItem>
                        )}
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <EditModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        user={selectedUserToEdit}
        mutate={fetchUsers}
      />
      <DeleteModal
        isOpen={deleteIsOpen}
        onOpenChange={deleteOnOpenChange}
        user={selectedUserToEdit}
        mutate={fetchUsers}
      />
    </>
  );
};
