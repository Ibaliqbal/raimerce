import { db } from "@/lib/db";
import { CartsTable, TCart } from "@/lib/db/schema";
import { ApiResponse, secureMethods } from "@/utils/api";
import { eq, sql } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = ApiResponse & {
  data?: Pick<TCart, "id" | "isCheckout">;
};

const acceptMethod = ["GET", "PUT"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, async () => {
    const id = req.query.id as string;

    if (req.method === "PUT") {
      const data = await db.query.CartsTable.findFirst({
        where: eq(CartsTable.id, id),
        columns: {
          isCheckout: true,
        },
      });

      if (!data)
        return res.status(404).json({
          message: "Cart not found",
          statusCode: 404,
        });

      const returnData = await db
        .update(CartsTable)
        .set({
          isCheckout: !data.isCheckout,
          updatedAt: sql`NOW()`,
        })
        .where(eq(CartsTable.id, id))
        .returning({ id: CartsTable.id, isCheckout: CartsTable.isCheckout });

      return res.status(200).json({
        message: "Success update cart",
        statusCode: 200,
        data: returnData[0],
      });
    }

    const data = await db.query.CartsTable.findFirst({
      where: eq(CartsTable.id, id),
      columns: {
        isCheckout: true,
        id: true,
      },
    });

    if (!data)
      return res.status(404).json({
        message: "Cart not found",
        statusCode: 404,
      });

    return res.status(200).json({
      message: "Success get data cart",
      statusCode: 200,
      data,
    });
  });
}
