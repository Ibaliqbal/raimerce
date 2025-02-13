import { db } from "@/lib/db";
import { PromoTable, TPromo } from "@/lib/db/schema";
import { promoSchema } from "@/types/product";
import { ApiResponse, secureMethods } from "@/utils/api";
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = ApiResponse & {
  data?: Pick<
    TPromo,
    "code" | "expiredAt" | "amount" | "productsAllowed" | "id"
  >;
};

const acceptMethod = ["GET", "PUT", "DELETE"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, async () => {
    const id = req.query.id as string;

    if (req.method === "DELETE") {
      
      await db.delete(PromoTable).where(eq(PromoTable.id, id));

      return res.status(200).json({
        message: "Promo deleted successfully",
        statusCode: 200,
      });
    }

    if (req.method === "PUT") {
      const body = req.body;
      const validation = promoSchema.safeParse({
        ...body,
        expireAt: new Date(body?.expireAt),
      });

      if (!validation.success)
        return res.status(400).json({
          message: "Invalid data",
          statusCode: 400,
        });

      await db
        .update(PromoTable)
        .set({
          code: validation.data.code,
          amount: validation.data.amount,
          productsAllowed: validation.data.allowedProducts,
          expiredAt: new Date(
            Date.UTC(
              validation.data.expireAt.getFullYear(),
              validation.data.expireAt.getMonth(),
              validation.data.expireAt.getDate(),
              23,
              59,
              59,
              999
            )
          ).toISOString(),
        })
        .where(eq(PromoTable.id, id));

      return res.status(200).json({
        message: "Promo updated successfully",
        statusCode: 200,
      });
    }

    const data = await db.query.PromoTable.findFirst({
      where: eq(PromoTable.id, id),
      columns: {
        id: true,
        code: true,
        expiredAt: true,
        productsAllowed: true,
        amount: true,
      },
    });

    if (!data)
      return res.status(403).json({
        message: "Promo not found",
        statusCode: 403,
      });

    return res.status(200).json({
      message: "Success get data promo",
      statusCode: 200,
      data,
    });
  });
}
