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
import { updateStoreSchema, UpdateStoreSchemaT } from "@/types/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import SubmitButton from "./submit-button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  name: string;
  description: string;
  email: string;
};

const FormUpdateStore = ({ name, description, email }: Props) => {
  const form = useForm<UpdateStoreSchemaT>({
    resolver: zodResolver(updateStoreSchema),
    values: {
      name: name ? name : "",
      description: description ?? "",
      email: email ?? "",
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-3"
        // onSubmit={form.handleSubmit(onSubmit)}
      >
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
              <FormDescription>Please enter your store name.</FormDescription>
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
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel className="text-lg">Description</FormLabel>
                <p>{field.value?.length ?? 0}/350</p>
              </div>
              <FormControl>
                <Textarea
                  className="border border-slate-700 resize-none h-56 text-base"
                  placeholder="Enter your product name..."
                  {...field}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>Please describe your store</FormDescription>
            </FormItem>
          )}
        />
        <SubmitButton
          disabled={form.formState.isSubmitting}
          textBtn={form.formState.isSubmitting ? "Loading..." : "Submit"}
          className="self-start"
        />
      </form>
    </Form>
  );
};

export default FormUpdateStore;
