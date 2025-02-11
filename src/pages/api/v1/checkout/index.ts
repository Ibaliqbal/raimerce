import { ApiResponse, secureMethods, verify } from "@/utils/api";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  calculateAfterDisc,
  convertDiscAmount,
  groupDiscountsByCode,
} from "@/utils/helper";
import { JWT } from "next-auth/jwt";
import { CheckoutBodyT, chekcoutBody } from "@/types/checkout";
import { db } from "@/lib/db";
import {
  CartsTable,
  OrdersTable,
  ProductsTable,
  PromoTable,
  TProducts,
  UsersTable,
  TCart,
} from "@/lib/db/schema";
import { eq, inArray, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { VariantSchemaT } from "@/types/product";
import axios from "axios";
import { fee } from "@/utils/constant";

type Data = ApiResponse & {
  data?: {
    orderID: string;
  };
};

const acceptMethod = ["POST"];
const secretKeyMidtrans = process.env.MIDTRANS_SERVER_KEY as string;

const groupCheckoutByProduct = (
  checkout: Array<
    Pick<TCart, "id" | "quantity" | "variant" | "category"> & {
      product: Pick<TProducts, "variant" | "id" | "name" | "soldout">;
    }
  >
): Array<{
  productID: string;
  sumSoldout: number;
  variant: Array<VariantSchemaT>;
}> => {
  const grouped = checkout.reduce(
    (
      acc: Array<{
        productID: string;
        sumSoldout: number;
        variant: Array<VariantSchemaT>;
      }>,
      curr
    ) => {
      const existing = acc.find((item) => item.productID === curr.product.id);

      if (existing) {
        existing.sumSoldout += curr.quantity;
        existing.variant = existing.variant.map((v) => {
          if (v.name_variant === curr.variant) {
            console.log(true);
            return {
              ...v,
              stock: v.stock - curr.quantity,
            };
          }
          return v;
        });
      } else {
        acc.push({
          productID: curr.product.id,
          sumSoldout: curr.product.soldout + curr.quantity,
          variant: curr.product.variant.map((v) => {
            if (v.name_variant === curr.variant) {
              return {
                ...v,
                stock: v.stock - curr.quantity,
              };
            }
            return v;
          }),
        });
      }

      return acc;
    },
    []
  );

  return grouped;
};

const calcuateGrossAmount = (
  carts: Array<
    Pick<TCart, "id" | "quantity" | "variant" | "category"> & {
      product: Pick<TProducts, "variant" | "id" | "name" | "soldout">;
    }
  >,
  promoCode: Pick<CheckoutBodyT, "discounts">
): number => {
  if (promoCode.discounts.length > 0) {
    const cartsAfterDisc = carts.map((cart) => {
      const findPromoByIdProduct = promoCode.discounts.find(
        (disc) => disc.appliedTo === cart.product.id
      );

      if (findPromoByIdProduct) {
        return {
          ...cart,
          product: {
            ...cart.product,
            variant: cart.product.variant.map((variant) => ({
              ...variant,
              price: calculateAfterDisc(
                variant.price,
                findPromoByIdProduct.amount
              ),
            })),
          },
        };
      }

      return cart;
    });
    return cartsAfterDisc.reduce(
      (acc, curr) =>
        acc +
        curr.quantity *
          (curr.product.variant.find(
            (variant) => variant.name_variant === curr.variant
          )?.price ?? 0),
      0
    );
  }

  return carts.reduce(
    (acc, curr) =>
      acc +
      curr.quantity *
        (curr.product.variant.find(
          (variant) => variant.name_variant === curr.variant
        )?.price ?? 0),
    0
  );
};

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
      let vaNumber = "";

      if (!success)
        return res.status(400).json({
          message: "Invalid data",
          statusCode: 400,
        });

      const detailUser = await db.query.UsersTable.findFirst({
        where: eq(UsersTable.id, decoded.id),
        columns: {
          address: true,
          phone: true,
          email: true,
          name: true,
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

      const parameter = {
        payment_type: "bank_transfer",
        transaction_details: {
          order_id: codeTransaction,
          gross_amount:
            calcuateGrossAmount(carts, {
              discounts: data.discounts,
            }) + fee,
        },
        bank_transfer: {
          bank: data.paymentMethod.toLowerCase(),
        },
        custom_expiry: {
          unit: "day",
          expiry_duration: 1,
        },
        customer_details: {
          first_name: detailUser.name,
          phone: detailUser.phone,
          email: detailUser.email,
          city: detailUser.address.city,
          address: detailUser.address.spesific,
          shipping_address: {
            first_name: detailUser.name,
            phone: detailUser.phone,
            email: detailUser.email,
            city: detailUser.address.city,
            address: detailUser.address.spesific,
          },
        },
        item_details: [
          ...carts.map((cart) => ({
            id: cart.id,
            name: `${cart.product.name} - ${cart.variant}`,
            quantity: cart.quantity,
            price:
              cart.product.variant.find(
                (variant) => variant.name_variant === cart.variant
              )?.price ?? 0,
          })),
          {
            id: "T01",
            name: "Tax",
            price: fee,
            quantity: 1,
          },
          {
            id: "P01",
            name: "Total Promo",
            price:
              data.discounts
                .map((disc) => {
                  const findItProduct = carts.find(
                    (cart) => cart.product.id === disc.appliedTo
                  );

                  if (!findItProduct) {
                    console.log(
                      `Product not found for discount applied to: ${disc.appliedTo}`
                    );
                    return 0;
                  }

                  return convertDiscAmount(
                    findItProduct.quantity *
                      (findItProduct.product.variant.find(
                        (p) => p.name_variant === findItProduct.variant
                      )?.price ?? 0),
                    disc.amount
                  );
                })
                .reduce((acc, curr) => acc + curr, 0) * -1,
            quantity: 1,
          },
        ],
      };

      try {
        const responseMidtrans = await axios.post(
          "https://api.sandbox.midtrans.com/v2/charge",
          parameter,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: basicAuth,
            },
          }
        );

        vaNumber = responseMidtrans.data.va_numbers[0].va_number;
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          message: "Failed to checkout",
          statusCode: 500,
        });
      }

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
            vaNumber,
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
