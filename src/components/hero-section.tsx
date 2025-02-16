import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="h-[70dvh] flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0 }} // Keadaan awal
        animate={{ opacity: 1 }} // Keadaan animasi
        exit={{ opacity: 0 }} // Keadaan keluar
        transition={{ duration: 0.5, ease: "easeInOut" }} // Transisi
        className="text-center"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-300 dark:to-gray-100">
          Open Source E-Commerce
          <br />
          <span className="text-gray-800 dark:text-white">For Everyone</span>
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl mb-8 max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
          Build your online store with our powerful, and free e-commerce
          platform.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button
            size="xl"
            onClick={() =>
              window.open(
                "https://github.com/Ibaliqbal/raimerce#readme",
                "_blank"
              )
            }
            className="bg-gray-800 text-white hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-800 dark:hover:bg-gray-300 transition-colors duration-300"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="xl"
            variant="outline"
            onClick={() =>
              window.open("https://github.com/Ibaliqbal/raimerce", "_blank")
            }
            className="border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white dark:border-gray-200 dark:text-gray-200 dark:hover:bg-gray-200 dark:hover:text-gray-800 transition-colors duration-300"
          >
            <Github className="mr-2 h-5 w-5" />
            View on GitHub
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
