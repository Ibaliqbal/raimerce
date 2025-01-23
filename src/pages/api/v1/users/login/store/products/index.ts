import { db } from "@/lib/db";
import { ProductsTable, TProducts } from "@/lib/db/schema";
import { productSchema } from "@/types/product";
import { ApiResponse, secureMethods } from "@/utils/api";
import { getStoreiD } from "@/utils/db";
import { verify } from "@/utils/helper";
import { and, eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";

type Data = ApiResponse & {
  data?: Array<
    Pick<TProducts, "id" | "name" | "description" | "rating" | "variant">
  >;
};

const acceptMethod = ["POST", "GET"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, () => {
    verify(req, res, async (decode) => {
      const decoded = decode as JWT;
      const body = req.body;
      const storeID = await getStoreiD(decoded.id);
      const category = req.query.c as string;

      if (req.method === "POST") {
        const validation = productSchema.safeParse(body);

        if (!validation.success)
          return res
            .status(400)
            .json({ message: "Invalid data", statusCode: 400 });

        if (!storeID)
          return res.status(404).json({
            message: "User does not have a store, please create store first!!",
            statusCode: 404,
          });

        await db.insert(ProductsTable).values({
          storeId: storeID,
          name: validation.data.name,
          description: validation.data.description,
          category: validation.data.category,
          variant: validation.data.variant,
        });

        return res.status(201).json({
          message: "Product created successfully",
          statusCode: 201,
        });
      }

      if (category) {
        if (!storeID)
          return res.status(404).json({
            message: "User does not have a store, please create store first!!",
            statusCode: 404,
          });

        const data = await db.query.ProductsTable.findMany({
          where: and(
            eq(ProductsTable.storeId, storeID),
            eq(ProductsTable.category, category)
          ),
          columns: {
            id: true,
            name: true,
            description: true,
            rating: true,
            variant: true,
          },
          orderBy: ({ createdAt }, { desc }) => [desc(createdAt)],
        });

        return res.status(200).json({
          message: "Success",
          statusCode: 200,
          data,
        });
      }

      if (!storeID)
        return res.status(404).json({
          message: "User does not have a store, please create store first!!",
          statusCode: 404,
        });

      const data = await db.query.ProductsTable.findMany({
        where: eq(ProductsTable.storeId, storeID),
        columns: {
          id: true,
          name: true,
          description: true,
          variant: true,
          rating: true,
        },
        orderBy: ({ createdAt }, { desc }) => [desc(createdAt)],
      });

      return res.status(200).json({
        message: "Success",
        statusCode: 200,
        data,
      });
    });
  });
}
