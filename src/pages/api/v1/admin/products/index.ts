import { OrdersTable, ProductsTable, TProducts } from "@/lib/db/schema";
import { ApiResponse, secureMethods } from "@/utils/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { calculateAfterDisc } from "@/utils/helper";
import { fee } from "@/utils/constant";

type Data = ApiResponse & {
  totalProducts?: number;
  data?: TProducts[];
  totalRevenue?: number;
};

const acceptMethods = ["GET"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethods, req, res, async () => {
    const _type = req.query.type as string;

    if (_type === "products_summary") {
      const totalProducts = await db.$count(ProductsTable);

      const getAllOrders = await db.query.OrdersTable.findMany({
        where: eq(OrdersTable.status, "success"),
        columns: {
          promoCodes: true,
          products: true,
        },
      });

      const totalRevenue: number = getAllOrders
        .flatMap((order) => {
          return (
            order.products?.map((product) => {
              const isUsePromo = order.promoCodes?.find(
                (promo) => promo.appliedTo === product.productID
              );

              if (isUsePromo) {
                return (
                  calculateAfterDisc(
                    product.quantity * (product.productVariant?.price || 0),
                    isUsePromo.amount
                  ) + fee
                );
              }
              return (
                product.quantity * (product.productVariant?.price || 0) + fee
              );
            }) || []
          );
        })
        .reduce((acc, curr) => acc + (curr ?? 0), 0);

      return res.status(200).json({
        message: "Success",
        statusCode: 200,
        totalProducts,
        totalRevenue,
      });
    }

    const data = await db.query.ProductsTable.findMany();

    return res.status(200).json({
      message: "Success",
      statusCode: 200,
      data,
    });
  });
}
