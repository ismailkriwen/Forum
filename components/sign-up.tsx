"use client";

import { signIn } from "next-auth/react";
import { FaGoogle, FaGithub } from "react-icons/fa";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
} from "@nextui-org/react";
import { useState } from "react";

import { createUser, oldUserExistance } from "@/lib/actions/user.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

import { useSignUpContext } from "@/components/hooks/useSignUp";

const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be longer than 3 characters" }),
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
    const { username, email, password } = values;
    setIsLoading(true);
    const res = await oldUserExistance({ email, username });
    setIsLoading(false);
    if (res?.error) return setError(res.error);

    if (isSubmitSuccessful) {
      setIsLoading(true);
      const res = await createUser({ username, email, password });
      if (res?.success)
        signIn("credentials", {
          email,
          password,
          redirect: false,
          callbackUrl: "/profile"
        });
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-3">
        <Input
          {...register("username")}
          label="Username"
          variant="bordered"
          radius="sm"
          size="sm"
          isClearable
          isRequired
        />
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
          Sign Up
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

export const SignUp = () => {
  const { isOpen, onOpenChange } = useSignUpContext();

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        backdrop:
          "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
    >
      <ModalContent>
        <>
          <ModalBody>
            <div className="my-4 flex items-center justify-center">
              <div className="md:w-2/3 max-md:mt-4">
                <Button
                  className="w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    signIn("google");
                  }}
                  variant="ghost"
                >
                  <FaGoogle className="w-5 h-5 mr-2" />
                  Continue with Google
                </Button>
                <Button
                  className="w-full mt-2"
                  onClick={(e) => {
                    e.preventDefault();
                    signIn("github");
                  }}
                  variant="ghost"
                >
                  <FaGithub className="w-5 h-5 mr-2" />
                  Continue with GitHub
                </Button>
                <Form />
              </div>
            </div>
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  );
};
