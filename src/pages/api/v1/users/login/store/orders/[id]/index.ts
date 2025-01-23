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
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";

type Data = ApiResponse & {
  data?: Pick<
    TOrder,
    "status" | "createdAt" | "products" | "transactionCode" | "promoCodes"
  > & {
    user: Pick<TUser, "email" | "name" | "phone"> | null;
  };
};

const acceptMethod = ["GET"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, () => {
    verify(req, res, async (decode) => {
      const decoded = decode as JWT;
      const _id = req.query.id as string;

      const storeID = await db.query.StoresTable.findFirst({
        where: eq(StoresTable.userId, decoded.id),
        columns: {
          id: true,
        },
      });

      if (!storeID)
        return res.status(404).json({
          message: "Store not found",
          statusCode: 404,
        });

      const productsStore = await db.query.ProductsTable.findMany({
        where: eq(ProductsTable.storeId, storeID.id),
        columns: {
          id: true,
        },
      });

      const data = await db.query.OrdersTable.findFirst({
        where: eq(OrdersTable.id, _id),
        columns: {
          status: true,
          transactionCode: true,
          createdAt: true,
          products: true,
          promoCodes: true,
        },
        with: {
          user: {
            columns: {
              email: true,
              name: true,
              phone: true,
            },
          },
        },
      });

      if (!data) {
        return res.status(404).json({
          message: "Product not found",
          statusCode: 404,
        });
      }

      res.status(200).json({
        message: "Success",
        statusCode: 200,
        data: {
          ...data,
          products:
            data.products?.filter((product) =>
              productsStore.some((p) => p.id === product.productID)
            ) || null,
          promoCodes:
            data.promoCodes?.filter((promo) =>
              productsStore.some((p) => p.id === promo.appliedTo)
            ) || null,
        },
      });
    });
  });
}
