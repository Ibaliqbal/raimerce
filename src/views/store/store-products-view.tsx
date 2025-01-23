import FilterBySelect from "@/components/filter/filter-by-select";
import StoreListProducts from "./store-list-products";
import { categories, ratings } from "@/utils/constant";

const StoreProductsView = () => {
  return (
    <section className="flex flex-col gap-4 pb-10">
      <div className="flex items-center gap-2">
        <FilterBySelect
          filterBy="category"
          lists={categories.map((category) => category.name)}
        />
        <FilterBySelect
          filterBy="rating"
          lists={ratings.map((rating) => rating.toString())}
        />
      </div>
      <StoreListProducts />
    </section>
  );
};

export default StoreProductsView;
