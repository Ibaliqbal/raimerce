import { ApiResponse, secureMethods } from "@/utils/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { ProductsTable, TProducts } from "@/lib/db/schema";
import { TMedia } from "@/types/product";

type Data = ApiResponse & {
  data?: Pick<TProducts, "id" | "name" | "category" | "rating" | "soldout"> & {
    medias: Array<TMedia>;
  };
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
        soldout: true,
      },
    });

    if (!productDetail)
      return res.status(404).json({
        message: "Product not found",
        statusCode: 404,
      });

    return res.status(200).json({
      message: "Success get product comments",
      statusCode: 200,
      data: {
        category: productDetail.category,
        id: productDetail.id,
        name: productDetail.name,
        rating: productDetail.rating,
        medias: productDetail.variant.flatMap((data) => data.medias),
        soldout: productDetail.soldout,
      },
    });
  });
}
