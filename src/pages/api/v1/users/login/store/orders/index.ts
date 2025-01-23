import { db } from "@/lib/db";
import {
  OrdersTable,
  ProductsTable,
  StoresTable,
  TOrder,
  TUser,
} from "@/lib/db/schema";
import { ApiResponse, secureMethods } from "@/utils/api";
import { verify } from "@/utils/helper";
import { arrayContains, eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";

type Data = ApiResponse & {
  data?: Array<
    Pick<
      TOrder,
      "id" | "products" | "status" | "transactionCode" | "promoCodes"
    > & {
      user: Pick<TUser, "address" | "name" | "email" | "phone"> | null;
    }
  >;
};

const acceptMethod = ["GET"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, () => {
    verify(req, res, async (decoded) => {
      const decode = decoded as JWT;
      const storeID = await db.query.StoresTable.findFirst({
        where: eq(StoresTable.userId, decode.id),
        columns: {
          id: true,
        },
      });

      if (!storeID)
        return res.status(404).json({
          message: "Store not found",
          statusCode: 404,
        });

      const products = await db.query.ProductsTable.findMany({
        where: eq(ProductsTable.storeId, storeID.id),
        columns: {
          id: true,
        },
      });

      const orders = await db.query.OrdersTable.findMany({
        where: arrayContains(OrdersTable.storeIds, [storeID.id]),
        columns: {
          id: true,
          products: true,
          transactionCode: true,
          status: true,
          promoCodes: true,
        },
        with: {
          user: {
            columns: {
              name: true,
              address: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy: ({ createdAt }, { desc }) => [desc(createdAt)],
      });

      return res.status(200).json({
        message: "success",
        statusCode: 200,
        data: orders.map((order) => ({
          ...order,
          products:
            order.products?.filter((product) =>
              products.some((p) => p.id === product.productID)
            ) || null,
        })),
      });
    });
  });
}
