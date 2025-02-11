import { db } from "@/lib/db";
import { CartsTable, TCart, TProducts } from "@/lib/db/schema";
import { insertCartSchema } from "@/types/cart";
import { ApiResponse, secureMethods } from "@/utils/api";
import { verify } from "@/utils/api";
import { and, eq, sql } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";

type Data = ApiResponse & {
  data?: Array<
    Pick<TCart, "id" | "isCheckout" | "quantity" | "variant"> & {
      product: Pick<TProducts, "name" | "variant"> | null;
    }
  >;
  totalPage?: number;
};

const acceptMethod = ["GET", "POST"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, () => {
    verify(req, res, async (decode) => {
      const decoded = decode as JWT;
      const body = req.body;

      if (req.method === "POST") {
        const validation = insertCartSchema.safeParse(body);

        if (!validation.success)
          return res.status(400).json({
            message: "Invalid data",
            statusCode: 400,
          });

        const checkInCart = await db.query.CartsTable.findFirst({
          where: and(
            eq(CartsTable.produtId, validation.data.productId),
            eq(CartsTable.userId, decoded.id),
            eq(CartsTable.variant, validation.data.variant)
          ),
          columns: {
            id: true,
            quantity: true,
          },
        });

        if (!checkInCart) {
          await db.insert(CartsTable).values({
            userId: decoded.id,
            produtId: validation.data.productId,
            variant: validation.data.variant,
            quantity: validation.data.quantity,
            isCheckout: false,
            category: validation.data.category,
          });

          return res.status(201).json({
            message: "Item added to cart",
            statusCode: 201,
          });
        }

        await db
          .update(CartsTable)
          .set({
            quantity: checkInCart.quantity + validation.data.quantity,
            updatedAt: sql`NOW()`,
          })
          .where(eq(CartsTable.id, checkInCart.id));

        return res.status(201).json({
          message: "Item added to cart",
          statusCode: 201,
        });
      }

      const _page = req.query.page as string;
      const _limit = req.query.limit as string;

      if (isNaN(Number(_page)) || isNaN(Number(_limit)))
        return res.status(400).json({
          message: "Invalid page or limit",
          statusCode: 400,
        });

      const totalCart = await db.$count(
        CartsTable,
        eq(CartsTable.userId, decoded.id)
      );

      const data = await db.query.CartsTable.findMany({
        where: eq(CartsTable.userId, decoded.id),
        columns: {
          id: true,
          variant: true,
          quantity: true,
          isCheckout: true,
        },
        with: {
          product: {
            columns: {
              name: true,
              variant: true,
            },
          },
        },
        limit: Number(_limit),
        offset: (Number(_page) - 1) * Number(_limit),
        orderBy: ({ createdAt }, { desc }) => [desc(createdAt)],
      });

      return res.status(200).json({
        message: "Data fetched successfully",
        statusCode: 200,
        data,
        totalPage: Math.ceil(totalCart / Number(_limit)),
      });
    });
  });
}
