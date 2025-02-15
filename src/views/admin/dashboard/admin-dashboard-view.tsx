import { motion } from "framer-motion";
import { Bar, Line } from "react-chartjs-2";
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
} from "chart.js";
import {
  FiUsers,
  FiShoppingBag,
  FiPackage,
  FiDollarSign,
} from "react-icons/fi";
import Card from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboardView = () => {
  const stats = [
    {
      title: "Total Users",
      value: "3,721",
      icon: FiUsers,
      color: "bg-blue-500",
    },
    {
      title: "Active Stores",
      value: "523",
      icon: FiShoppingBag,
      color: "bg-green-500",
    },
    {
      title: "Total Products",
      value: "12,234",
      icon: FiPackage,
      color: "bg-yellow-500",
    },
    {
      title: "Revenue",
      value: "$45,231",
      icon: FiDollarSign,
      color: "bg-purple-500",
    },
  ];

  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [12000, 19000, 15000, 22000, 18000, 25000],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
  };

  const productData = {
    labels: ["Electronics", "Clothing", "Books", "Home", "Beauty"],
    datasets: [
      {
        label: "Products by Category",
        data: [4500, 3200, 2100, 1800, 950],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className={`text-white border rounded-lg p-4`}>
              <Card.Description asLink={false}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">{stat.title}</h3>
                  <stat.icon className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </Card.Description>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <Card.Description asLink={false}>
            <h3 className="text-lg font-semibold mb-4">Revenue Over Time</h3>
            <Line data={revenueData} options={{ responsive: true }} />
          </Card.Description>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <Card.Description asLink={false}>
            <h3 className="text-lg font-semibold mb-4">Products by Category</h3>
            <Bar data={productData} options={{ responsive: true }} />
          </Card.Description>
        </Card>
      </motion.div>

      <motion.div
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
      </motion.div>
    </section>
  );
};

export default AdminDashboardView;
