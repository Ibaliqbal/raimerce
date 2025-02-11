import { ProductsTable, TProducts } from "@/lib/db/schema";
import { ApiResponse, secureMethods } from "@/utils/api";
import { getStoreID } from "@/utils/db";
import { verify } from "@/utils/api";
import { eq } from "drizzle-orm";
import type { NextApiResponse, NextApiRequest } from "next";
import { JWT } from "next-auth/jwt";
import { db } from "@/lib/db";

type Data = ApiResponse & {
  data?: Array<
    Pick<TProducts, "id" | "name" | "description" | "rating" | "variant">
  >;
};

const acceptMethods = ["GET"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethods, req, res, () => {
    verify(req, res, async (decode) => {
      const decoded = decode as JWT;
      const storeID = await getStoreID(decoded.id);

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
          rating: true,
          variant: true,
        },
        orderBy: ({ createdAt }, { desc }) => [desc(createdAt)],
      });

      return res.status(200).json({
        message: "Success get products store",
        statusCode: 200,
        data,
      });
    });
  });
}
