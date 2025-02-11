import MediaPreview from "@/components/media-preview";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Rating from "@/components/ui/rating";
import { Textarea } from "@/components/ui/textarea";
import { commentSchema, CommentSchemaT } from "@/types/comment";
import { UploadButton } from "@/utils/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import SubmitButton from "./submit-button";
import { Button } from "@/components/ui/button";
import instance from "@/lib/axios/instance";
import { Loader2 } from "lucide-react";

type Props = {
  handleSubmit: (data: CommentSchemaT) => void;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
};

const FormCommentProduct = ({ handleSubmit, setOpenModal }: Props) => {
  const form = useForm<CommentSchemaT>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      rating: 0,
      content: "",
      medias: [],
    },
  });
  const [status, setStatus] = useState(false);
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(async (data) => {
          try {
            handleSubmit(data);
            form.reset();
          } catch (error) {
            console.log(error);
          }
        })}
      >
        <FormField
          name="rating"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3">
              <FormControl>
                <Rating
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <FormLabel>Comment</FormLabel>
                <p>{field.value?.replace(/\s/g, "").length ?? 0}/500</p>
              </div>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={form.formState.isSubmitting}
                  className="resize-none h-48 p-3"
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Please provide a captivating brief description of your news
                article. Use words that spark the reader{"'"}s interest!
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
                    endpoint="imageUploader"
                    className="self-start disabled:cursor-not-allowed"
                    disabled={
                      form.formState.isSubmitting || field.value.length >= 2
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
                    onBeforeUploadBegin={(files) => {
                      return files.map((f) => {
                        const timestamp = new Date().getTime();
                        return new File([f], `${timestamp}-${f.name}`, {
                          type: f.type,
                        });
                      });
                    }}
                  />
                  {field.value.length > 0 ? (
                    <div className="grid md:grid-cols-3 grid-cols-2  gap-4 mb-10">
                      {field.value.map((media) => (
                        <MediaPreview
                          key={media.keyFile}
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
              <FormDescription>You can also insert some images</FormDescription>
            </FormItem>
          )}
        />
        <div className="self-end flex gap-3 items-center">
          <Button
            variant="destructive"
            size="lg"
            onClick={async () => {
              setStatus(true);
              const deleteFiles = async () => {
                for (const file of form.getValues("medias")) {
                  try {
                    await instance.delete(`/files/${file.keyFile}`);
                  } catch (error) {
                    console.log(error);
                  }
                }
              };

              await Promise.all([deleteFiles()]);
              setStatus(false);
              form.reset();
              setOpenModal(false);
            }}
            type="button"
            disabled={status || form.formState.isSubmitting}
          >
            {status && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Cancel
          </Button>
          <SubmitButton
            disabled={form.formState.isSubmitting || status}
            textBtn={form.formState.isSubmitting ? "Submitting..." : "Submit"}
          />
        </div>
      </form>
    </Form>
  );
};

export default FormCommentProduct;
