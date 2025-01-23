import FilterBySelect from "@/components/filter/filter-by-select";
import FilterBySearch from "@/components/filter/filter-by-search";
import { categories, ratings } from "@/utils/constant";
import ListProducts from "./list-products";
import PaginationProducts from "./pagination-products";

const ProductsView = () => {
  return (
    <main className="flex flex-col gap-4 wrapper-page pb-10">
      <div className="flex justify-between items-center">
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
        <div>
          <FilterBySearch />
        </div>
      </div>
      <ListProducts />
      <PaginationProducts />
    </main>
  );
};

export default ProductsView;
