import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateProfileSchema, UpdateProfileT } from "@/types/user";
import SubmitButton from "./submit-button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/lib/axios/instance";
import { AxiosError } from "axios";
import { toast } from "sonner";

type Props = {
  name: string;
  email: string;
  phone: string;
};

const FormUpdateUser = ({ name, email, phone }: Props) => {
  const form = useForm<UpdateProfileT>({
    resolver: zodResolver(updateProfileSchema),
    values: {
      name: name ? name : "",
      email: email ? email : "",
      phone: phone ? phone : "",
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: UpdateProfileT) =>
      await instance.put(`/users/login?_type=update_profile`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["login-user"],
      });
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    },
  });

  const onSubmit = (data: UpdateProfileT) => {
    mutate(data);
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <section className="grid grid-cols-2 gap-x-4 gap-y-2">
          {" "}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Name</FormLabel>
                <FormControl>
                  <Input
                    className="text-base py-7 border border-slate-700"
                    placeholder="Enter your name..."
                    {...field}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>Please enter your full name.</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Phone</FormLabel>
                <FormControl>
                  <Input
                    className="text-base py-7 border border-slate-700"
                    placeholder="Enter your phone..."
                    {...field}
                    value={field.value === undefined ? "" : field.value}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : value);
                    }}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Please provide a valid phone number for contact purposes.
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Email</FormLabel>
                <FormControl>
                  <Input
                    className="text-base py-7 border border-slate-700"
                    placeholder="Enter your email..."
                    {...field}
                    disabled
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Your email address will be used for account-related
                  communications.
                </FormDescription>
              </FormItem>
            )}
          />
        </section>
        <SubmitButton
          disabled={form.formState.isSubmitting}
          textBtn={
            form.formState.isSubmitting || isPending ? "Loading..." : "Submit"
          }
          className="self-start"
        />
      </form>
    </Form>
  );
};

export default FormUpdateUser;
