import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FaCheck } from "react-icons/fa";
import { resetPasswordSchema, TResetPasswordT } from "@/types/user";
import { Input } from "@/components/ui/input";
import SubmitButton from "./submit-button";
import { AxiosError } from "axios";
import instance from "@/lib/axios/instance";

const FormChangePassword = () => {
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const form = useForm<TResetPasswordT>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = async (data: TResetPasswordT) => {
    setError("");
    try {
      const res = await instance.put(
        "/users/login?_type=change_password",
        data
      );

      setIsSuccess(res.data.message);
      form.reset();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data.message === "Password is incorrect") {
          setError(error.response?.data.message);
          form.resetField("oldPassword");
        }
      }
    }
  };
  return (
    <Form {...form}>
      <form
        className="mt-4 flex gap-3 flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h3>Change password</h3>

        {error ? <p className="text-red-600">{error}</p> : null}
        {isSuccess ? (
          <Alert variant="success">
            <FaCheck className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Change password successfully</AlertDescription>
          </Alert>
        ) : null}
        <div className="flex gap-3 items-center">
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 lg:w-[40%] md:w-[60%] w-full">
                <FormLabel htmlFor={field.name}>Old Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Input your old password..."
                  className="py-5 border border-slate-700"
                  id={field.name}
                  {...field}
                />
                <FormMessage />
                <FormDescription>Masukkan kata sandi lama mu</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 lg:w-[40%] md:w-[60%] w-full">
                <FormLabel htmlFor={field.name}>New Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Input your new password..."
                  className="py-5 border border-slate-700"
                  id={field.name}
                  {...field}
                />
                <FormMessage />
                <FormDescription>Masukkan kata sandi baru mu</FormDescription>
              </FormItem>
            )}
          />
        </div>
        <SubmitButton
          textBtn={form.formState.isSubmitting ? "Resetting..." : "Reset"}
          disabled={form.formState.isSubmitting}
          className="self-start"
        />
      </form>
    </Form>
  );
};

export default FormChangePassword;
