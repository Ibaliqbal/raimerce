import { ApiResponse, secureMethods } from "@/utils/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { CommentsTable, ProductsTable, TComment } from "@/lib/db/schema";

type Data = ApiResponse & {
  data?: Array<
    Pick<
      TComment,
      "id" | "content" | "rating" | "createdAt" | "medias" | "variant"
    >
  >;
};

const acceptMethods = ["GET"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethods, req, res, async () => {
    const _id = req.query.id as string;

    const productDetail = await db.query.ProductsTable.findFirst({
      where: eq(ProductsTable.id, _id),
      columns: {
        id: true,
        name: true,
        category: true,
        rating: true,
        variant: true,
      },
    });

    if (!productDetail)
      return res.status(404).json({
        message: "Product not found",
        statusCode: 404,
      });

    const data = await db.query.CommentsTable.findMany({
      where: eq(CommentsTable.productId, _id),
      columns: {
        id: true,
        variant: true,
        content: true,
        medias: true,
        rating: true,
        createdAt: true,
      },
      with: {
        user: {
          columns: {
            name: true,
            avatar: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Success get product comments",
      statusCode: 200,
      data,
    });
  });
}
