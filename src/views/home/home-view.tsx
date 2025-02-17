import ProductCategories from "@/components/products/product-categories";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ListProducts from "./list-products";
import HeroSection from "@/components/hero-section";

const HomeView = () => {
  return (
    <main className="flex flex-col gap-4 wrapper-page pb-10">
      <HeroSection />
      <ProductCategories />
      <section className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold">Recomandation</h1>
        <ListProducts />
        <Button
          asChild
          className="w-fit self-center"
          variant="outline"
          size="lg"
        >
          <Link href={"/products?page=1"}>More products</Link>
        </Button>
      </section>
    </main>
  );
};

export default HomeView;
