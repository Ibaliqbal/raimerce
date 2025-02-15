import Card from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  FiPackage,
  FiTrendingUp,
  FiAlertCircle,
  FiDollarSign,
} from "react-icons/fi";

const summaryItems = [
  {
    title: "Total Products",
    value: "1,234",
    icon: FiPackage,
  },
  {
    title: "Top Selling",
    value: "156",
    icon: FiTrendingUp,
  },
  {
    title: "Low Stock",
    value: "23",
    icon: FiAlertCircle,
  },
  {
    title: "Total Revenue",
    value: "$45,678",
    icon: FiDollarSign,
  },
];

export function ProductsSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {summaryItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className={`text-white border rounded-lg p-4`}>
            <Card.Description asLink={false}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">{item.title}</h3>
                <item.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold mt-2">{item.value}</p>
            </Card.Description>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
