import { Button } from "@/components/ui/button";
import FormProduct from "@/layouts/form/form-product";
import instance from "@/lib/axios/instance";
import { ProductSchemaT } from "@/types/product";
import { useRouter } from "next/router";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "sonner";

const StoreCreateProductView = () => {
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
        title="Create your new product"
        textBtn="Create"
        handleSubmit={async (data: ProductSchemaT) => {
          try {
            const res = await instance.post(
              "/users/login/store/products",
              data
            );
            toast.success(res.data.message);
          } catch (error) {
            console.error(error);
          }
        }}
        defaultValues={{
          name: "",
          description: "",
          category: "",
          variant: [],
        }}
        withReset
      />
    </main>
  );
};

export default StoreCreateProductView;
