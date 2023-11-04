"use client";

import { PageLoading } from "@/components/layout/loading";
import {
  deleteUser,
  getUsers,
  updateName,
  updateRole,
} from "@/lib/actions/user.actions";
import { Role, type User as TUser } from "@prisma/client";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
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
import { Edit, Pen, Search, Trash } from "lucide-react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { AiFillWarning } from "react-icons/ai";

interface IUser {
  name: string | null;
  email: string | null;
  role: string | null;
}

const EditModal = ({
  isOpen,
  onOpenChange,
  user,
  mutate,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  user: IUser | null;
  mutate: () => Promise<void>;
}) => {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(user?.role);
  const [name, setName] = useState(user?.name);
  const [error, setError] = useState("");

  const save = async () => {
    if (role === user?.role && name === user?.name) return;
    setLoading(true);
    if (role !== user?.role)
      await updateRole({ email: user?.email as string, role: role as Role });
    if (name !== user?.name) {
      if (name === "") return setError("Name can't be empty");
      const res = await updateName({
        email: user?.email as string,
        name: name as string,
      });
      if (res?.error) setError(res?.error);
    }
    mutate();
    setLoading(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Edit
                </div>
                <div className="flex items-center gap-2 text-small text-default-400">
                  {user?.name} - {user?.email}
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="flex items-center justify-between gap-5">
                  <div className="flex items-start justify-start gap-3 flex-col">
                    <div className="text-default-400">Name</div>
                    <div className="text-default-400">Role</div>
                  </div>
                  <div className="flex items-center justify-start gap-3 flex-col">
                    <Input
                      variant="bordered"
                      value={name as string}
                      onValueChange={setName}
                    />
                    <Select
                      size="sm"
                      defaultSelectedKeys={[role || Role.Member]}
                      labelPlacement="outside"
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <SelectItem key="Member" value="Member">
                        Guest
                      </SelectItem>
                      <SelectItem
                        key="Moderator"
                        value="Moderator"
                        color="success"
                      >
                        Moderator
                      </SelectItem>
                      <SelectItem key="Admin" value="Admin" color="primary">
                        Admin
                      </SelectItem>
                    </Select>
                  </div>
                </div>
                {error && (
                  <div className="mt-2 text-danger text-center font-semibold">
                    {error}
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  isLoading={loading}
                  isDisabled={
                    role == user?.role || name == user?.name || name == ""
                  }
                  color="primary"
                  onPress={() => save()}
                >
                  {loading ? "Saving" : "Save"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

const DeleteModal = ({
  isOpen,
  onOpenChange,
  user,
  mutate,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  user: IUser | null;
  mutate: () => Promise<void>;
}) => {
  const [loading, setLoading] = useState(false);
  const deleteAction = async (close: () => void) => {
    if (!user?.name || !user?.email) return;
    setLoading(true);
    await deleteUser({ name: user?.name, email: user?.email });
    close();
    mutate();
    setLoading(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          body: "py-6",
          backdrop: "bg-red-500/20 backdrop-opacity-40",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center flex-col gap-2">
                <div className="flex items-center gap-2">
                  <AiFillWarning className="text-danger h-5 w-5" />
                  Confirm to delete account
                </div>
                <div className="flex items-center gap-2 text-small text-default-400">
                  {user?.name} - {user?.email}
                </div>
              </ModalHeader>
              <ModalBody>
                Your are doing a dangerous action. Once deleted, you can&apos;t
                restore it anymore.
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  isLoading={loading}
                  onPress={() => deleteAction(onClose)}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

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

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const users = await getUsers({
      select: {
        id: true,
        name: true,
        role: true,
        email: true,
        image: true,
      },
    });
    setUsers(users);
    setLoading(false);
  }, []);

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
          color="secondary"
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
  }, [fetchUsers]);

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
        classNames={{ wrapper: "w-full" }}
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
                    <Dropdown placement="left-start">
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onClick={() => {
                            const { name, email, role } = user;
                            setSelectedUserToEdit({ name, email, role });
                          }}
                        >
                          <BiDotsVerticalRounded className="w-5 h-5" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="user-dropdown">
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
