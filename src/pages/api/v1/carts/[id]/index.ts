import { db } from "@/lib/db";
import { CartsTable } from "@/lib/db/schema";
import { ApiResponse, secureMethods } from "@/utils/api";
import { verify } from "@/utils/helper";
import { eq, sql } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";

type Data = ApiResponse;

const acceptMethods = ["PUT", "DELETE"];
const acceptType = ["inc", "dec"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethods, req, res, () => {
    verify(req, res, async (decode) => {
      const _type = req.query._type as string;
      const decoded = decode as JWT;
      const id = req.query.id as string;
      if (req.method === "PUT") {
        // Your logic for PUT request goes here

        if (!acceptType.includes(_type))
          return res.status(400).json({
            message: "Invalid type",
            statusCode: 400,
          });

        const detailCart = await db.query.CartsTable.findFirst({
          where: eq(CartsTable.id, id),
          columns: {
            id: true,
            quantity: true,
            isCheckout: true,
            userId: true,
          },
        });

        if (!detailCart)
          return res.status(404).json({
            message: "Cart not found",
            statusCode: 404,
          });

        if (detailCart.userId !== decoded.id)
          return res.status(403).json({
            message: "Access denied",
            statusCode: 403,
          });

        if (_type === "inc") {
          await db
            .update(CartsTable)
            .set({
              quantity: detailCart.quantity + 1,
              updatedAt: sql`NOW()`,
            })
            .where(eq(CartsTable.id, id));

          return res.status(200).json({
            message: "Success",
            statusCode: 200,
          });
        }

        await db
          .update(CartsTable)
          .set({
            quantity: detailCart.quantity - 1,
            updatedAt: sql`NOW()`,
          })
          .where(eq(CartsTable.id, id));

        return res.status(200).json({
          message: "Success",
          statusCode: 200,
        });
      }

      const detailCart = await db.query.CartsTable.findFirst({
        where: eq(CartsTable.id, id),
        columns: {
          userId: true,
        },
      });

      if (!detailCart)
        return res.status(404).json({
          message: "Cart not found",
          statusCode: 404,
        });

      if (detailCart.userId !== decoded.id)
        return res.status(403).json({
          message: "Access denied",
          statusCode: 403,
        });

      await db.delete(CartsTable).where(eq(CartsTable.id, id));

      return res.status(200).json({
        message: "Success delete product from cart",
        statusCode: 200,
      });
    });
  });
}
