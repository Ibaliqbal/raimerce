import { db } from "@/lib/db";
import { PromoTable, TPromo } from "@/lib/db/schema";
import { ApiResponse, secureMethods } from "@/utils/api";
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = ApiResponse & {
  data?: Pick<TPromo, "code" | "amount" | "productsAllowed">;
};

const acceptMethod = ["GET"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, async () => {
    const code = req.query.code as string;
    const currentDate = new Date().getTime();

    const data = await db.query.PromoTable.findFirst({
      where: eq(PromoTable.code, code),
      columns: {
        amount: true,
        productsAllowed: true,
        code: true,
        expiredAt: true,
      },
    });

    if (!data)
      return res.status(404).json({
        message: "Promo not found",
        statusCode: 404,
      });

    if (new Date(data.expiredAt).getTime() < currentDate)
      return res.status(400).json({
        message: "Promo expired",
        statusCode: 400,
      });

    return res.status(200).json({
      message: "Success",
      statusCode: 200,
      data: {
        amount: data.amount,
        productsAllowed: data.productsAllowed,
        code: data.code,
      },
    });
  });
}
