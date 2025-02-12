import Link from "next/link";
import { TComment, TUser } from "@/lib/db/schema";
import CardComment from "../card/card-comment";

type Props = {
  datas: Array<
    Pick<
      TComment,
      "content" | "createdAt" | "id" | "medias" | "rating" | "variant"
    > & {
      user: Pick<TUser, "name" | "avatar"> | null;
    }
  >;
  id: string;
};

const ProductsListComment = ({ datas, id }: Props) => {
  if (datas?.length <= 0)
    return <p className="italic text-center">No comments for this product</p>;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl">Comments</h3>
      <div className="flex flex-col gap-4">
        {datas.map((comment) => (
          <CardComment key={comment.id} {...comment} />
        ))}
      </div>
      <Link
        href={`/products/${id}/comments`}
        className="self-center hover:underline text-blue-600"
      >
        More Comments
      </Link>
    </div>
  );
};

export default ProductsListComment;
