import { motion } from "framer-motion";
import { DataTable } from "./data-table";
import { ProductsSummary } from "./products-summary";
const AdminManageProductsView = () => {
  return (
    <section className="lg:col-span-2 flex flex-col gap-4 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8">Products Management</h1>
      </motion.div>
      <ProductsSummary />
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

export default AdminManageProductsView;
