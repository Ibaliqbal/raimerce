import { signupSchema, SignupSchemaT } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import instance from "@/lib/axios/instance";
import { AxiosError } from "axios";
import { toast } from "sonner";
import SubmitButton from "../submit-button";

const FormSignup = () => {
  const form = useForm<SignupSchemaT>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });

  const handleSubmit = async (data: SignupSchemaT) => {
    try {
      const res = await instance.post("/auth/register", data);
      if (!res.data.successCraete) {
        toast.error(res.data.message);
        return;
      }
      toast.success(res.data.message);
      form.reset();
    } catch (error) {
      const axiosError = error as AxiosError;
      const res = axiosError.response?.data as {
        message: string;
        statusCode: number;
      };
      throw new Error(`Internal server error : ${res.message}`);
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="md:text-base text-sm">Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g John Doe"
                  className="text-base md:py-5 py-3 border-2 border-slate-700 focus:outline-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormLabel className="text-sm">
                Masukkan nama lengkap anda
              </FormLabel>
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="md:text-base text-sm">
                Confirm Password
              </FormLabel>
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
          disabled={form.formState.isSubmitting}
          textBtn={form.formState.isSubmitting ? "Loading..." : "Register"}
          className="py-6"
        />
      </form>
    </Form>
  );
};

export default FormSignup;
