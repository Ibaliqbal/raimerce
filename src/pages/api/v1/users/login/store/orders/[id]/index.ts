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
import { eq, sql } from "drizzle-orm";
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

const acceptMethod = ["GET", "PUT"];

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

      if (req.method === "PUT") {
        const _type = req.query.type as string;

        if (_type == "confirm_order") {
          try {
            const lastData = await db.query.OrdersTable.findFirst({
              where: eq(OrdersTable.id, _id),
              columns: {
                products: true,
              },
            });

            await db
              .update(OrdersTable)
              .set({
                updatedAt: sql`NOW()`,
                products: lastData?.products?.map((order) => {
                  const isOwned = productsStore.some(
                    (product) => product.id === order.productID
                  );
                  if (isOwned) {
                    return {
                      ...order,
                      status: "confirmed",
                    };
                  } else {
                    return order;
                  }
                }),
              })
              .where(eq(OrdersTable.id, _id));

            return res.status(200).json({
              message: "Order confirmed",
              statusCode: 200,
            });
          } catch (error) {
            console.log(error);
            return res.status(500).json({
              message: "Failed to confirm order",
              statusCode: 500,
            });
          }
        }
      }

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
