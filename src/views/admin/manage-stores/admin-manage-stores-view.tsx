import { motion } from "framer-motion";
import { DataTable } from "./data-table";
import { StoresSummary } from "./store-summary";
const AdminManageStoresView = () => {
  return (
    <section className="lg:col-span-2 flex flex-col gap-4 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8">Stores Management</h1>
      </motion.div>
      <StoresSummary />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <DataTable />
      </motion.div>
    </section>
  );
};

export default AdminManageStoresView;
