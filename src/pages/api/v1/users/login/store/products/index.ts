import { db } from "@/lib/db";
import { ProductsTable, TProducts } from "@/lib/db/schema";
import { productSchema } from "@/types/product";
import { ApiResponse, secureMethods } from "@/utils/api";
import { getStoreID } from "@/utils/db";
import { verify } from "@/utils/api";
import { and, eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";

type Data = ApiResponse & {
  data?: Array<
    Pick<TProducts, "id" | "name" | "description" | "rating" | "variant">
  >;
  totalPage?: number;
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
      const storeID = await getStoreID(decoded.id);
      const category = req.query.c as string;
      const _page = req.query.page as string;
      const _limit = req.query.limit as string;

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

      if (!storeID)
        return res.status(404).json({
          message: "User does not have a store, please create store first!!",
          statusCode: 404,
        });

      if (isNaN(Number(_page)) || isNaN(Number(_limit)))
        return res.status(400).json({
          message: "Invalid page or limit",
          statusCode: 400,
        });

      if (category) {
        const totalProducts = await db.$count(
          ProductsTable,
          and(
            eq(ProductsTable.storeId, storeID),
            eq(ProductsTable.category, category)
          )
        );
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
          limit: Number(_limit),
          offset: (Number(_page) - 1) * Number(_limit),
          orderBy: ({ createdAt }, { desc }) => [desc(createdAt)],
        });

        return res.status(200).json({
          message: "Success",
          statusCode: 200,
          data,
          totalPage: Math.ceil(totalProducts / Number(_limit)),
        });
      }

      const totalProducts = await db.$count(
        ProductsTable,
        eq(ProductsTable.storeId, storeID)
      );

      const data = await db.query.ProductsTable.findMany({
        where: eq(ProductsTable.storeId, storeID),
        columns: {
          id: true,
          name: true,
          description: true,
          variant: true,
          rating: true,
        },
        limit: Number(_limit),
        offset: (Number(_page) - 1) * Number(_limit),
        orderBy: ({ createdAt }, { desc }) => [desc(createdAt)],
      });

      return res.status(200).json({
        message: "Success",
        statusCode: 200,
        data,
        totalPage: Math.ceil(totalProducts / Number(_limit)),
      });
    });
  });
}
