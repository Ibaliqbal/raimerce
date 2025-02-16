import {
  FiUsers,
  FiShoppingBag,
  FiPackage,
  FiDollarSign,
} from "react-icons/fi";
import { motion } from "framer-motion";
import Card from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import instance from "@/lib/axios/instance";
import { convertPrice } from "@/utils/helper";
import { Skeleton } from "@/components/ui/skeleton";

const stats = [
  {
    title: "Total Users",
    key: "totalUsers",
    icon: FiUsers,
  },
  {
    title: "Active Stores",
    key: "totalStores",
    icon: FiShoppingBag,
  },
  {
    title: "Total Products",
    key: "totalProducts",
    icon: FiPackage,
  },
  {
    title: "Revenue",
    key: "totalRevenue",
    icon: FiDollarSign,
  },
];
const Stats = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      // Fetch dashboard stats
      const response = await instance.get("/admin/dashboard");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {isLoading
        ? Array.from({ length: stats.length }).map((_, i) => (
            <Skeleton key={i} className="w-full h-[100px]" />
          ))
        : stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`border rounded-lg p-4`}>
                <Card.Description asLink={false}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">{stat.title}</h3>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    {stat.key === "totalRevenue"
                      ? convertPrice(data[stat.key])
                      : data[stat.key]}
                  </p>
                </Card.Description>
              </Card>
            </motion.div>
          ))}
    </div>
  );
};

export default Stats;
