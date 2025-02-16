import Card from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import instance from "@/lib/axios/instance";
import { convertPrice } from "@/utils/helper";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FiPackage, FiDollarSign } from "react-icons/fi";

export function ProductsSummary() {
  const { isLoading, data } = useQuery({
    queryKey: ["products", "summary"],
    queryFn: async () =>
      (await instance.get("/admin/products?type=products_summary")).data,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  return (
    <div className="grid grid-cols-2 gap-6 mb-8">
      {isLoading ? (
        <Skeleton className="w-full h-[100px]" />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 * 0.1 }}
        >
          <Card className={`border rounded-lg p-4`}>
            <Card.Description asLink={false}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Total Products</h3>
                <FiPackage className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold mt-2">{data.totalProducts}</p>
            </Card.Description>
          </Card>
        </motion.div>
      )}
      {isLoading ? (
        <Skeleton className="w-full h-[100px]" />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 * 0.1 }}
        >
          <Card className={`border rounded-lg p-4`}>
            <Card.Description asLink={false}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Total Revenue</h3>
                <FiDollarSign className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold mt-2">
                {convertPrice(data.totalRevenue)}
              </p>
            </Card.Description>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
