import { db } from "@/lib/db";
import { ProductsTable, TProducts } from "@/lib/db/schema";
import { ApiResponse, secureMethods } from "@/utils/api";
import { getStoreID } from "@/utils/db";
import { verify } from "@/utils/api";
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";

type Data = ApiResponse & {
  data?: Array<Pick<TProducts, "name" | "soldout">>;
};

const acceptMethod = ["GET"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, async () => {
    verify(req, res, async (decode) => {
      const decoded = decode as JWT;
      const storeID = await getStoreID(decoded.id);

      if (!storeID)
        return res.status(404).json({
          message: "Store ID not found",
          statusCode: 404,
        });

      const products = await db.query.ProductsTable.findMany({
        where: eq(ProductsTable.storeId, storeID),
        columns: {
          soldout: true,
          name: true,
        },
        limit: 5,
        orderBy: ({ soldout }, { desc }) => [desc(soldout)],
      });

      return res.status(200).json({
        message: "Success",
        statusCode: 200,
        data: products,
      });
    });
  });
}
