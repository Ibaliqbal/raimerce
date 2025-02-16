import Card from "@/components/ui/card";
import { FiUsers, FiUserPlus, FiUserCheck, FiUserX } from "react-icons/fi";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import instance from "@/lib/axios/instance";
import { Skeleton } from "@/components/ui/skeleton";

const userStats = [
  {
    label: "Total Users",
    icon: <FiUsers className="h-5 w-5" />,
    key: "totalUsers",
  },
  {
    label: "New Users",
    icon: <FiUserPlus className="h-5 w-5" />,
    key: "newUsers",
  },
  {
    label: "Active Users",
    icon: <FiUserCheck className="h-5 w-5" />,
    key: "activeUsers",
  },
  {
    label: "Inactive Users",
    icon: <FiUserX className="h-5 w-5" />,
    key: "inactiveUsers",
  },
];

export function UsersSummary() {
  const { isLoading, data } = useQuery({
    queryKey: ["users", "summary"],
    queryFn: async () =>
      (await instance.get("/admin/users?type=users_summary")).data,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {isLoading
        ? Array.from({ length: userStats.length }).map((_, i) => (
            <Skeleton className="w-full h-[100px]" key={i} />
          ))
        : userStats.map((user) => (
            <motion.div
              key={user.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0 * 0.1 }}
            >
              <Card className={`border rounded-lg p-4`}>
                <Card.Description asLink={false}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">{user.label}</h3>
                    {user.icon}
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    {user.key === "inactiveUsers"
                      ? data.totalUsers - data.activeUsers
                      : data[user.key]}
                  </p>
                </Card.Description>
              </Card>
            </motion.div>
          ))}
    </div>
  );
}
