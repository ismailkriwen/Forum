"use client";

import {
  updateColor,
  updateDescription,
  updateName,
  updateRanks,
} from "@/lib/actions/category.actions";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  Textarea,
  Tooltip,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TCategory } from "../categories";
import { AlertCircle, Edit } from "lucide-react";
import { Role } from "@prisma/client";

export const EditModal = ({
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
  const [description, setDescription] = useState(
    category?.description as string
  );
  const [ranks, setRanks] = useState(category?.ranks);

  const update = async (close: () => void) => {
    try {
      setLoading(true);
      if (name !== "" && name !== category.name) {
        const res = await updateName({
          name: category?.name as string,
          newName: name,
        });
        if (res?.error) toast.error(res.error);
        else {
          close();
          mutate();
        }
      }

      if (color != "" && color !== category.color) {
        const res = await updateColor({ name: category?.name!, color });
        if (res?.error) toast.error(res.error);
        else {
          close();
          mutate();
        }
      }

      if (description !== category.description) {
        const res = await updateDescription({
          name: category?.name!,
          description,
        });
        if (res) toast.error("Something went wrong.");
        else {
          close();
          mutate();
        }
      }

      const res = await updateRanks({
        name: category?.name!,
        ranks,
      });
      if (!res) toast.error("Something went wrong.");
      else {
        close();
        mutate();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    setName(category.name!);
    setColor(category.color!);
    setDescription(category.description!);
    setRanks(category.ranks as Role[]);
  }, [isOpen, category]);

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Edit Category
              </ModalHeader>
              <ModalBody className="overflow-y-auto max-h-96">
                <div className="flex items-center justify-between gap-5 max-md:flex-col">
                  <div className="flex items-start h-full justify-between gap-3 md:flex-col">
                    <div className="text-default-400">Name</div>
                    <div className="text-default-400">Color</div>
                    <div className="text-default-400">Description</div>
                    <div className="text-default-400 flex items-center gap-2">
                      Ranks{" "}
                      <Tooltip
                        content="Allowed groups to this specific category."
                        placement="top"
                        showArrow
                        size="sm"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </Tooltip>
                    </div>
                  </div>
                  <div className="flex items-center justify-start gap-3 flex-col">
                    <Input
                      name="name"
                      value={name}
                      onValueChange={setName}
                      variant="bordered"
                      size="sm"
                      radius="sm"
                    />
                    <Input
                      variant="bordered"
                      type="color"
                      name="color"
                      size="sm"
                      value={color}
                      onValueChange={setColor}
                      classNames={{
                        inputWrapper: "border-transparent",
                      }}
                    />
                    <Textarea
                      variant="bordered"
                      size="sm"
                      radius="sm"
                      value={description}
                      onValueChange={setDescription}
                    />
                    <div className="flex items-center justify-between w-full gap-2">
                      <div>
                        {Object.keys(Role).map((role, i) => (
                          <div key={i}>{role}</div>
                        ))}
                      </div>
                      <div className="flex flex-col">
                        {Object.keys(Role).map((role, i) => (
                          <Switch
                            key={i}
                            defaultSelected={ranks?.includes(role as Role)}
                            onChange={({ target }) => {
                              // @ts-ignore
                              const arr = target.checked
                                ? [...ranks, role]
                                : ranks.filter((e) => e != role);
                              setRanks(arr as Role[]);
                            }}
                            size="sm"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" size="sm" radius="sm" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  variant="ghost"
                  radius="sm"
                  size="sm"
                  isLoading={loading}
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
