"use client";

import {
  DeleteTopic,
  GetCategoryByTopicId,
} from "@/lib/actions/topics.actions";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  Spinner,
} from "@nextui-org/react";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "react-query";

type Props = {
  isOpen: boolean;
  onOpenChange: () => void;
  topicId: string;
};

export const SettingsModal = ({ isOpen, onOpenChange, topicId }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: "category_name_by_topic_id",
    queryFn: async () => await GetCategoryByTopicId({ id: topicId }),
    enabled: !!topicId,
  });

  const deleteTopic = async () => {
    setLoading(true);
    const response = await DeleteTopic({ id: topicId });
    if (response) router.push(`/category/${data}`);
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} radius="sm">
      <ModalContent>
        <ModalBody>
          <div className="text-3xl font-bold">Actions</div>
          {isLoading ? (
            <div className="h-full text-center">
              <Spinner color="default" />
            </div>
          ) : (
            <Button
              color="danger"
              radius="sm"
              variant="ghost"
              className="w-full"
              isLoading={loading}
              startContent={!loading && <Trash className="w-4 h-4" />}
              onPress={deleteTopic}
            >
              {loading ? "Deleting" : "Delete"}
            </Button>
          )}
          {/* TODO: mark as */}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
