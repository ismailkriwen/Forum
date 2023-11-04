"use client";

import { getCategories } from "@/lib/actions/category.actions";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
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
  useDisclosure,
} from "@nextui-org/react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { PageLoading } from "@/components/layout/loading";
import { type Category } from "@prisma/client";
import { Pen, Plus, Trash } from "lucide-react";
import { BiDotsVerticalRounded } from "react-icons/bi";

import { DeleteModal } from "./modals/delete";
import { EditModal } from "./modals/edit";
import { NewModal } from "./modals/new";

export type TCategory = {
  topics: any;
} & Category;

export const Categories = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<TCategory>(
    categories[0]
  );
  const [rowsPerPage, setRowsPerPage] = useState(5);
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

  const pages = Math.ceil(categories.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return categories.slice(start, end);
  }, [page, rowsPerPage, categories]);

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

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
        <div className="flex items-center justify-end gap-2 w-full">
          <span>Rows per page:</span>
          <Select
            className="text-default-400 text-small w-20"
            size="sm"
            radius="sm"
            onChange={onRowsPerPageChange}
            aria-label="rows per page"
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
    );
  }, [onRowsPerPageChange, newOnOpen]);

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
          Total {categories.length} Categories
        </span>
      </div>
    );
  }, [pages, page, categories.length, setPage]);

  const fetchCategories = async () => {
    setLoading(true);
    const res = await getCategories();
    res && setCategories(res as TCategory[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) return <PageLoading />;

  return (
    <>
      <Table
        aria-label="categories-table"
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
          <TableColumn align="start">Color</TableColumn>
          <TableColumn align="start">Topics</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={"No categories found"}
          items={items}
          loadingState={loading ? "loading" : "idle"}
          loadingContent={<Spinner />}
        >
          {items.map((item) => {
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="text-bold text-small capitalize">
                    {item.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div style={{ color: item.color as string }}>
                    {item.color}
                  </div>
                </TableCell>
                <TableCell>{item.topics.length}</TableCell>
                <TableCell>
                  <Dropdown placement="left-start">
                    <DropdownTrigger>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => setSelectedCategory(item)}
                      >
                        <BiDotsVerticalRounded className="w-5 h-5" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="categories-dropdown">
                      <DropdownItem
                        startContent={<Pen className="w-4 h-4" />}
                        onPress={() => {
                          setSelectedCategory(item);
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
            );
          })}
        </TableBody>
      </Table>
      <EditModal
        isOpen={editIsOpen}
        category={selectedCategory}
        mutate={fetchCategories}
        onOpenChange={editOnOpenChange}
      />
      <DeleteModal
        isOpen={deleteIsOpen}
        category={selectedCategory}
        mutate={fetchCategories}
        onOpenChange={deleteOnOpenChange}
      />
      <NewModal
        isOpen={newIsOpen}
        mutate={fetchCategories}
        onOpenChange={newOnOpenChange}
      />
    </>
  );
};
