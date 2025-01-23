import { newsSchema, NewsSchemaT } from "@/types/store";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import SubmitButton from "./submit-button";
import { AxiosError } from "axios";
import { toast } from "sonner";
import instance from "@/lib/axios/instance";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FaCheck } from "react-icons/fa";
import { UploadButton } from "@/utils/uploadthing";
import MediaPreview from "@/components/media-preview";

const FormNews = () => {
  const form = useForm<NewsSchemaT>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      description: "",
      medias: [],
    },
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (data: NewsSchemaT) => {
    try {
      setIsSuccess(false);
      await instance.post("/users/login/store/news", data);

      form.reset();
      setIsSuccess(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
    // You can send the data to your API here.
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        {isSuccess ? (
          <Alert variant="success">
            <FaCheck className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Create new news successfully</AlertDescription>
          </Alert>
        ) : null}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <FormLabel>Description</FormLabel>
                <p>{field.value?.length ?? 0}/1150</p>
              </div>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={form.formState.isSubmitting}
                  className="resize-none h-64 p-3"
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Please enter a brief description of your news article.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="medias"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3">
              <FormControl>
                <div className="flex flex-col">
                  <UploadButton
                    endpoint="uploadMediaNews"
                    className="self-start disabled:cursor-not-allowed"
                    onUploadBegin={() => setIsSuccess(false)}
                    disabled={
                      form.formState.isSubmitting || field.value.length >= 4
                    }
                    onClientUploadComplete={(res) => {
                      if (field.value.length > 0) {
                        field.onChange([
                          ...field.value,
                          ...res.map((data) => data.serverData.media),
                        ]);
                      } else {
                        field.onChange([
                          ...res.map((data) => data.serverData.media),
                        ]);
                      }
                    }}
                  />
                  {field.value.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4 mb-10">
                      {field.value.map((media) => (
                        <MediaPreview
                          key={media.keyFile}
                          type={media.type as "image" | "video"}
                          src={media.url}
                          alt={media.name}
                          keyFile={media.keyFile}
                          disabled={form.formState.isSubmitting}
                          handleDlete={() => {
                            field.onChange(
                              field.value.filter(
                                (data) => data.keyFile !== media.keyFile
                              )
                            );
                          }}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              </FormControl>
              <FormMessage />
              <FormDescription>
                You can also insert some images or videos
              </FormDescription>
            </FormItem>
          )}
        />
        <SubmitButton
          className="self-end"
          disabled={form.formState.isSubmitting}
          textBtn={form.formState.isSubmitting ? "Creating..." : "Create"}
        />
      </form>
    </Form>
  );
};

export default FormNews;
