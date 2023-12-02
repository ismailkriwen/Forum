"use client";

import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
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
import { useCallback, useEffect, useMemo, useState } from "react";

import { Badge, User } from "@prisma/client";
import { Pen, Plus, Trash } from "lucide-react";
import { BiDotsVerticalRounded } from "react-icons/bi";

import { FetchAllBadges } from "@/lib/actions/badge.actions";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { DeleteModal } from "./modals/delete";
import { EditModal } from "./modals/edit";
import { NewModal } from "./modals/new";

const rowsPerPage = 5;
type TBadge = {
  user: User;
} & Badge;

export const Badges = () => {
  const [loading, setLoading] = useState(false);
  const [badges, setBadges] = useState<TBadge[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<TBadge | null>(null);
  const [page, setPage] = useState(1);

  const {
    isOpen: editIsOpen,
    onOpen: editOnOpen,
    onOpenChange: editOnOpenChange,
  } = useDisclosure();

  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onOpenChange: deleteOnOpenChange,
  } = useDisclosure();

  const {
    isOpen: newIsOpen,
    onOpen: newOnOpen,
    onOpenChange: newOnOpenChange,
  } = useDisclosure();

  const pages = Math.ceil(badges.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return badges.slice(start, end);
  }, [page, rowsPerPage, badges]);

  const topContent = useMemo(() => {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="bordered"
            startContent={<Plus className="w-4 h-4" />}
            onPress={newOnOpen}
          >
            Add New
          </Button>
        </div>
      </div>
    );
  }, [newOnOpen]);

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
      </div>
    );
  }, [pages, page, badges.length, setPage]);

  const fetchBadges = useCallback(async () => {
    setLoading(true);
    const res = await FetchAllBadges();
    res && setBadges(res as TBadge[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  return (
    <>
      <Table
        aria-label="badges-table"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        topContent={topContent}
        topContentPlacement="outside"
        fullWidth
        radius="sm"
        className="z-0"
      >
        <TableHeader>
          <TableColumn align="start"> </TableColumn>
          <TableColumn align="center">Item Name</TableColumn>
          <TableColumn align="center">Description</TableColumn>
          <TableColumn align="center">Price</TableColumn>
          <TableColumn align="end">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={"No Badges available."}
          items={items}
          loadingState={loading ? "loading" : "idle"}
          loadingContent={<Spinner color="default" />}
        >
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex items-center justify-center">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={44}
                    height={44}
                    className="object-contain rounded-full"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="text-bold text-small capitalize">
                  {item.name}{" "}
                  {item.limited && (
                    <Chip
                      size="sm"
                      variant="shadow"
                      className="ml-1"
                      classNames={{
                        base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
                        content: "drop-shadow shadow-black text-white",
                      }}
                    >
                      Limited
                    </Chip>
                  )}
                </div>
              </TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>
                {item.price == 0 ? "Free" : formatPrice(item.price)}
              </TableCell>
              <TableCell>
                <Dropdown placement="left-start">
                  <DropdownTrigger>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => setSelectedBadge(item)}
                    >
                      <BiDotsVerticalRounded className="w-5 h-5" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="badges-dropdown">
                    <DropdownItem
                      startContent={<Pen className="w-4 h-4" />}
                      onPress={() => {
                        setSelectedBadge(item);
                        editOnOpen();
                      }}
                    >
                      Edit
                    </DropdownItem>
                    <DropdownItem
                      startContent={<Trash className="w-4 h-4" />}
                      color="danger"
                      className="text-danger"
                      onPress={deleteOnOpen}
                    >
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <EditModal
        isOpen={editIsOpen}
        badge={selectedBadge}
        mutate={fetchBadges}
        onOpenChange={editOnOpenChange}
      />
      <DeleteModal
        isOpen={deleteIsOpen}
        badge={selectedBadge}
        mutate={fetchBadges}
        onOpenChange={deleteOnOpenChange}
      />
      <NewModal
        isOpen={newIsOpen}
        mutate={fetchBadges}
        onOpenChange={newOnOpenChange}
      />
    </>
  );
};
