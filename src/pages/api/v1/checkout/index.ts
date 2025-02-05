import { ApiResponse, secureMethods } from "@/utils/api";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  groupCheckoutByProduct,
  groupDiscountsByCode,
  verify,
} from "@/utils/helper";
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
import { VariantSchemaT } from "@/types/product";
import axios from "axios";

type Data = ApiResponse & {
  data?: {
    orderID: string;
  };
};

const acceptMethod = ["POST"];
const secretKeyMidtrans = process.env.MIDTRANS_SERVER_KEY as string;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, () => {
    verify(req, res, async (decode) => {
      const decoded = decode as JWT;
      const body = req.body;
      const { data, success } = chekcoutBody.safeParse(body);
      const encodedSecretKeyMidtrans = Buffer.from(
        secretKeyMidtrans + ":"
      ).toString("base64");
      const basicAuth = `Basic ${encodedSecretKeyMidtrans}`;
      const codeTransaction = `TRX-${nanoid(10)}-${nanoid(10)}`;

      if (!success)
        return res.status(400).json({
          message: "Invalid data",
          statusCode: 400,
        });

      // const parameter = {
      //   payment_type: "bank_transfer",
      //   transaction_details: {
      //     order_id: codeTransaction,
      //     gross_amount: 40000,
      //   },
      //   bank_transfer: {
      //     bank: data.paymentMethod.toLowerCase(),
      //   },
      // };

      // const responseMidtrans = await axios.post(
      //   "https://api.sandbox.midtrans.com/v2/charge",
      //   parameter,
      //   {
      //     headers: {
      //       Accept: "application/json",
      //       "Content-Type": "application/json",
      //       Authorization: basicAuth,
      //     },
      //   }
      // );

      // console.log(responseMidtrans.data);

      // return res.status(201).json({
      //   message: "Checkout success",
      //   statusCode: 201,
      // });

      const detailUser = await db.query.UsersTable.findFirst({
        where: eq(UsersTable.id, decoded.id),
        columns: {
          address: true,
          phone: true,
        },
      });

      if (!detailUser?.address || !detailUser?.phone)
        return res.status(403).json({
          message: "Fill your address or phone number first",
          statusCode: 403,
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

      const updateProducts = async () => {
        for (const product of groupCheckoutByProduct(carts)) {
          try {
            await db
              .update(ProductsTable)
              .set({
                updatedAt: sql`NOW()`,
                soldout: product.sumSoldout,
                variant: product.variant,
              })
              .where(eq(ProductsTable.id, product?.productID as string));
          } catch (error) {
            console.error(
              `Failed to update product ${product?.productID}:`,
              error
            );
          }
        }
      };

      const updatePromo = async () => {
        for (const promo of groupDiscountsByCode(data.discounts)) {
          try {
            const usesPromo = await db.query.PromoTable.findFirst({
              where: eq(PromoTable.code, promo.code),
              columns: {
                id: true,
                uses: true,
              },
            });

            if (!usesPromo) continue;

            await db
              .update(PromoTable)
              .set({
                uses: (usesPromo.uses || 0) + 1,
              })
              .where(eq(PromoTable.id, usesPromo.id));
          } catch (error) {
            console.error(`Failed to update promo ${promo.code}:`, error);
          }
        }
      };

      const filteredVariantProduct: Array<{
        variant: string;
        category: string | null;
        quantity: number;
        productID: string | undefined;
        productName: string | undefined;
        productVariant: VariantSchemaT | undefined;
        status: "confirmed" | "recieved" | "not-confirmed";
      }> = carts.map((cart) => ({
        quantity: cart.quantity,
        variant: cart.variant,
        category: cart.category,
        productID: cart.product?.id,
        productName: cart.product?.name,
        status: "not-confirmed",
        productVariant: cart.product?.variant.find(
          (variant) => variant.name_variant === cart.variant
        ),
      }));

      const deletedCarts = async () => {
        for (const cart of data.productsID) {
          try {
            await db.delete(CartsTable).where(eq(CartsTable.id, cart));
          } catch (error) {
            console.error(`Failed to delete cart ${cart}:`, error);
          }
        }
      };

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
        deletedCarts(),
        updateProducts(),
        updatePromo(),
      ]);

      return res.status(201).json({
        message: "Checkout successfully",
        statusCode: 201,
        data: {
          orderID: orderID[0].id,
        },
      });
    });
  });
}
