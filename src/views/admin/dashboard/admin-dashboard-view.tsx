import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Stats from "./stats";
import RevenueChart from "./revenue-chart";
import ProductsChart from "./products-chart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboardView = () => {
  return (
    <section className="lg:col-span-2 flex flex-col gap-4 pb-8">
      <motion.h1
        className="text-4xl font-bold mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        👋 Welcome back Admin
      </motion.h1>

      <Stats />

      <RevenueChart />

      <ProductsChart />

      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <Card.Description asLink={false}>
            <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <Avatar>
                    <AvatarImage
                      src={`https://i.pravatar.cc/150?img=${i + 1}`}
                      alt="Avatar"
                    />
                    <AvatarFallback>ORD</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Order #{1000 + i}
                    </p>
                    <p className="text-sm text-gray-500">
                      {
                        ["Pending", "Processing", "Shipped", "Delivered"][
                          Math.floor(Math.random() * 4)
                        ]
                      }
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    ${(Math.random() * 200 + 50).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </Card.Description>
        </Card>
      </motion.div> */}
    </section>
  );
};

export default AdminDashboardView;
