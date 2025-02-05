import { Button } from "@/components/ui/button";
import FormProduct from "@/layouts/form/form-product";
import instance from "@/lib/axios/instance";
import { TProducts } from "@/lib/db/schema";
import { VariantSchemaT } from "@/types/product";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-hot-toast";

type Props = {
  data: Pick<TProducts, "category" | "description" | "id" | "name" | "variant">;
};

const StoreProductUpdateView = ({ data }: Props) => {
  const router = useRouter();
  return (
    <main className="container max-w-7xl p-4 flex flex-col gap-4 pb-10">
      <Button
        className="flex items-center gap-3 w-fit"
        variant="icon"
        onClick={() => router.back()}
      >
        <FaArrowLeft />
        Back
      </Button>
      <FormProduct
        title="Update your product"
        textBtn="Update"
        handleSubmit={async (dataForm) => {
          try {
            const res = await instance.put(
              `/users/login/store/products/${data.id}`,
              dataForm
            );
            toast.success(res.data.message);
          } catch (error) {
            if (error instanceof AxiosError) {
              toast.error(error.response?.data.message);
            }
          }
        }}
        defaultValues={{
          name: data.name,
          description: data.description as string,
          category: data.category as string,
          variant: data.variant as Array<VariantSchemaT>,
        }}
      />
    </main>
  );
};

export default StoreProductUpdateView;
