import { db } from "@/lib/db";
import { CartsTable, TCart } from "@/lib/db/schema";
import { ApiResponse, secureMethods } from "@/utils/api";
import { verify } from "@/utils/api";
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";

type Data = ApiResponse & {
  data?: Array<Pick<TCart, "id" | "isCheckout">>;
};

const acceptMethod = ["GET"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, () => {
    verify(req, res, async (decode) => {
      const decoded = decode as JWT;

      const data = await db.query.CartsTable.findMany({
        where: eq(CartsTable.userId, decoded.id),
        columns: {
          id: true,
          isCheckout: true,
        },
      });

      return res.status(200).json({
        message: "Success get all carts",
        statusCode: 200,
        data,
      });
    });
  });
}
