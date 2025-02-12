import { db } from "@/lib/db";
import {
  CommentsTable,
  FollowTable,
  ProductsTable,
  TComment,
  TProducts,
  TStore,
  TUser,
} from "@/lib/db/schema";
import { ApiResponse, secureMethods } from "@/utils/api";
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = ApiResponse & {
  data?: Pick<
    TProducts,
    | "id"
    | "description"
    | "name"
    | "rating"
    | "variant"
    | "storeId"
    | "category"
  > & {
    productsCount: number;
    followersCount: number;
    store: Pick<TStore, "name" | "id"> | null;
    comments: Array<
      Pick<
        TComment,
        "content" | "createdAt" | "id" | "medias" | "rating" | "variant"
      > & {
        user: Pick<TUser, "name" | "avatar"> | null;
      }
    >;
  };
};

const acceptMethod = ["GET"];
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, async () => {
    const id = req.query.id as string;

    const data = await db.query.ProductsTable.findFirst({
      where: eq(ProductsTable.id, id),
      columns: {
        id: true,
        name: true,
        description: true,
        rating: true,
        variant: true,
        storeId: true,
        category: true,
      },
      with: {
        store: {
          columns: {
            name: true,
            id: true,
          },
        },
      },
    });

    if (!data)
      return res.status(404).json({
        message: "Product not found",
        statusCode: 404,
      });

    const productsCount = await db.$count(
      ProductsTable,
      eq(ProductsTable.storeId, data.storeId as string)
    );

    const followersCount = await db.$count(
      FollowTable,
      eq(FollowTable.storeId, data.storeId as string)
    );

    const comments = await db.query.CommentsTable.findMany({
      where: eq(CommentsTable.productId, id),
      columns: {
        id: true,
        createdAt: true,
        content: true,
        variant: true,
        rating: true,
        medias: true,
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
      message: "Welcome to our API",
      statusCode: 200,
      data: { ...data, productsCount, comments, followersCount },
    });
  });
}
