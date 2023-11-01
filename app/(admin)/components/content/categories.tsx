"use client";

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateColor,
} from "@/lib/actions/category.actions";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
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
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { type Category } from "@prisma/client";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { Pen, Plus, Trash } from "lucide-react";
import { AiFillWarning } from "react-icons/ai";
import { PageLoading } from "@/components/layout/loading";
import { updateName } from "@/lib/actions/category.actions";

type TCategory = {
  topics: any;
} & Category;

const NewModal = ({
  isOpen,
  onOpenChange,
  mutate,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  mutate: () => Promise<void>;
}) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#000000");
  const [error, setError] = useState("");

  const create = async (close: () => void) => {
    if (!name || !color) return;
    setLoading(true);
    const res = await createCategory({ name, color });
    if (res?.error) setError(res.error);
    else {
      close();
      mutate();
    }
    setLoading(false);
  };

  useEffect(() => {
    setError("");
  }, [name, color]);

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
                Create Category
              </ModalHeader>
              <ModalBody>
                <div className="flex items-center justify-between gap-5">
                  <div className="flex items-start justify-start gap-3 flex-col">
                    <div className="text-default-400">Name</div>
                    <div className="text-default-400">Color</div>
                  </div>
                  <div className="flex items-center justify-start gap-3 flex-col">
                    <Input name="name" value={name} onValueChange={setName} />
                    <Input
                      variant="bordered"
                      type="color"
                      name="color"
                      value={color}
                      onValueChange={setColor}
                    />
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
                  color="primary"
                  isLoading={loading}
                  onPress={() => create(onClose)}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

const EditModal = ({
  isOpen,
  onOpenChange,
  category,
  mutate,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  category: TCategory;
  mutate: () => Promise<void>;
}) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(category?.name as string);
  const [color, setColor] = useState(category?.color as string);
  const [error, setError] = useState("");

  const update = async (close: () => void) => {
    setLoading(true);
    if (name !== "" && name !== category.name) {
      const res = await updateName({
        name: category?.name as string,
        newName: name,
      });
      if (res?.error) setError(res.error);
      else {
        close();
        mutate();
      }
    }

    if (color != "" && color !== category.color) {
      const res = await updateColor({ name: category?.name as string, color });
      if (res?.error) setError(res.error);
      else {
        close();
        mutate();
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    setError("");
  }, [name, color]);

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center flex-col gap-2">
                Create Category
              </ModalHeader>
              <ModalBody>
                <div className="flex items-center justify-between gap-5">
                  <div className="flex items-start justify-start gap-3 flex-col">
                    <div className="text-default-400">Name</div>
                    <div className="text-default-400">Color</div>
                  </div>
                  <div className="flex items-center justify-start gap-3 flex-col">
                    <Input name="name" value={name} onValueChange={setName} />
                    <Input
                      variant="bordered"
                      type="color"
                      name="color"
                      value={color}
                      onValueChange={setColor}
                    />
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
                  color="primary"
                  isLoading={loading}
                  isDisabled={color == category.color && name == category.name}
                  onPress={() => update(onClose)}
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
  category,
  mutate,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  category: TCategory | null;
  mutate: () => Promise<void>;
}) => {
  const [loading, setLoading] = useState(false);
  const deleteAction = async (close: () => void) => {
    if (!category?.name) return;
    setLoading(true);
    await deleteCategory({ name: category?.name });
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
                  Confirm to delete category
                </div>
                <div className="flex items-center gap-2 text-small text-default-400">
                  {category?.name}
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
            defaultSelectedKeys={"5"}
          >
            <SelectItem key="5" value="5" defaultChecked>
              5
            </SelectItem>
            <SelectItem key="10" value="10" defaultChecked>
              10
            </SelectItem>
            <SelectItem key="15" value="15" defaultChecked>
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
          color="secondary"
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
    res && setCategories(res);
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
        classNames={{ wrapper: "w-full" }}
      >
        <TableHeader>
          <TableColumn align="start">Name</TableColumn>
          <TableColumn align="start">Color</TableColumn>
          <TableColumn align="start">Blogs</TableColumn>
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
                <TableCell>{item.blogs.length}</TableCell>
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
                        onPress={editOnOpen}
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
