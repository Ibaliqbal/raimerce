import Image from "../ui/image";
import { categories } from "@/utils/constant";
import Link from "next/link";

const ProductCategories = () => {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Categories</h1>
      <div className="lg:flex gap-4 grid md:grid-cols-4 grid-cols-3">
        {categories.map((category, i) => (
          <Link
            href={`/products?page=1&c=${category.name.toLowerCase()}`}
            className="flex flex-col items-center gap-3 w-fit h-fit p-4 hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10 transition-all duration-300 ease-linear rounded-md"
            key={i}
          >
            <Image
              figureClassName="md:w-[80px] md:h-[80px] w-[50px] h-[50px]"
              width={80}
              height={80}
              src={category.image}
              alt="Icon"
              className="w-full h-full"
            />
            <p>{category.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProductCategories;
