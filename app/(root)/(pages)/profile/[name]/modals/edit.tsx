"use client";
import { colors } from "@/constants";
import {
  updateGender,
  updateLocation,
  updateName,
  updatePassword,
  updateRole,
} from "@/lib/actions/user.actions";
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
  useDisclosure,
} from "@nextui-org/react";
import { Role, type User as TUser } from "@prisma/client";
import { Edit, Eye, EyeOff, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { DeleteModal } from "./delete";
import { toast } from "react-toastify";

export const EditModal = ({
  user,
  editRole,
  isOpen,
  onOpen,
  onOpenChange,
}: {
  user: TUser | null | undefined;
  editRole: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
}) => {
  const { data: session } = useSession();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputName, setInputName] = useState("");
  const [role, setRole] = useState<Role>();
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onOpenChange: deleteOnOpenChange,
  } = useDisclosure();

  const save = async (close: () => void) => {
    try {
      setIsLoading(true);
      if (inputName !== "" && inputName !== user?.name) {
        const res = await updateName({
          email: user?.email!,
          name: inputName,
        });
        if (res?.error) toast.error(res.error);
      }
      if (role && role !== user?.role)
        await updateRole({ email: user?.email!, role });
      if (password !== "") {
        if (password.length < 3)
          return toast.error("Password must be longer than 3 characters");
        else await updatePassword({ email: user?.email as string, password });
      }
    } finally {
      setIsLoading(false);
      close();
    }
  };

  const saveGender = async (close: () => void) => {
    if (gender == user?.gender) return;
    try {
      setIsLoading(true);
      const res = await updateGender({ email: user?.email!, gender });
      if (!res) toast.error("Something went wrong.");
      else toast.info("Updated");
    } finally {
      setIsLoading(false);
      close();
    }
  };

  const saveLocation = async (close: () => void) => {
    if (location == user?.location) return;
    try {
      setIsLoading(true);
      const res = await updateLocation({ email: user?.email!, location });
      if (!res) toast.error("Something went wrong.");
      else toast.info("Updated");
    } finally {
      setIsLoading(false);
      close();
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    setInputName(user?.name!);
    setRole(user?.role as Role);
    setGender(user?.gender!);
    setLocation(user?.location!);
  }, [isOpen]);

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent aria-label="edit-user">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  <div>Edit</div>
                </div>
                <div className="text-default-400 text-small">{user?.name}</div>
              </ModalHeader>
              <ModalBody>
                <div>
                  <Input
                    variant="underlined"
                    placeholder={user?.name!}
                    labelPlacement="outside"
                    radius="sm"
                    size="sm"
                    value={inputName}
                    onValueChange={setInputName}
                    autoFocus={true}
                  />
                </div>
                {user?.email === session?.user?.email && (
                  <div className="my-2">
                    <Input
                      label="Password"
                      variant="underlined"
                      size="sm"
                      radius="sm"
                      value={password}
                      onValueChange={setPassword}
                      endContent={
                        <button
                          className="focus:outline-none"
                          type="button"
                          onClick={() => setIsVisible((prev) => !prev)}
                        >
                          {isVisible ? (
                            <Eye className="w-4 h-4 text-default-400 pointer-events-none" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-default-400 pointer-events-none" />
                          )}
                        </button>
                      }
                      type={isVisible ? "text" : "password"}
                    />
                  </div>
                )}
                <div className="flex items-center justify-between w-full gap-5">
                  <Select
                    defaultSelectedKeys={[user?.gender!]}
                    disallowEmptySelection
                    onChange={({ target }) => setGender(target.value)}
                    size="sm"
                    radius="sm"
                    labelPlacement="outside"
                  >
                    <SelectItem key="Male">Male</SelectItem>
                    <SelectItem key="Female">Female</SelectItem>
                  </Select>
                  <Button
                    variant="ghost"
                    color="primary"
                    radius="sm"
                    size="sm"
                    onPress={() => saveGender(onClose)}
                    isDisabled={gender == user?.gender}
                    isLoading={isLoading}
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
                    color="primary"
                    radius="sm"
                    size="sm"
                    onPress={() => saveLocation(onClose)}
                    isDisabled={location == "" || location == user?.location}
                    isLoading={isLoading}
                  >
                    Save
                  </Button>
                </div>
                {editRole && (
                  <div className="flex items-center justify-between gap-2 my-2">
                    <div className="text-default-400">Role</div>
                    <Select
                      defaultSelectedKeys={[user?.role as Role]}
                      onChange={(e) => setRole(e.target.value as Role)}
                      label="role-selection"
                      labelPlacement="outside"
                      size="sm"
                      isRequired
                      classNames={{ base: "w-1/2", label: "hidden" }}
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
                )}
                <div className="flex items-center justify-end">
                  <Button
                    color="danger"
                    variant="ghost"
                    className="text-danger"
                    startContent={<Trash className="w-4 h-4" />}
                    radius="sm"
                    onPress={() => {
                      onClose();
                      deleteOnOpen();
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose} radius="sm">
                  Close
                </Button>
                <Button
                  isLoading={isLoading}
                  color="primary"
                  variant="ghost"
                  onPress={() => save(onClose)}
                  radius="sm"
                  isDisabled={
                    editRole
                      ? role === user?.role &&
                        inputName === user?.name &&
                        password === ""
                      : inputName === user?.name && password === ""
                  }
                >
                  {isLoading ? "Saving" : "Save"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <DeleteModal
        isOpen={deleteIsOpen}
        user={user}
        onOpenChange={deleteOnOpenChange}
        open={onOpen}
      />
    </>
  );
};
