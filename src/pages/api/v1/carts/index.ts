import { db } from "@/lib/db";
import { CartsTable, TCart, TProducts } from "@/lib/db/schema";
import { insertCartSchema } from "@/types/cart";
import { ApiResponse, secureMethods } from "@/utils/api";
import { verify } from "@/utils/helper";
import { and, eq, sql } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";

type Data = ApiResponse & {
  data?: Array<{
    storeName: string | undefined;
    storeId: string | undefined;
    carts: Array<
      Pick<TCart, "id" | "isCheckout" | "quantity" | "variant"> & {
        product: Pick<TProducts, "name" | "variant"> | null;
      }
    >;
  }>;
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
            message: "Product has been successfully added to cart",
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
          message: "Product has been successfully added to cart",
          statusCode: 201,
        });
      }

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
            with: {
              store: {
                columns: {
                  name: true,
                  id: true,
                },
              },
            },
          },
        },
        orderBy: ({ createdAt }, { desc }) => [desc(createdAt)],
      });

      const groupByStore = data.reduce(
        (
          acc: Array<{
            storeName: string | undefined;
            storeId: string | undefined;
            carts: Array<
              Pick<TCart, "id" | "isCheckout" | "quantity" | "variant"> & {
                product: Pick<TProducts, "name" | "variant"> | null;
              }
            >;
          }>,
          curr
        ) => {
          const findSame = acc.find(
            (cart) => cart.storeId === curr.product?.store?.id
          );

          if (findSame) {
            findSame.carts.push({
              id: curr.id,
              isCheckout: curr.isCheckout,
              quantity: curr.quantity,
              variant: curr.variant,
              product: {
                name: curr.product?.name || "",
                variant: curr.product?.variant || [],
              },
            });
          } else {
            acc.push({
              storeName: curr.product?.store?.name,
              storeId: curr.product?.store?.id,
              carts: [
                {
                  id: curr.id,
                  isCheckout: curr.isCheckout,
                  quantity: curr.quantity,
                  variant: curr.variant,
                  product: {
                    name: curr.product?.name || "",
                    variant: curr.product?.variant || [],
                  },
                },
              ],
            });
          }
          return acc;
        },
        []
      );

      return res.status(200).json({
        message: "Data fetched successfully",
        statusCode: 200,
        data: groupByStore,
      });
    });
  });
}
