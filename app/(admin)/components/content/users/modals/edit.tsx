"use client";

import { updateGroups, updateName } from "@/lib/actions/user.actions";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
} from "@nextui-org/react";
import { Role } from "@prisma/client";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IUser } from "../users";

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
  const [name, setName] = useState("");
  const [groups, setGroups] = useState<Role[]>([]);

  const save = async () => {
    setLoading(true);
    if (name !== user?.name) {
      if (name === "") return toast.error("Name can't be empty");
      const res = await updateName({
        email: user?.email!,
        name: name!,
      });
      if (res?.error) toast.error(res?.error);
    }
    await updateGroups({ email: user?.email!, groups });
    mutate();
    setLoading(false);
  };

  useEffect(() => {
    if (!isOpen) return;
    setName(user?.name!);
    setGroups(user?.groups as Role[]);
  }, [isOpen]);

  useEffect(() => {
    if (!user?.groups) return;
    setGroups(user?.groups);
  }, [user?.groups]);

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
                    <div className="text-default-400">Groups</div>
                  </div>
                  <div className="flex items-center justify-start gap-3 flex-col">
                    <Input
                      variant="bordered"
                      value={name as string}
                      onValueChange={setName}
                    />
                    <div className="flex justify-between w-full items-center">
                      <div>
                        {Object.keys(Role).map((role, i) => (
                          <div key={i}>{role}</div>
                        ))}
                      </div>
                      <div>
                        {Object.keys(Role).map((role, i) => (
                          <div key={i}>
                            <Switch
                              defaultSelected={groups?.includes(role as Role)}
                              onChange={({ target }) => {
                                const arr = target.checked
                                  ? [...groups, role]
                                  : groups.filter((e) => e != role);
                                setGroups(arr);
                              }}
                              size="sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" radius="sm" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  isLoading={loading}
                  variant="ghost"
                  radius="sm"
                  color="primary"
                  onPress={save}
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
