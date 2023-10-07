"use client";

import { NewPostModal } from "@/components/actions/new-post-modal";
import { Button, Tooltip, useDisclosure } from "@nextui-org/react";
import { Plus } from "lucide-react";
import { Session } from "next-auth";

export const NewPost = ({ session }: { session: Session | null }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div className="fixed bottom-14 right-3">
        <Tooltip
          content="New Post"
          showArrow
          placement="left"
          radius="sm"
          color="primary"
          size="sm"
        >
          <Button
            isIconOnly
            size="sm"
            radius="full"
            variant="ghost"
            color="primary"
            onPress={onOpen}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </Tooltip>
      </div>
      <NewPostModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        session={session}
      />
    </>
  );
};
