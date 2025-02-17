import Image from "../ui/image";
import { categories } from "@/utils/constant";
import Link from "next/link";
import { motion } from "framer-motion";

const ProductCategories = () => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Explore Our Categories
        </motion.h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href={`/products?page=1&c=${category.name.toLowerCase()}`}
                className="block group"
              >
                <div className="rounded-lg shadow-md overflow-hidden transform transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-xl">
                  <div className="p-6">
                    <div className="w-16 h-16 mx-auto mb-4 relative">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-110"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                      {category.name}
                    </h3>
                  </div>
                  <div className="bg-indigo-600 h-1 w-0 group-hover:w-full transition-all duration-300 ease-in-out"></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
