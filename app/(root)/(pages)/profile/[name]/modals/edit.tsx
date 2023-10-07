"use client";
import { colors } from "@/constants";
import {
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

export const EditModal = ({
  user,
  editRole,
  isOpen,
  onOpen,
  onOpenChange,
}: {
  user: TUser | null;
  editRole: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
}) => {
  const { data: session } = useSession();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputName, setInputName] = useState(user?.name || "");
  const [role, setRole] = useState<Role>(user?.role as Role);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onOpenChange: deleteOnOpenChange,
  } = useDisclosure();

  const save = async (close: () => void) => {
    setIsLoading(true);
    if (inputName !== "" && inputName !== user?.name) {
      const res = await updateName({
        email: user?.email as string,
        name: inputName,
      });
      if (res?.error) setError(res.error);
    }
    if (role && role !== user?.role)
      await updateRole({ email: user?.email as string, role });
    if (password !== "") {
      if (password.length < 3)
        return setError("Password must be longer than 3 characters");
      else await updatePassword({ email: user?.email as string, password });
    }
    if (error === "") {
      close();
      setPassword("");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setError("");
  }, [inputName, password, role]);

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
                  <div className="text-default-600 mb-2">Username</div>
                  <Input
                    variant="bordered"
                    radius="sm"
                    value={inputName}
                    onValueChange={setInputName}
                    autoFocus={true}
                  />
                </div>
                <div className="my-2">
                  {user?.email === session?.user?.email && (
                  <><div className="text-default-600 mb-2"> Password</div>
                  <Input
                    label="Password"
                    variant="bordered"
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
                  /></>
                  )}
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
                {error && (
                  <div className="my-2 text-center font-semibold text-red-500 dark:text-rose-600">
                    {error}
                  </div>
                )}
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
