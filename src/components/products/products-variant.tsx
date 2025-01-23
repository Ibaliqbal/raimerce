import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { VariantSchemaT } from "@/types/product";

type Props = {
  isSelected: boolean;
  variant: VariantSchemaT;
  onClick: () => void;
};

const ProductsVariant = ({ isSelected, variant, onClick }: Props) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <p
            onClick={() => onClick()}
            className={cn(
              "md:py-3 md:px-4 py-2 px-3 rounded-md cursor-pointer text-center",
              isSelected
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "border border-gray-500"
            )}
          >
            {variant.name_variant}
          </p>
        </TooltipTrigger>
        <TooltipContent>
          <p>Stock : {variant.stock}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ProductsVariant;
