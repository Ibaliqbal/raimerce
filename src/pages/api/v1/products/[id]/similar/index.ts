import { db } from "@/lib/db";
import { ProductsTable, TProducts } from "@/lib/db/schema";
import { ApiResponse, secureMethods } from "@/utils/api";
import { and, eq, ilike, ne, or } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = ApiResponse & {
  data?: Array<
    Pick<TProducts, "id" | "description" | "name" | "rating" | "variant">
  >;
};

const acceptMethod = ["GET"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, async () => {
    const id = req.query.id as string;

    const detailProduct = await db.query.ProductsTable.findFirst({
      where: eq(ProductsTable.id, id),
      columns: {
        name: true,
        category: true,
      },
    });

    if (!detailProduct)
      return res.status(404).json({
        message: "Product not found",
        statusCode: 404,
      });

    const data = await db.query.ProductsTable.findMany({
      where: and(
        ne(ProductsTable.id, id),
        or(
          ilike(ProductsTable.name, detailProduct.name),
          eq(ProductsTable.category, detailProduct.category)
        )
      ),
      columns: {
        id: true,
        name: true,
        rating: true,
        description: true,
        variant: true,
      },
      limit: 8,
      orderBy: (_, { sql }) => sql`RANDOM()`,
    });

    return res.status(200).json({
      message: "Success",
      statusCode: 200,
      data,
    });
  });
}
