import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import Card from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import instance from "@/lib/axios/instance";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusOrder, TUser } from "@/lib/db/schema";
import { convertPrice } from "@/utils/helper";

const RecentOrders = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["orders", "recent"],
    queryFn: async () =>
      (await instance.get("/admin/dashboard?type=recent_orders")).data.data,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <Card.Description asLink={false}>
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {isLoading
              ? [...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="w-full h-[150px]" />
                ))
              : data.map(
                  (order: {
                    transactionCode: string;
                    total: number;
                    user: Pick<TUser, "avatar" | "name">;
                    status: (typeof StatusOrder.enumValues)[number];
                  }) => (
                    <div
                      key={order.transactionCode}
                      className="flex items-center"
                    >
                      <Avatar>
                        <AvatarImage
                          src={order.user.avatar?.url}
                          alt="Avatar"
                        />
                        <AvatarFallback>
                          {order.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {order.transactionCode}
                        </p>
                        <p className="text-sm text-gray-500">{order.status}</p>
                      </div>
                      <div className="ml-auto font-medium">
                        {convertPrice(order.total)}
                      </div>
                    </div>
                  )
                )}
          </div>
        </Card.Description>
      </Card>
    </motion.div>
  );
};

export default RecentOrders;
