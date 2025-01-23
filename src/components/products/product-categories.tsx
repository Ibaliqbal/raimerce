import React from "react";
import Image from "../ui/image";
import { categories } from "@/utils/constant";
import Link from "next/link";

const ProductCategories = () => {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Categories</h1>
      <div className="flex gap-4 flex-wrap">
        {categories.map((category, i) => (
          <Link
            href={`/products?page=1&c=${category.name.toLowerCase()}`}
            className="flex flex-col items-center gap-3 w-fit h-fit p-4 hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10 transition-all duration-300 ease-linear rounded-md"
            key={i}
          >
            <Image
              figureClassName=""
              width={80}
              height={80}
              src={category.image}
              alt="Icon"
            />
            <p>{category.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProductCategories;
