import { db } from "@/lib/db";
import { CartsTable, TCart, TProducts } from "@/lib/db/schema";
import { VariantSchemaT } from "@/types/product";
import { ApiResponse, secureMethods } from "@/utils/api";
import { verify } from "@/utils/api";
import { and, eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";

type Data = ApiResponse & {
  data?: Array<
    Pick<TCart, "variant" | "quantity" | "id" | "category"> & {
      product: Pick<TProducts, "name" | "id"> & {
        variant: VariantSchemaT | undefined;
      };
      subTotal: number;
      storeID: string;
    }
  >;
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
        where: and(
          eq(CartsTable.userId, decoded.id),
          eq(CartsTable.isCheckout, true)
        ),
        columns: {
          variant: true,
          quantity: true,
          id: true,
          category: true,
        },
        with: {
          product: {
            columns: {
              id: true,
              name: true,
              variant: true,
            },
            with: {
              store: {
                columns: {
                  id: true,
                },
              },
            },
          },
        },
      });

      const filteringVariantsProduct = data.map((cart) => ({
        variant: cart.variant,
        quantity: cart.quantity,
        id: cart.id,
        category: cart.category,
        product: {
          name: cart.product?.name ?? "",
          id: cart.product?.id ?? "",
          variant: cart.product?.variant.find(
            (variant) => variant.name_variant === cart.variant
          ),
        },
        subTotal:
          cart.quantity *
          (cart.product?.variant.find(
            (variant) => variant.name_variant === cart.variant
          )?.price ?? 0),
        storeID: cart.product?.store?.id as string,
      }));

      return res.status(200).json({
        message: "Welcome to the API!",
        statusCode: 200,
        data: filteringVariantsProduct,
      });
    });
  });
}
