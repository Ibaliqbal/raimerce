import { db } from "@/lib/db";
import { OrdersTable, TOrder } from "@/lib/db/schema";
import { ApiResponse, secureMethods } from "@/utils/api";
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = ApiResponse & {
  data?: Pick<
    TOrder,
    "transactionCode" | "status" | "vaNumber" | "paymentMethod"
  >;
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
        transactionCode: true,
        status: true,
        vaNumber: true,
        paymentMethod: true,
      },
    });

    return res.status(200).json({
      message: "Success",
      statusCode: 200,
      data,
    });
  });
}
