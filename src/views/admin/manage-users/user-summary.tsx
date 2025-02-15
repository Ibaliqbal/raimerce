import Card from "@/components/ui/card";
import { FiUsers, FiUserPlus, FiUserCheck, FiUserX } from "react-icons/fi";
import { motion } from "framer-motion";

const summaryItems = [
  { title: "Total Users", value: "5,234", icon: FiUsers },
  { title: "New Users", value: "120", icon: FiUserPlus },
  {
    title: "Active Users",
    value: "4,500",
    icon: FiUserCheck,
  },
  { title: "Inactive Users", value: "734", icon: FiUserX },
];

export function UsersSummary() {
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
