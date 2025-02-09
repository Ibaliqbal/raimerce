import { format } from "date-fns";
import CardComment from "../card/card-comment";

const ProductsComments = () => {
  return (
    <article className="flex flex-col gap-4 pt-3">
      <div className="flex items-center gap-2">
        <h1>Balsss</h1>
        <p className="text-gray-500">{format(new Date(), "dd MMMM, yyyy")}</p>
      </div>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem,
        voluptatum. Autem quod, libero, quo nisi, perspiciatis vitae architecto
        cumque aspernatur veniam molestias laboriosam accusamus optio ea
        reiciendis quaerat necessitatibus.
      </p>
      <div className="grid grid-cols-3 gap-2">
        {/* {Array.from({ length: 4 }).map((_, i) => (
          <CardComment key={i} />
        ))} */}
      </div>
    </article>
  );
};

export default ProductsComments;
