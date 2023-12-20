"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ScrollShadow,
  useDisclosure,
} from "@nextui-org/react";
import { Sparkle } from "lucide-react";
import { type Session } from "next-auth";
import { TOPUP_ITEMS, TOPUP_BONUS } from "@/constants";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import { toast } from "react-toastify";

const SpecialOffer = ({ name }: { name: string }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} radius="sm">
        <ModalContent>
          <ModalHeader>🚀 Supercharge Your Top-Up Experience!</ModalHeader>
          <ModalBody>
            <ScrollShadow className="max-h-60 overflow-y-auto">
              <div>🎉 Exciting News Just In! 🎉</div>
              <div>
                Dear {name},
                <span className="block py-2">
                  Get ready to elevate your mobile experience to new heights
                  with our exclusive Top-Up Supercharger offer! 🚀✨
                </span>
                <span className="block font-bold pb-3">
                  Here&apos;s what&apos;s in store for you:
                </span>
              </div>
              <div>
                <div>
                  1. <span className="font-bold">📱 Double Your Delight:</span>{" "}
                  Top up today, and we&apos;ll DOUBLE your recharge amount!
                  That&apos;s right – every dollar you invest will be instantly
                  DOUBLED, giving you more talk time, more data, and more fun!
                </div>
                <div>
                  2. <span className="font-bold">🎁 Exclusive Access:</span>{" "}
                  You&apos;ll be able to purchase cool badges for you profile
                  and mini-profile and many more coming soon!
                </div>
              </div>
              <div className="pt-1">
                Don&apos;t miss out on this golden opportunity to supercharge
                your mobile experience! Act fast, as this offer is available for
                a limited time only.
              </div>
            </ScrollShadow>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Button
        size="lg"
        radius="full"
        color="default"
        className="absolute bottom-6 max-md:bottom-16 right-4 flex items-center justify-center animate-shake"
        isIconOnly
        onPress={onOpen}
      >
        <Sparkle className="w-6 h-6 text-rose-400" />
      </Button>
    </>
  );
};

export const TopupComponent = ({ session }: { session: Session | null }) => {
  const [isDisabled, setIsDisabled] = useState(false);

  const handleCheckout = async (price: string) => {
    setIsDisabled(true);
    toast.loading("Redirecting");
    fetch("/api/checkout_session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then((json) => Promise.reject(json));
      })
      .then(({ url }) => {
        window.location = url;
      });
  };

  return (
    <>
      <SpecialOffer name={session?.user.name!} />
      <div className="bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white px-6 py-3 rounded-md mt-2 space-y-3">
        {TOPUP_ITEMS.map((item, index) => {
          const price = Number(item.price) * TOPUP_BONUS;
          return (
            <div key={index} className="flex items-center justify-between">
              <div>
                {formatPrice(item.price)}
                <span className="text-small text-foreground-600 pl-2">
                  (balance: +{formatPrice(price)})
                </span>
              </div>
              <Button
                variant="ghost"
                radius="sm"
                onPress={async () => await handleCheckout(item.id)}
                isDisabled={isDisabled}
              >
                Purchase
              </Button>
            </div>
          );
        })}
        {/* <Button variant="ghost" radius="sm" onPress={handleCheckout}>
          Checkout
        </Button> */}
      </div>
    </>
  );
};
