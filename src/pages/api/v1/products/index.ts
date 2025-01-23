import { db } from "@/lib/db";
import { ProductsTable, TProducts } from "@/lib/db/schema";
import { ApiResponse, secureMethods } from "@/utils/api";
import { eq, gte, or } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = ApiResponse & {
  data?:
    | Array<
        Pick<TProducts, "id" | "description" | "name" | "rating" | "variant">
      >
    | number;
};

const acceptMethod = ["GET"];
const acceptTypes = ["recomendations", "all", "total"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, async () => {
    const type = req.query._type as string;

    if (!acceptTypes.includes(type))
      return res.status(400).json({
        message: "Invalid type",
        statusCode: 400,
      });

    if (type === "recomendations") {
      const limit = 12;

      // Fetch random products with rating >= 3
      const dataUpRating = await db.query.ProductsTable.findMany({
        where: gte(ProductsTable.rating, 3),
        columns: {
          id: true,
          name: true,
          rating: true,
          description: true,
          variant: true,
        },
        limit,
        orderBy: (_, { sql }) => sql`RANDOM()`,
      });

      if (dataUpRating.length >= 4) {
        return res.status(200).json({
          message: "Getting recommendations products",
          statusCode: 200,
          data: dataUpRating,
        });
      }

      // If not enough high-rated products, fetch random products from all ratings
      const dataAllRating = await db.query.ProductsTable.findMany({
        columns: {
          id: true,
          name: true,
          rating: true,
          description: true,
          variant: true,
        },
        limit,
        orderBy: (_, { sql }) => sql`RANDOM()`,
      });

      return res.status(200).json({
        message: "Getting recommendations products",
        statusCode: 200,
        data: dataAllRating,
      });
    }

    if (type === "total") {
      const data = await db.$count(ProductsTable);
      return res.status(200).json({
        message: "Success get total products",
        statusCode: 200,
        data,
      });
    }

    const category = req.query.c as string;
    const rating = req.query.r as string;
    const page = req.query.page as string;
    const limit = req.query.limit as string;

    if (isNaN(Number(page)) || isNaN(Number(limit)))
      return res.status(400).json({
        message: "Invalid page or limit",
        statusCode: 400,
      });

    if (!category && !rating) {
      const data = await db.query.ProductsTable.findMany({
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
        where: eq(ProductsTable.category, category),
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
        where: gte(ProductsTable.rating, parseInt(rating)),
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
        gte(ProductsTable.rating, parseInt(rating))
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
