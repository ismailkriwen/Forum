"use client";

import { textColors } from "@/constants";
import { FetchGlobal } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import {
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ScrollShadow,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { Topic, User } from "@prisma/client";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export const SearchComponent = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [fetchUsers, setFetchUsers] = useState(false);
  const [fetchTopics, setFetchTopics] = useState(false);
  const updateResults = async () => {
    if (!search) return;
    try {
      setIsLoading(true);
      const response = await FetchGlobal({
        search,
        usersEnabled: fetchUsers,
        topicsEnabled: fetchTopics,
      });
      setResults(response);
    } finally {
      setIsLoading(false);
      setSearch("");
    }
  };

  return (
    <>
      <Search className="w-6 h-6 cursor-pointer" onClick={onOpen} />
      <Modal
        size="sm"
        radius="sm"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-2">
            <Input
              type="text"
              placeholder="Search.."
              startContent={
                <Search
                  className="w-4 h-4 cursor-pointer"
                  onClick={updateResults}
                />
              }
              variant="bordered"
              radius="sm"
              labelPlacement="outside"
              value={search}
              onChange={({ target }) => setSearch(target.value)}
              className="mr-4 mt-4"
              isClearable
              isDisabled={isLoading}
              onKeyDown={(e) => e.keyCode === 13 && updateResults()}
            />
            <div className="flex items-center justify-end gap-3">
              <Checkbox
                size="sm"
                radius="sm"
                onValueChange={setFetchUsers}
                isSelected={fetchUsers}
              >
                Users
              </Checkbox>
              <Checkbox
                size="sm"
                radius="sm"
                onValueChange={setFetchTopics}
                isSelected={fetchTopics}
              >
                Topics
              </Checkbox>
            </div>
          </ModalHeader>
          <ModalBody
            className={`${results.length == 0 && !isLoading && "p-0"}`}
          >
            <ScrollShadow className="max-h-64 overflow-y-auto w-full">
              {isLoading && (
                <div className="h-full text-center">
                  <Spinner color="default" />
                </div>
              )}
              {results.length == 0 && search != "" && !isLoading && (
                <div className="text-center text-default-500 pb-2">
                  No Results.
                </div>
              )}
              {!isLoading && results.length > 0 && (
                <>
                  {results[0].length > 0 && (
                    <div>
                      <span className="text-default-500 text-small pb-4">
                        Users
                      </span>
                      <div className="w-full">
                        {results[0].map((user: User) => (
                          <div
                            key={user.id}
                            className="flex items-start gap-2 px-6 py-1.5 rounded-md hover:bg-neutral-300/60 dark:hover:bg-neutral-600/70 transition-colors max-h-36 overflow-y-auto"
                          >
                            {user?.image ? (
                              <Image
                                src={user?.image}
                                alt="Avatar"
                                width={36}
                                height={36}
                                className="rounded-full"
                              />
                            ) : (
                              <Image
                                src="/avatar.png"
                                alt="Avatar Fallback"
                                width={36}
                                height={36}
                                className="rounded-full"
                              />
                            )}
                            <div>
                              <Link
                                href={`/profile/${user?.name}`}
                                className={cn(
                                  "hover:underline text-sm",
                                  textColors[user?.role]
                                )}
                              >
                                {user?.name}
                              </Link>
                              <div className="text-default-700 text-xs">
                                {user?.role}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {results[1].length > 0 && (
                    <div>
                      <span className="text-default-500 text-small pb-4">
                        Topics
                      </span>
                      <div className="space-y-1 pl-6 max-h-36 overflow-y-auto">
                        {results[1].map((topic: Topic) => (
                          <div key={topic.id}>
                            <Link href={`/topic/${topic.id}`}>
                              {topic.title}
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </ScrollShadow>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
