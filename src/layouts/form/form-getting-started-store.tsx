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
import { Textarea } from "@/components/ui/textarea";
import { useGetUserLogin } from "@/context/user-context";
import { gettingStartedSchema, GettingStartedSchemaT } from "@/types/store";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import SubmitButton from "./submit-button";
import { Checkbox } from "@/components/ui/checkbox";
import { AxiosError } from "axios";
import { toast } from "sonner";
import instance from "@/lib/axios/instance";
import { useRouter } from "next/router";
import UploadImageWithPreview from "@/components/upload-image-with-preview";

const FormGettingStartedStore = () => {
  const router = useRouter();
  const data = useGetUserLogin();
  const form = useForm<GettingStartedSchemaT>({
    resolver: zodResolver(gettingStartedSchema),
    values: {
      name: "",
      description: "",
      agreeRule: false,
      email: data?.user ? data.user.email : "",
      headerPhoto: {
        keyFile: "",
        url: "",
        name: "",
        type: "",
      },
    },
  });

  const handleSubmit = async (data: GettingStartedSchemaT) => {
    try {
      const res = await instance.post("/stores", data);
      toast.success(res.data.message);
      form.reset();
      router.push("/my/store");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
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
          name="headerPhoto"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <UploadImageWithPreview
                  endpoint="uploadHeaderPhotoStore"
                  url={field.value.url}
                  customHeight={300}
                  onUploadComplete={async (media) => {
                    if (!!field.value.keyFile) {
                      await instance.delete(`/files/${field.value.keyFile}`);
                      field.onChange({
                        url: media.url,
                        name: media.name,
                        type: media.type,
                        keyFile: media.keyFile,
                      });
                    } else {
                      field.onChange({
                        url: media.url,
                        name: media.name,
                        type: media.type,
                        keyFile: media.keyFile,
                      });
                    }
                  }}
                  alt={field.value.name}
                  isLoading={form.formState.isSubmitting}
                />
              </FormControl>
            </FormItem>
          )}
        />
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
                  placeholder="Enter your name..."
                  {...field}
                  disabled
                  type="email"
                />
              </FormControl>
              <FormMessage />
              <FormDescription>Please enter your email store.</FormDescription>
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
                <p>{field.value?.length ?? 0}/250</p>
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
        <FormField
          control={form.control}
          name="agreeRule"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Saya setuju dengan semua peraturan yang berlaku
                </FormLabel>
                <FormDescription>
                  Dengan ini, saya menerima semua konsekuensi yang mungkin
                  timbul.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <SubmitButton
          disabled={form.formState.isSubmitting || !form.getValues("agreeRule")}
          textBtn={form.formState.isSubmitting ? "Please wait..." : "Create"}
          className="self-start"
        />
      </form>
    </Form>
  );
};

export default FormGettingStartedStore;
