"use client";

import { SingleImageDropzone } from "@/components/SingleImageDropzone";
import { CreateBadge } from "@/lib/actions/badge.actions";
import { useEdgeStore } from "@/lib/edgestore";
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
} from "@nextui-org/react";
import { useState } from "react";
import { toast } from "react-toastify";

export const NewModal = ({
  isOpen,
  onOpenChange,
  mutate,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  mutate: () => Promise<void>;
}) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [limited, setLimited] = useState(false);
  const [purchasable, setPurchasable] = useState(true);
  const [file, setFile] = useState<File>();
  const { edgestore } = useEdgeStore();

  const create = async (close: () => void) => {
    if (!name || !price || !file) return;
    try {
      setLoading(true);
      const img = await edgestore.publicFiles.upload({ file });
      const res = await CreateBadge({
        name,
        price,
        description,
        image: img.url,
        limited,
        purchasable,
      });
      if (res?.error) toast.error(res.error);
      else {
        close();
        mutate();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center flex-col gap-2">
                Add Badge
              </ModalHeader>
              <ModalBody className="overflow-y-auto max-h-96">
                <div className="flex items-center justify-between gap-5 max-md:flex-col">
                  <div className="flex items-start justify-between gap-3 flex-col md:flex-col">
                    <div className="text-default-400">Name</div>
                    <div className="text-default-400">Price</div>
                    <div className="text-default-400">Description</div>
                    <div className="text-default-400">Limited</div>
                    <div className="text-default-400">Purchasable</div>
                  </div>
                  <div className="flex items-center justify-start gap-3 flex-col">
                    <Input
                      name="name"
                      value={name}
                      radius="sm"
                      size="sm"
                      variant="bordered"
                      onValueChange={setName}
                    />
                    <Input
                      type="number"
                      name="price"
                      size="sm"
                      radius="sm"
                      value={price}
                      variant="bordered"
                      onValueChange={setPrice}
                    />
                    <Textarea
                      variant="bordered"
                      size="sm"
                      radius="sm"
                      value={description}
                      onValueChange={setDescription}
                    />
                    <div className="w-full text-right">
                      <Switch
                        aria-label="Limited"
                        size="sm"
                        isSelected={limited}
                        onValueChange={setLimited}
                      />
                    </div>
                    <div className="w-full text-right">
                      <Switch
                        aria-label="Limited"
                        size="sm"
                        isSelected={purchasable}
                        onValueChange={setPurchasable}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <SingleImageDropzone
                    width={200}
                    height={100}
                    value={file}
                    onChange={(file) => setFile(file)}
                    className="mx-auto"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" size="sm" radius="sm" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  variant="ghost"
                  size="sm"
                  radius="sm"
                  isLoading={loading}
                  onPress={() => create(onClose)}
                >
                  {loading ? <>Creating</> : <>Create</>}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
