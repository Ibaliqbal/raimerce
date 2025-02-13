import { db } from "@/lib/db";
import { OrdersTable, TOrder } from "@/lib/db/schema";
import { ApiResponse, secureMethods } from "@/utils/api";
import { addHours, formatDistanceStrict } from "date-fns";
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { TZDate } from "@date-fns/tz";

type Data = ApiResponse & {
  data?: Pick<
    TOrder,
    "transactionCode" | "status" | "vaNumber" | "paymentMethod"
  > & {
    timeLeft: number;
  };
};

const acceptMethod = ["GET"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, async () => {
    const id = req.query.id as string;
    let timeLeft = "";

    const data = await db.query.OrdersTable.findFirst({
      where: eq(OrdersTable.id, id),
      columns: {
        transactionCode: true,
        status: true,
        vaNumber: true,
        paymentMethod: true,
        createdAt: true,
      },
    });

    if (!data)
      return res.status(404).json({
        message: "Order not found",
        statusCode: 404,
      });

    if (data.status === "pending") {
      const now = new Date();

      const targetDate = addHours(
        new TZDate(data.createdAt as Date, "Asia/Jakarta"),
        24
      );

      timeLeft = formatDistanceStrict(targetDate, now, {
        unit: "second",
      });
    }

    return res.status(200).json({
      message: "Success",
      statusCode: 200,
      data: {
        paymentMethod: data.paymentMethod,
        status: data.status,
        vaNumber: data.vaNumber,
        transactionCode: data.transactionCode,
        timeLeft: Number(timeLeft.split(" ")[0]),
      },
    });
  });
}
