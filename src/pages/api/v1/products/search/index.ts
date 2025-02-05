import { db } from "@/lib/db";
import { ProductsTable, TProducts } from "@/lib/db/schema";
import { ApiResponse, secureMethods } from "@/utils/api";
import { eq, gte, ilike, or, sql } from "drizzle-orm";
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
    const category = req.query.c as string;
    const rating = req.query.r as string;
    const search = req.query.q as string;
    const page = req.query.page as string;
    const limit = req.query.limit as string;

    if (isNaN(Number(page)) || isNaN(Number(limit)))
      return res.status(400).json({
        message: "Invalid page or limit",
        statusCode: 400,
      });

    if (!category && !rating) {
      const data = await db.query.ProductsTable.findMany({
        where: or(
          ilike(ProductsTable.name, `%${search}%`),
          sql`to_tsvector('english', ${ProductsTable.description}) @@ plainto_tsquery('english', ${search})`
        ),
        columns: {
          id: true,
          name: true,
          rating: true,
          description: true,
          variant: true,
        },
        limit: Number(limit),
        offset: (Number(page) - 1) * Number(limit),
      });

      return res.status(200).json({
        message: "Success get all products",
        statusCode: 200,
        data,
      });
    }

    if (category && !rating) {
      const data = await db.query.ProductsTable.findMany({
        where: or(
          sql`to_tsvector('english', ${ProductsTable.description}) @@ plainto_tsquery('english', ${search})`,
          ilike(ProductsTable.name, `%${category}`),
          eq(ProductsTable.category, category)
        ),
        columns: {
          id: true,
          name: true,
          rating: true,
          description: true,
          variant: true,
        },
        limit: Number(limit),
        offset: (Number(page) - 1) * Number(limit),
      });

      return res.status(200).json({
        message: "Success get all products with category filter applied",
        statusCode: 200,
        data,
      });
    }

    if (rating && !category) {
      const data = await db.query.ProductsTable.findMany({
        where: or(
          sql`to_tsvector('english', ${ProductsTable.description}) @@ plainto_tsquery('english', ${search})`,
          ilike(ProductsTable.name, `%${search}%`),
          gte(ProductsTable.rating, rating)
        ),
        columns: {
          id: true,
          name: true,
          rating: true,
          description: true,
          variant: true,
        },
        limit: Number(limit),
        offset: (Number(page) - 1) * Number(limit),
      });

      return res.status(200).json({
        message: "Success get all products with rating filter applied",
        statusCode: 200,
        data,
      });
    }

    const data = await db.query.ProductsTable.findMany({
      where: or(
        eq(ProductsTable.category, category),
        gte(ProductsTable.rating, rating),
        ilike(ProductsTable.name, `%${search}%`),
        sql`to_tsvector('english', ${ProductsTable.description}) @@ plainto_tsquery('english', ${search})`
      ),
      columns: {
        id: true,
        name: true,
        rating: true,
        description: true,
        variant: true,
      },
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
    });

    return res.status(200).json({
      message: "Success get all products with all filters applied",
      statusCode: 200,
      data,
    });
  });
}
