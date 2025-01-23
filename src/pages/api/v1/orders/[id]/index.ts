import { db } from "@/lib/db";
import { OrdersTable, TOrder, TUser } from "@/lib/db/schema";
import { ApiResponse, secureMethods } from "@/utils/api";
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

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
  secureMethods(acceptMethod, req, res, async () => {
    const id = req.query.id as string;
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
