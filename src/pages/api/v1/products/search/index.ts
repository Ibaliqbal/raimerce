import { db } from "@/lib/db";
import { ProductsTable, TProducts } from "@/lib/db/schema";
import { ApiResponse, secureMethods } from "@/utils/api";
import { eq, gte, ilike, or } from "drizzle-orm";
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

    if (!category && !rating) {
      const data = await db.query.ProductsTable.findMany({
        where: or(
          ilike(ProductsTable.description, `%${search}%`),
          ilike(ProductsTable.name, `%${search}%`)
        ),
        columns: {
          id: true,
          name: true,
          rating: true,
          description: true,
          variant: true,
        },
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
          ilike(ProductsTable.description, `%${search}%`),
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
          ilike(ProductsTable.description, `%${search}%`),
          ilike(ProductsTable.name, `%${search}%`),
          gte(ProductsTable.rating, parseInt(rating))
        ),
        columns: {
          id: true,
          name: true,
          rating: true,
          description: true,
          variant: true,
        },
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
        gte(ProductsTable.rating, parseInt(rating)),
        ilike(ProductsTable.description, `%${search}%`),
        ilike(ProductsTable.name, `%${search}%`)
      ),
      columns: {
        id: true,
        name: true,
        rating: true,
        description: true,
        variant: true,
      },
    });

    return res.status(200).json({
      message: "Success get all products with all filters applied",
      statusCode: 200,
      data,
    });
  });
}
