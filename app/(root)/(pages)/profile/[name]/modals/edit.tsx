"use client";
import { colors } from "@/constants";
import {
  updateGender,
  updateLocation,
  updateRole,
} from "@/lib/actions/user.actions";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Role, type User as TUser } from "@prisma/client";
import { Edit } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MainSettings } from "./edit_components/main";

export const EditModal = ({
  user,
  isOpen,
  onOpenChange,
}: {
  user: TUser | null | undefined;
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
}) => {
  const { data: session } = useSession();
  const [role, setRole] = useState<Role>();
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");

  const saveRole = async (close: () => void) => {
    try {
      if (!role || role == user?.role) return;
      const res = await updateRole({ email: user?.email!, role });
      res ? toast.info("Updated") : toast.error("Something went wrong");
    } finally {
      close();
    }
  };

  const saveGender = async (close: () => void) => {
    if (gender == user?.gender) return;
    try {
      const res = await updateGender({ email: user?.email!, gender });
      !res ? toast.error("Something went wrong.") : toast.info("Updated");
    } finally {
      close();
    }
  };

  const saveLocation = async (close: () => void) => {
    if (location == user?.location) return;
    try {
      const res = await updateLocation({ email: user?.email!, location });
      !res ? toast.error("Something went wrong.") : toast.info("Updated");
    } finally {
      close();
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    setRole(user?.role as Role);
    setGender(user?.gender!);
    setLocation(user?.location!);
  }, [isOpen]);

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} radius="sm">
        <ModalContent aria-label="edit-user">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col pb-2">
                <div className="flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  <div>Edit</div>
                </div>
                <div className="text-default-400 text-small">{user?.name}</div>
              </ModalHeader>
              <ModalBody>
                <MainSettings user={user} session={session} />
                <div className="flex items-center justify-between w-full gap-5">
                  <Select
                    defaultSelectedKeys={["Male"]}
                    disallowEmptySelection
                    onChange={({ target }) => setGender(target.value)}
                    size="sm"
                    radius="sm"
                    labelPlacement="outside"
                    aria-label="Gender selection"
                  >
                    <SelectItem key="Male">Male</SelectItem>
                    <SelectItem key="Female">Female</SelectItem>
                  </Select>
                  <Button
                    variant="ghost"
                    radius="sm"
                    size="sm"
                    onPress={() => saveGender(onClose)}
                    isDisabled={gender == user?.gender}
                  >
                    Save
                  </Button>
                </div>
                <div className="flex items-center justify-between w-full gap-5">
                  <Input
                    type="text"
                    placeholder="Location"
                    variant="underlined"
                    size="sm"
                    value={location}
                    onChange={({ target }) => setLocation(target.value)}
                    labelPlacement="outside"
                  />
                  <Button
                    variant="ghost"
                    radius="sm"
                    size="sm"
                    onPress={() => saveLocation(onClose)}
                    isDisabled={location == "" || location == user?.location}
                  >
                    Save
                  </Button>
                </div>
                {session?.user?.groups.includes(Role.Admin) && (
                  <div className="flex items-center justify-between gap-2 my-2">
                    <Select
                      defaultSelectedKeys={[user?.role as Role]}
                      onChange={(e) => setRole(e.target.value as Role)}
                      label="role-selection"
                      labelPlacement="outside"
                      size="sm"
                      isRequired
                      classNames={{ base: "w-1/2", label: "hidden" }}
                      aria-label="Role selection"
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
                    <Button
                      size="sm"
                      variant="ghost"
                      radius="sm"
                      onPress={() => saveRole(onClose)}
                      isDisabled={role == user?.role}
                    >
                      Save
                    </Button>
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
