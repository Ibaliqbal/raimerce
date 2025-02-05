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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { productSchema, ProductSchemaT, VariantSchemaT } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormVariantProduct from "./form-variant-product";
import { categories } from "@/utils/constant";
import SubmitButton from "./submit-button";
import CardProductVariant from "@/components/card/card-product-variant";

type Props = {
  handleSubmit: (data: ProductSchemaT) => Promise<void>;
  title: string;
  textBtn: string;
  defaultValues: ProductSchemaT;
  withReset?: boolean;
};

const FormProduct = ({
  title,
  textBtn,
  handleSubmit,
  defaultValues,
  withReset = false,
}: Props) => {
  const form = useForm<ProductSchemaT>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-center">{title}</h1>
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          id="form-product"
          onSubmit={form.handleSubmit(async (data) => {
            try {
              await handleSubmit(data);
              if (withReset) form.reset();
            } catch (error) {
              console.error(error);
            }
          })}
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Name</FormLabel>
                  <FormControl>
                    <Input
                      className="text-base py-7 border border-slate-700"
                      placeholder="Enter your product name..."
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Please enter your name product.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Category</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                      disabled={form.formState.isSubmitting}
                    >
                      <SelectTrigger className="py-7 text-base">
                        <SelectValue placeholder="Select your category product..." />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            value={category.name}
                            key={category.name}
                            className="capitalize"
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Please enter your name product.
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="variant"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3">
                <h3 className="text-lg">Variants</h3>
                <FormControl>
                  <div className="flex flex-col gap-4">
                    {field.value.length > 0 ? (
                      <div className="grid grid-cols-4 gap-4">
                        {field.value.map((data, i) => (
                          <CardProductVariant
                            i={i}
                            key={i}
                            {...data}
                            handleRemove={(index: number) =>
                              field.onChange(
                                field.value.filter((_, i) => index !== i)
                              )
                            }
                            withDelete
                          />
                        ))}
                      </div>
                    ) : null}
                    <FormVariantProduct
                      disabledUploadBtn={form.formState.isSubmitting}
                      handleAdd={(data: VariantSchemaT) => {
                        field.onChange([...field.value, data]);
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
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
                  <p>{field.value?.replace(/\s/g, "").length ?? 0}/1500</p>
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
                <FormDescription>Please describe your product</FormDescription>
              </FormItem>
            )}
          />
          <SubmitButton
            disabled={
              form.formState.isSubmitting ||
              form.getValues("variant").length === 0
            }
            textBtn={form.formState.isSubmitting ? "Loading..." : textBtn}
          />
        </form>
      </Form>
    </section>
  );
};

export default FormProduct;
