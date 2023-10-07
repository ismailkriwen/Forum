"use client";
import { createMessage } from "@/lib/actions/conversation.actions";
import { getUsers } from "@/lib/actions/user.actions";
import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Textarea,
  User,
} from "@nextui-org/react";
import { type User as TUser } from "@prisma/client";
import { motion } from "framer-motion";
import { Search, Send, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const NewMessage = ({
  isOpen,
  onOpenChange,
  sender,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  sender: TUser;
}) => {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [receiver, setReceiver] = useState<TUser | null>(null);
  const [results, setResults] = useState<TUser[]>([]);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const send = async (close: () => void) => {
    setIsLoading(true);
    const res = await createMessage({
      title: subject,
      content,
      creator: sender.email as string,
      receiver: receiver?.email as string,
    });
    if (res) {
      router.push(`/conversation/${res}`);
      close();
    } else setError("Something went wrong");
    setIsLoading(false);
  };

  const search = async () => {
    setResultsLoading(true);
    const users = await getUsers({
      where: { name: { contains: searchValue, mode: "insensitive" } },
    });
    users &&
      setResults(
        users.filter(
          (user) =>
            user.email !== sender.email && user.email !== receiver?.email
        )
      );
    setResultsLoading(false);
  };

  useEffect(() => {
    if (searchValue !== "") return;
    setResults([]);
  }, [searchValue]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            {receiver && (
              <>
                <ModalHeader>
                  Message to{" "}
                  <span className="pl-2 text-default-400">
                    {receiver?.name}
                  </span>
                </ModalHeader>
                <Divider />
              </>
            )}
            <ModalBody className={!receiver ? "mt-8" : ""}>
              <div className="relative">
                <Input
                  isClearable
                  variant="bordered"
                  radius="sm"
                  className="w-full"
                  label="Find user"
                  placeholder="Search user..."
                  onClear={() => setResults([])}
                  startContent={
                    <Search
                      className="w-5 h-5 cursor-pointer"
                      onClick={search}
                    />
                  }
                  value={searchValue}
                  onValueChange={setSearchValue}
                />
                {searchValue !== "" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    exit={{ opacity: 0 }}
                    className="bg-neutral-200 dark:bg-neutral-950 rounded-md w-full p-3 max-h-36 overflow-y-auto absolute top-full left-0 right-0 z-20"
                  >
                    {resultsLoading ? (
                      <div className="h-16 flex items-center justify-center">
                        <Spinner />
                      </div>
                    ) : results.length > 0 ? (
                      <>
                        {results.map((user) => (
                          <User
                            key={user.id}
                            name={user.name}
                            description={user.email}
                            avatarProps={{
                              src: user.image as string,
                            }}
                            className="rounded-md px-4 py-2 hover:bg-neutral-300/80 dark:hover:bg-neutral-900/80 w-full cursor-pointer items-start justify-start"
                            onClick={() => {
                              setSearchValue("");
                              setResults([]);
                              setReceiver(user);
                            }}
                          />
                        ))}
                      </>
                    ) : (
                      <div className="h-16 flex items-center justify-center text-default-500">
                        No users to display.
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
              <Input
                radius="sm"
                label="Subject"
                variant="bordered"
                value={subject}
                onValueChange={setSubject}
              />
              <Textarea
                variant="bordered"
                label="Content"
                placeholder="Message content..."
                radius="sm"
                value={content}
                onValueChange={setContent}
              />
              {error && (
                <div className="py-2">
                  <div className="rounded px-4 py-2 border border-danger text-danger flex items-center gap-3">
                    <XCircle className="w-4 h-4" />
                    <div>{error}</div>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                variant="ghost"
                color="success"
                onPress={() => send(onClose)}
                startContent={!isLoading && <Send className="w-4 h-4" />}
                isLoading={isLoading}
              >
                Send
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
