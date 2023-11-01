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

import { createUser, userExistance } from "@/lib/actions/user.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogOut } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { useSignInContext } from "@/components/hooks/useSignIn";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email type" }),
  password: z
    .string()
    .min(3, { message: "Passwords must be longer than 3 characters" }),
});

const signUpFormSchema = z.object({
  username: z.string().min(4, { message: "Username is too short" }),
  email: z.string().email({ message: "Invalid email type" }),
  password: z.string().min(3, { message: "Password is too short." }),
});

const SignInForm = ({
  setTab,
}: {
  setTab: React.Dispatch<React.SetStateAction<"login" | "register">>;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const isLoading = form.formState.isLoading || form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, password } = values;
    const res = await userExistance({ email, password });
    if (res?.error) toast.error(res.error);
    else {
      toast.success("Logged in!");
      setTimeout(() => {
        signIn("credentials", {
          email,
          password,
          redirect: true,
          callbackUrl: "/",
        });
      }, 350);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    label="Email"
                    variant="underlined"
                    radius="sm"
                    size="sm"
                    isClearable
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type={isVisible ? "text" : "password"}
                    label="Password"
                    variant="underlined"
                    radius="sm"
                    size="sm"
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
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div
            className="pb-2 text-small text-blue-500 cursor-pointer hover:opacity-80 transition-colors"
            onClick={() => setTab("register")}
          >
            Don&apos;t have an account?
          </div>
          <Button
            className="w-full mt-2"
            variant="ghost"
            color="primary"
            isLoading={isLoading}
            type="submit"
          >
            {isLoading ? "Signing In" : "Sign In"}
          </Button>
        </form>
      </Form>
    </>
  );
};

const SignUpForm = ({
  setTab,
}: {
  setTab: React.Dispatch<React.SetStateAction<"login" | "register">>;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
  });

  const isLoading = form.formState.isLoading || form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof signUpFormSchema>) => {
    const { username, email, password } = values;
    const res = await createUser({ username, email, password });
    if (res?.error) toast.error(res.error);
    else {
      setTimeout(() => {
        signIn("credentials", {
          email,
          password,
          redirect: true,
          callbackUrl: "/",
        });
      }, 350);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    label="Username"
                    variant="underlined"
                    radius="sm"
                    size="sm"
                    isClearable
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    label="Email"
                    variant="underlined"
                    radius="sm"
                    size="sm"
                    isClearable
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type={isVisible ? "text" : "password"}
                    label="Password"
                    variant="underlined"
                    radius="sm"
                    size="sm"
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
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div
            className="pb-2 text-small text-blue-500 cursor-pointer hover:opacity-80 transition-colors"
            onClick={() => setTab("login")}
          >
            Already have an account?
          </div>
          <Button
            className="w-full mt-2"
            variant="ghost"
            color="primary"
            isLoading={isLoading}
            type="submit"
          >
            {isLoading ? "Signing Up" : "Sign Up"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export const SignIn = () => {
  const router = useRouter();
  const [view, setView] = useState("providers");
  const [tab, setTab] = useState<"login" | "register">("login");
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
                      {tab === "login" ? (
                        <>
                          <SignInForm setTab={setTab} />
                          <Button
                            className="w-full mt-2"
                            variant="ghost"
                            onPress={() => setView("providers")}
                          >
                            <IoShareSocialOutline className="w-5 h-5 mr-2" />
                            Continue with Providers
                          </Button>
                        </>
                      ) : (
                        <SignUpForm setTab={setTab} />
                      )}
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
