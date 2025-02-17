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
import Stats from "./stats";
import RevenueChart from "./revenue-chart";
import ProductsChart from "./products-chart";
import RecentOrders from "./recent-order";

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

      <RecentOrders />
    </section>
  );
};

export default AdminDashboardView;
