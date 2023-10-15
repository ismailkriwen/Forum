"use client";

import { signIn } from "next-auth/react";
import { FaGoogle, FaGithub, FaUserCog } from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
} from "@nextui-org/react";
import { useState } from "react";

import { userExistance } from "@/lib/actions/user.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogOut } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

import { useSignInContext } from "@/components/hooks/useSignIn";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email type" }),
  password: z
    .string()
    .min(3, { message: "Passwords must be longer than 3 characters" }),
});

const Form = () => {
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, password } = values;
    setIsLoading(true);
    const res = await userExistance({ email, password });
    setIsLoading(false);
    if (res?.error) return setError(res.error);

    if (isSubmitSuccessful) {
      setIsLoading(true);
      signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      });
      toast.success("You're being redirected.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          type="email"
          {...register("email")}
          label="Email"
          variant="bordered"
          radius="sm"
          size="sm"
          isClearable
          isRequired
        />
        <Input
          type={isVisible ? "text" : "password"}
          {...register("password")}
          label="Password"
          variant="bordered"
          radius="sm"
          size="sm"
          isRequired
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
        />
        <Button
          className="w-full mt-2"
          variant="ghost"
          color="primary"
          isLoading={isLoading}
          type="submit"
        >
          Sign In
        </Button>
      </form>
      {error && (
        <div className="text-red-500 text-center font-semibold py-2">
          {error}
        </div>
      )}
    </>
  );
};

export const SignIn = () => {
  const router = useRouter();
  const [view, setView] = useState("providers");
  const { isOpen, onOpenChange, dimissable, setDismissable, onClose } =
    useSignInContext();

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
        isDismissable={dimissable}
        hideCloseButton={!dimissable}
        isKeyboardDismissDisabled={!dimissable}
      >
        <ModalContent>
          <>
            <ModalBody>
              <div className="my-4 flex items-center justify-center">
                <div className="md:w-2/3 max-md:mt-4">
                  {view == "providers" ? (
                    <>
                      <Button
                        className="w-full"
                        onClick={() => signIn("google")}
                        variant="ghost"
                      >
                        <FaGoogle className="w-5 h-5 mr-2" />
                        Continue with Google
                      </Button>
                      <Button
                        className="w-full mt-2"
                        onPress={() => signIn("github")}
                        variant="ghost"
                      >
                        <FaGithub className="w-5 h-5 mr-2" />
                        Continue with GitHub
                      </Button>
                      <Button
                        className="w-full mt-2"
                        variant="ghost"
                        onPress={() => setView("credentials")}
                      >
                        <FaUserCog className="w-5 h-5 mr-2" />
                        Continue with Credentials
                      </Button>
                    </>
                  ) : (
                    <>
                      <Form />
                      <Button
                        className="w-full mt-2"
                        variant="ghost"
                        onPress={() => setView("providers")}
                      >
                        <IoShareSocialOutline className="w-5 h-5 mr-2" />
                        Continue with Providers
                      </Button>
                    </>
                  )}
                  {!dimissable && (
                    <Button
                      className="w-full mt-2"
                      variant="ghost"
                      onPress={() => {
                        setDismissable(false);
                        onClose();
                        router.back();
                      }}
                    >
                      <LogOut className="w-5 h-5 mr-2 rotate-180" />
                      Leave this page
                    </Button>
                  )}
                </div>
              </div>
            </ModalBody>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};
