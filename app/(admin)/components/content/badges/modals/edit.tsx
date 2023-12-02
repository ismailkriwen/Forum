"use client";

import { SingleImageDropzone } from "@/components/SingleImageDropzone";
import {
  UpdateBadgeDescription,
  UpdateBadgeImage,
  UpdateBadgeLimited,
  UpdateBadgeName,
  UpdateBadgePrice,
  UpdateBadgePurchasable,
} from "@/lib/actions/badge.actions";
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
import { Badge, User } from "@prisma/client";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";

type TBadge = {
  user: User;
} & Badge;

export const EditModal = ({
  isOpen,
  onOpenChange,
  badge,
  mutate,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  badge: TBadge | null;
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

  const update = async (onClose: () => void) => {
    setLoading(true);
    if (!badge) return;
    if (name && name !== badge.name) UpdateBadgeName({ id: badge.id!, name });
    if (price && price !== String(badge.price))
      UpdateBadgePrice({ id: badge.id!, price });
    if (description && price !== badge.description)
      UpdateBadgeDescription({ id: badge.id!, description });
    if (limited && limited !== badge.limited)
      UpdateBadgeLimited({ id: badge.id, limited });
    if (purchasable && purchasable !== badge.purchasable)
      UpdateBadgePurchasable({ id: badge.id, purchasable });
    if (file) {
      const img = await edgestore.publicFiles.upload({ file });
      UpdateBadgeImage({ id: badge.id, image: img.url });
    }
    onClose();
    mutate();
    setLoading(false);
  };

  useEffect(() => {
    if (!isOpen) return;
    setName(badge?.name!);
    setPrice(String(badge?.price));
    setDescription(badge?.description!);
    setLimited(badge?.limited!);
    setPurchasable(badge?.purchasable!);
  }, [isOpen, badge]);

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Edit Badge
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
                    value={badge?.image ? badge.image : file}
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
                  radius="sm"
                  size="sm"
                  isLoading={loading}
                  onPress={() => update(onClose)}
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
