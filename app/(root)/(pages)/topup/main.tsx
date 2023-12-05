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
import { loadStripe } from "@stripe/stripe-js";
import { Sparkle } from "lucide-react";
import { type Session } from "next-auth";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

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
                  Here's what's in store for you:
                </span>
              </div>
              <div>
                <div>
                  1. <span className="font-bold">📱 Double Your Delight:</span>{" "}
                  Top up today, and we'll DOUBLE your recharge amount! That's
                  right – every dollar you invest will be instantly DOUBLED,
                  giving you more talk time, more data, and more fun!
                </div>
                <div>
                  2. <span className="font-bold">🎁 Exclusive Access:</span>{" "}
                  You'll be able to purchase cool badges for you profile and
                  mini-profile and many more coming soon!
                </div>
              </div>
              <div className="pt-1">
                Don't miss out on this golden opportunity to supercharge your
                mobile experience! Act fast, as this offer is available for a
                limited time only.
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
  return (
    <>
      <SpecialOffer name={session?.user.name!} />
      <div className="bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white px-6 py-3 rounded-md mt-2"></div>
    </>
  );
};
