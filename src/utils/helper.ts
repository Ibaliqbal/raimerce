import { TCart, TOrder, TProducts } from "@/lib/db/schema";
import { CheckoutBodyT } from "@/types/checkout";
import { VariantSchemaT } from "@/types/product";
import { DiscountSchemaT } from "@/types/promo";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export function convertPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function generateRGBA(total: number): string[] {
  const rgbaColors: string[] = [];
  const usedColors: Set<string> = new Set();

  while (rgbaColors.length <= total) {
    // Menggunakan rentang 128-255 untuk warna yang lebih cerah
    const r = Math.floor(Math.random() * 128) + 128;
    const g = Math.floor(Math.random() * 128) + 128;
    const b = Math.floor(Math.random() * 128) + 128;
    // Menggunakan alpha yang lebih tinggi untuk warna yang lebih solid
    const a = (Math.random() * 0.3 + 0.7).toFixed(2);

    const rgbaColor = `rgba(${r}, ${g}, ${b}, ${a})`;

    if (!usedColors.has(rgbaColor)) {
      rgbaColors.push(rgbaColor);
      usedColors.add(rgbaColor);
    }
  }

  return rgbaColors;
}

export const verify = (
  req: NextApiRequest,
  res: NextApiResponse,
  callback: (decode: string | jwt.JwtPayload | undefined) => void
) => {
  const token = req.headers.authorization?.split(" ")[1] || "";
  if (token) {
    jwt.verify(token, process.env.AUTH_SECRET || "", async (_, decode) => {
      if (decode) {
        callback(decode);
      } else {
        return res
          .status(403)
          .json({ statusCode: 403, message: "Access denied", data: null });
      }
    });
  } else {
    return res
      .status(401)
      .json({ statusCode: 401, message: "Unautorized", data: null });
  }
};

export const randomData = <T>(data: T[], gap: number): T[] => {
  const first = ~~(Math.random() * (data.length - gap) + 1);
  const last = first + gap;
  const response = data.slice(first, last);
  return response;
};

export const calculateAfterDisc = (
  total: number,
  discPercentage: number
): number => {
  const discAmount = (total * discPercentage) / 100;
  const afterDisc = total - discAmount;
  return afterDisc;
};

export const convertDiscAmount = (
  total: number,
  discPercentage: number
): number => {
  return (total * discPercentage) / 100;
};

export const calculateProductTotal = (
  product: Pick<TCart, "variant" | "quantity" | "id" | "category"> & {
    product: Pick<TProducts, "name" | "id"> & {
      variant: VariantSchemaT | undefined;
    };
    subTotal: number;
  },
  discounts: Array<DiscountSchemaT>
) => {
  const discount = discounts.find(
    (disc) => disc.appliedTo === product.product.id
  );
  if (!discount) return product.subTotal;
  return calculateAfterDisc(product.subTotal, discount.amount);
};

export const calculateOrderSubtotal = (
  products: Array<
    Pick<TCart, "variant" | "quantity" | "id" | "category"> & {
      product: Pick<TProducts, "name" | "id"> & {
        variant: VariantSchemaT | undefined;
      };
      subTotal: number;
    }
  >,
  discounts: Array<DiscountSchemaT>
) => {
  return (
    products?.reduce(
      (acc, product) => acc + calculateProductTotal(product, discounts),
      0
    ) ?? 0
  );
};
export function calculateTotalWithPromo(
  products: Pick<TOrder, "products">,
  promos: Pick<TOrder, "promoCodes">
): number {
  const totalAfterDisc = products.products?.map((product) => {
    const { quantity, productVariant, productID } = product;
    const findRelevantPromo = promos.promoCodes?.find(
      (promo) => promo.appliedTo == productID
    )?.amount;
    const sum = quantity * (productVariant?.price || 0);
    const sumWithDisc = calculateAfterDisc(sum, findRelevantPromo || 0);

    return sumWithDisc;
  });

  return totalAfterDisc?.reduce((acc, curr) => acc + curr, 0) || 0;
}

export const groupDiscountsByCode = (discounts: Array<DiscountSchemaT>) => {
  return discounts.reduce((acc, curr) => {
    const existing = acc.find((item) => item.code === curr.code);
    if (existing) {
      existing.appliedTo.push(curr.appliedTo);
    } else {
      acc.push({
        code: curr.code,
        amount: curr.amount,
        appliedTo: [curr.appliedTo],
      });
    }
    return acc;
  }, [] as Array<{ code: string; amount: number; appliedTo: string[] }>);
};

export const groupCheckoutByProduct = (
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

export const groupOrderByProduct = (
  products: Pick<TOrder, "products">
): Array<{
  productID: string;
  sumSoldout: number;
  variant: Array<{
    name_variant: string;
    quantity: number;
  }>;
}> => {
  const grouped = products.products?.reduce(
    (
      acc: Array<{
        productID: string;
        sumSoldout: number;
        variant: Array<{
          name_variant: string;
          quantity: number;
        }>;
      }>,
      curr
    ) => {
      const existing = acc.find((item) => item.productID === curr.productID);

      if (existing) {
        existing.sumSoldout += curr.quantity;
        existing.variant.push({
          name_variant: curr.variant,
          quantity: curr.quantity,
        });
      } else {
        acc.push({
          productID: curr.productID || "",
          sumSoldout: curr.quantity,
          variant: [{ name_variant: curr.variant, quantity: curr.quantity }],
        });
      }

      return acc;
    },
    []
  );

  return grouped || [];
};

export const calcuateGrossAmount = (
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
