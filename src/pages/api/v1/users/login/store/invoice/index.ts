import { db } from "@/lib/db";
import { OrdersTable, ProductsTable, TOrder, TProducts } from "@/lib/db/schema";
import { ApiResponse, secureMethods, verify } from "@/utils/api";
import { months } from "@/utils/constant";
import { getStoreID } from "@/utils/db";
import { calculateAfterDisc } from "@/utils/helper";
import { and, arrayContains, eq, lte, gte } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";

type DataResponse = {
  month: string;
  total: number;
};

type Data = ApiResponse & {
  data?: Array<DataResponse>;
  total?: number;
};

const acceptMethod = ["GET"];

function filteredOwnProducts(
  orders: Array<Pick<TOrder, "products" | "promoCodes" | "createdAt">>,
  ownProducts: Array<Pick<TProducts, "id">>
) {
  return orders.flatMap((order) => {
    return order.products
      ?.filter((product) =>
        ownProducts.some((storeP) => storeP.id === product.productID)
      )
      .map((product) => {
        const withDisc = order.promoCodes?.find(
          (promo) => promo.appliedTo === product.productID
        );

        if (withDisc) {
          const sumWithDisc = calculateAfterDisc(
            product.quantity * (product.productVariant?.price || 0),
            withDisc.amount
          );
          return {
            ...product,
            priceAfterDisc: sumWithDisc,
            createdAt: order.createdAt,
          };
        } else {
          return {
            ...product,
            priceAfterDisc:
              product.quantity * (product.productVariant?.price || 0),
            createdAt: order.createdAt,
          };
        }
      });
  });
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, () => {
    verify(req, res, async (decode) => {
      const decoded = decode as JWT;
      const range = 3;
      const storeID = await getStoreID(decoded.id);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - range);
      const now = new Date();
      const result: Array<DataResponse> = [];

      if (!storeID)
        return res.status(404).json({
          message: "Store ID not found",
          statusCode: 404,
        });

      const productsStore = await db.query.ProductsTable.findMany({
        where: eq(ProductsTable.storeId, storeID),
        columns: {
          id: true,
        },
      });

      const allData = await db.query.OrdersTable.findMany({
        where: and(
          arrayContains(OrdersTable.storeIds, [storeID]),
          eq(OrdersTable.status, "success")
        ),
        columns: {
          products: true,
          promoCodes: true,
          createdAt: true,
        },
      });

      const data = await db.query.OrdersTable.findMany({
        where: and(
          arrayContains(OrdersTable.storeIds, [storeID]),
          eq(OrdersTable.status, "success"),
          lte(OrdersTable.createdAt, now),
          gte(OrdersTable.createdAt, threeMonthsAgo)
        ),
        columns: {
          products: true,
          promoCodes: true,
          createdAt: true,
        },
        orderBy: ({ createdAt }, { desc }) => [desc(createdAt)],
      });

      const filteredForChart = filteredOwnProducts(data, productsStore);

      const total = filteredOwnProducts(allData, productsStore).reduce(
        (acc, curr) => acc + (curr?.priceAfterDisc || 0),
        0
      );

      for (let index = 0; index <= range; index++) {
        const setMonth = new Date();
        setMonth.setMonth(setMonth.getMonth() - index);
        const filteredByMonth = filteredForChart.filter(
          (order) => order?.createdAt?.getMonth() === setMonth.getMonth()
        );
        result[index] = {
          month: months[setMonth.getMonth()],
          total:
            filteredByMonth.length > 0
              ? filteredByMonth.reduce(
                  (acc, curr) => acc + (curr?.priceAfterDisc || 0),
                  0
                )
              : 0,
        };
      }

      return res.status(200).json({
        message: "Success get store",
        statusCode: 200,
        data: result.reverse(),
        total,
      });
    });
  });
}
