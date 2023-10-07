"use client";

import { useState } from "react";
import { IUser } from "../users";
import { updateName, updateRole } from "@/lib/actions/user.actions";
import { Role } from "@prisma/client";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Edit } from "lucide-react";
import { colors } from "@/constants";

export const EditModal = ({
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
                      defaultSelectedKeys={[user?.role || Role.Member]}
                      labelPlacement="outside"
                      onChange={(e) => setRole(e.target.value)}
                    >
                      {Object.keys(Role).map((role) => (
                        <SelectItem
                          key={role}
                          value={role}
                          /* @ts-ignore */
                          color={colors[role]}
                        >
                          {role}
                        </SelectItem>
                      ))}
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
