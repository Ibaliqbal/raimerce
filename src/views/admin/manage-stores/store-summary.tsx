import Card from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import instance from "@/lib/axios/instance";
import { useQuery } from "@tanstack/react-query";
import { FiShoppingBag } from "react-icons/fi";
import { IoStorefront } from "react-icons/io5";
import { motion } from "framer-motion";

const summaryItems = [
  {
    title: "Total Stores",
    icon: FiShoppingBag,
    key: "totalStores",
  },
  { title: "Active Stores", icon: IoStorefront, key: "activeStores" },
];

export function StoresSummary() {
  const { isLoading, data } = useQuery({
    queryKey: ["stores", "summary"],
    queryFn: async () =>
      (await instance.get("/admin/stores?type=stores_summary")).data,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {isLoading
        ? Array.from({ length: summaryItems.length }).map((_, i) => (
            <Skeleton key={i} className="w-full h-[100px]" />
          ))
        : summaryItems.map((store) => (
            <motion.div
              key={store.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0 * 0.1 }}
            >
              <Card className={`border rounded-lg p-4`}>
                <Card.Description asLink={false}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">{store.title}</h3>
                    <store.icon className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-bold mt-2">{data[store.key]}</p>
                </Card.Description>
              </Card>
            </motion.div>
          ))}
    </div>
  );
}
