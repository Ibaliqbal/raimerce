import { db } from "@/lib/db";
import { OrdersTable, TOrder, TUser } from "@/lib/db/schema";
import { ApiResponse, secureMethods } from "@/utils/api";
import { eq, sql } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

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
  secureMethods(acceptMethod, req, res, async () => {
    const id = req.query.id as string;

    if (req.method === "PUT") {
      const _type = req.query.type as string;

      if (_type === "cancel_order") {
        try {
          await db
            .update(OrdersTable)
            .set({
              status: "canceled",
              updatedAt: sql`NOW()`,
            })
            .where(eq(OrdersTable.id, id));

          return res.status(200).json({
            message: "Order cancelled",
            statusCode: 200,
          });
        } catch (err) {
          console.log(err);
          return res.status(500).json({
            message: "Failed to cancel order",
            statusCode: 500,
          });
        }
      }
      return res.status(200).json({
        message: "Order cancelled",
        statusCode: 200,
      });
    }

    const data = await db.query.OrdersTable.findFirst({
      where: eq(OrdersTable.id, id),
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
      data,
    });
  });
}
