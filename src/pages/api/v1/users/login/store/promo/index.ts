import { db } from "@/lib/db";
import { PromoTable, TPromo } from "@/lib/db/schema";
import { promoSchema } from "@/types/product";
import { ApiResponse, secureMethods } from "@/utils/api";
import { getStoreiD } from "@/utils/db";
import { verify } from "@/utils/helper";
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";

type Data = ApiResponse & {
  data?: Array<
    Pick<
      TPromo,
      "amount" | "code" | "id" | "uses" | "productsAllowed" | "expiredAt"
    >
  >;
};

const acceptMethods = ["GET", "POST"];

export default function hanlder(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethods, req, res, () => {
    verify(req, res, async (decode) => {
      const decoded = decode as JWT;
      const storeID = await getStoreiD(decoded.id);
      if (req.method === "POST") {
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

        if (!storeID)
          return res.status(404).json({
            message: "User does not have a store, please create store first!!",
            statusCode: 404,
          });

        const checkHasSameCodePromo = await db.query.PromoTable.findFirst({
          where: eq(PromoTable.code, validation.data.code),
        });

        if (checkHasSameCodePromo)
          return res.status(400).json({
            statusCode: 400,
            message: "Code has been used...",
          });

        const { allowedProducts, amount, code, expireAt } = validation.data;

        await db.insert(PromoTable).values({
          code,
          amount,
          productsAllowed: allowedProducts,
          expiredAt: new Date(
            Date.UTC(
              expireAt.getFullYear(),
              expireAt.getMonth(),
              expireAt.getDate(),
              23,
              59,
              59,
              999
            )
          ).toISOString(),
          ownerId: storeID,
          uses: 0,
        });

        res.status(201).json({
          message: "Promo success created",
          statusCode: 201,
        });
      }

      if (!storeID)
        return res.status(404).json({
          message: "User does not have a store, please create store first!!",
          statusCode: 404,
        });

      const data = await db.query.PromoTable.findMany({
        where: eq(PromoTable.ownerId, storeID),
        columns: {
          id: true,
          code: true,
          amount: true,
          uses: true,
          productsAllowed: true,
          expiredAt: true,
        },
      });

      return res.status(200).json({
        message: "Success get all promo store",
        statusCode: 200,
        data,
      });
    });
  });
}
