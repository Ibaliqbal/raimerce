import { useRouter } from "next/router";
import { VariantSchemaT } from "@/types/product";
import Image from "../ui/image";
import { motion } from "framer-motion";
import ProductsVariant from "./products-variant";

type Props = {
  defaultVariant: VariantSchemaT;
  withCustomSelected?: boolean;
  lists: Array<VariantSchemaT>;
  productId: string;
};

const ProductsListVariant = ({
  defaultVariant,
  withCustomSelected = false,
  lists,
  productId,
}: Props) => {
  const { push } = useRouter();

  return (
    <div className="flex flex-col gap-6 rounded-lg">
      <motion.div
        className="flex gap-3 flex-wrap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {lists.map((variant, i) => (
          <ProductsVariant
            key={i}
            isSelected={
              withCustomSelected
                ? variant.name_variant === defaultVariant?.name_variant
                : false
            }
            variant={variant}
            onClick={() =>
              push(`/products/${productId}?variant=${variant.name_variant}`)
            }
          />
        ))}
      </motion.div>

      <motion.div
        className="p-4 rounded-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold mb-2">Stock</h2>
        <p className="text-2xl font-bold text-indigo-600">
          {defaultVariant.stock}
          <span className="text-sm font-normal text-gray-300 ml-2">
            units available
          </span>
        </p>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-3 grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {defaultVariant.medias.map((media, index) => (
          <motion.div
            key={media.keyFile}
            className="relative overflow-hidden rounded-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={media.url}
              alt={`Product Image ${index + 1}`}
              width={400}
              height={400}
              figureClassName="w-full md:h-[250px] h-[150px] relative rounded-lg overflow-hidden"
              className="w-full h-full absolute inset-0 object-cover object-center transition-transform duration-300 ease-in-out"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ProductsListVariant;
