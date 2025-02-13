import { db } from "@/lib/db";
import { ProductsTable, StoresTable, TProducts } from "@/lib/db/schema";
import { ApiResponse, secureMethods } from "@/utils/api";
import { and, eq, gte } from "drizzle-orm";
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
    const name = req.query.name as string;
    const categoryFilter = req.query.c as string;
    const ratingFilter = req.query.r as string;

    const checkAvaibleStore = await db.query.StoresTable.findFirst({
      where: eq(StoresTable.name, name),
      columns: {
        id: true,
      },
    });

    if (!checkAvaibleStore)
      return res.status(404).json({
        message: "Store not found",
        statusCode: 404,
      });

    if (!categoryFilter && !ratingFilter) {
      const data = await db.query.ProductsTable.findMany({
        where: eq(ProductsTable.storeId, checkAvaibleStore.id),
        columns: {
          id: true,
          description: true,
          name: true,
          rating: true,
          variant: true,
        },
      });

      return res.status(200).json({
        message: "Success get products store without filters",
        statusCode: 200,
        data,
      });
    }

    if (categoryFilter && !ratingFilter) {
      const data = await db.query.ProductsTable.findMany({
        where: and(
          eq(ProductsTable.storeId, checkAvaibleStore.id),
          eq(ProductsTable.category, categoryFilter)
        ),
        columns: {
          id: true,
          description: true,
          name: true,
          rating: true,
          variant: true,
        },
      });

      return res.status(200).json({
        message: "Success get products store by category",
        statusCode: 200,
        data,
      });
    }

    if (ratingFilter && !categoryFilter) {
      const data = await db.query.ProductsTable.findMany({
        where: and(
          eq(ProductsTable.storeId, checkAvaibleStore.id),
          gte(ProductsTable.rating, ratingFilter)
        ),
        columns: {
          id: true,
          description: true,
          name: true,
          rating: true,
          variant: true,
        },
      });

      return res.status(200).json({
        message: "Success get products store by rating",
        statusCode: 200,
        data,
      });
    }

    const data = await db.query.ProductsTable.findMany({
      where: and(
        eq(ProductsTable.storeId, checkAvaibleStore.id),
        eq(ProductsTable.category, categoryFilter),
        gte(ProductsTable.rating, ratingFilter)
      ),
      columns: {
        id: true,
        description: true,
        name: true,
        rating: true,
        variant: true,
      },
    });

    res.status(200).json({
      message: "Success get products store with all filters",
      statusCode: 200,
      data,
    });
  });
}
