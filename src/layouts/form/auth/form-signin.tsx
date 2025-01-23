import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signinSchema, SigninSchemaT } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import SubmitButton from "../submit-button";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useLoadingScreen } from "@/context/loading-screen-context";

const FormSignin = () => {
  const form = useForm<SigninSchemaT>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const callbackUrl = (router.query.callbackUrl as string) || "/";
  const { open, setOpen } = useLoadingScreen();

  const handleSubmit = async (data: SigninSchemaT) => {
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!res?.ok) return toast.error(res?.error);

      router.push(callbackUrl);
      setOpen(true);
    } catch (error) {
      const err = error as Error;
      console.error(err);
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="md:text-base text-sm">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g johndoe@gmail.com"
                  className="text-base md:py-5 py-3 border-2 border-slate-700 focus:outline-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormLabel className="text-sm">
                Masukkan alamat email yang terdaftar
              </FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="md:text-base text-sm">Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="********"
                  className="text-base md:py-5 py-3 border-2 border-slate-700 focus:outline-none"
                  {...field}
                  type="password"
                />
              </FormControl>
              <FormMessage />
              <FormLabel className="text-sm">
                Masukkan kata sandi yang sudah diatur
              </FormLabel>
            </FormItem>
          )}
        />
        <SubmitButton
          disabled={form.formState.isSubmitting || open}
          textBtn={form.formState.isSubmitting || open ? "Loading..." : "Login"}
          className="py-6"
        />
      </form>
    </Form>
  );
};

export default FormSignin;
