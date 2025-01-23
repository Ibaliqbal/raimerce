import { ApiResponse, secureMethods } from "@/utils/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { groupDiscountsByCode, verify } from "@/utils/helper";
import { JWT } from "next-auth/jwt";
import { chekcoutBody } from "@/types/checkout";
import { db } from "@/lib/db";
import {
  CartsTable,
  OrdersTable,
  ProductsTable,
  PromoTable,
  UsersTable,
} from "@/lib/db/schema";
import { eq, inArray, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

type Data = ApiResponse & {
  data?: {
    orderID: string;
  };
};

const acceptMethod = ["POST"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, () => {
    verify(req, res, async (decode) => {
      const decoded = decode as JWT;
      const body = req.body;
      const { data, success } = chekcoutBody.safeParse(body);

      const detailUser = await db.query.UsersTable.findFirst({
        where: eq(UsersTable.id, decoded.id),
        columns: {
          address: true,
          phone: true,
        },
      });

      if (!detailUser?.address || !detailUser?.phone)
        return res.status(403).json({
          message: "Please fill your address or phone number",
          statusCode: 403,
        });

      if (!success)
        return res.status(400).json({
          message: "Invalid data",
          statusCode: 400,
        });

      const carts = await db.query.CartsTable.findMany({
        where: inArray(CartsTable.id, data.productsID),
        columns: {
          id: true,
          quantity: true,
          variant: true,
          category: true,
        },
        with: {
          product: {
            columns: {
              variant: true,
              name: true,
              id: true,
              soldout: true,
            },
          },
        },
      });
      
      const updateProducts = carts.map(async (product) => {
        await db
          .update(ProductsTable)
          .set({
            updatedAt: sql`NOW()`,
            soldout: product.product?.soldout ?? 0 + product.quantity,
            variant: product.product?.variant.map((variant) => {
              if (variant.name_variant === product.variant) {
                return {
                  ...variant,
                  stock: variant.stock - product.quantity,
                };
              } else {
                return variant;
              }
            }),
          })
          .where(eq(ProductsTable.id, product.product?.id as string));
        return;
      });
      
      const deletedCarts = data.productsID.map(async (cart) => {
        await db.delete(CartsTable).where(eq(CartsTable.id, cart));
        return;
      });

      const filteredVariantProduct = carts.map((cart) => ({
        quantity: cart.quantity,
        variant: cart.variant,
        category: cart.category,
        productID: cart.product?.id,
        productName: cart.product?.name,
        productVariant: cart.product?.variant.find(
          (variant) => variant.name_variant === cart.variant
        ),
      }));


      const updatePromo = groupDiscountsByCode(data.discounts).map(
        async (promo) => {
          const usesPromo = await db.query.PromoTable.findFirst({
            where: eq(PromoTable.code, promo.code),
            columns: {
              id: true,
              uses: true,
            },
          });

          if (!usesPromo) return;
          await db
            .update(PromoTable)
            .set({
              uses: usesPromo.uses++,
            })
            .where(eq(PromoTable.id, usesPromo.id));
          return;
        }
      );

      const codeTransaction = `TRX-${nanoid(10)}-${nanoid(10)}`;

      const [orderID] = await Promise.all([
        db
          .insert(OrdersTable)
          .values({
            userId: decoded.id,
            productsID: data.productsID,
            status: "pending",
            storeIds: data.storeIDs,
            transactionCode: codeTransaction,
            paymentMethod: data.paymentMethod,
            vaNumber: `${Math.floor(Math.random() * 1000000) + 100000}`,
            products: filteredVariantProduct,
            promoCodes: data.discounts,
          })
          .returning({ id: OrdersTable.id }),
        deletedCarts,
        updateProducts,
        updatePromo,
      ]);

      return res.status(201).json({
        message: "User created successfully",
        statusCode: 201,
        data: {
          orderID: orderID[0].id,
        },
      });
    });
  });
}
