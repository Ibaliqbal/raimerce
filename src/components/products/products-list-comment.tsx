import Link from "next/link";
import React from "react";
import ProductsComments from "./products-comment";
import { TComment, TUser } from "@/lib/db/schema";

type Props = {
  datas: Array<
    Pick<
      TComment,
      "content" | "createdAt" | "id" | "medias" | "rating" | "variant"
    > & {
      user: Pick<TUser, "name"> | null;
    }
  >;
};

const ProductsListComment = ({ datas }: Props) => {
  if (datas?.length <= 0)
    return <p className="italic text-center">No comments for this product</p>;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl">Comments</h3>
      <div className="flex flex-col gap-4 divide-y-2 divide-gray-500">
        {Array.from({ length: 3 }).map((_, i) => (
          <ProductsComments key={i} />
        ))}
      </div>
      <Link
        href={"/products/23/comments"}
        className="self-center hover:underline text-blue-600"
      >
        More Comments
      </Link>
    </div>
  );
};

export default ProductsListComment;
