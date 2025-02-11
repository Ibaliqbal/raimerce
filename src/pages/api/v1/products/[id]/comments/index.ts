import { ApiResponse, secureMethods, verify } from "@/utils/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import {
  CommentsTable,
  NotificationTable,
  OrdersTable,
  ProductsTable,
  TComment,
} from "@/lib/db/schema";
import { commentSchema } from "@/types/comment";
import { JWT } from "next-auth/jwt";
import { templateOrderNotification } from "@/utils/helper";

type Data = ApiResponse & {
  data?: Array<
    Pick<
      TComment,
      "id" | "content" | "rating" | "createdAt" | "medias" | "variant"
    >
  >;
};

const acceptMethods = ["GET", "POST"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethods, req, res, async () => {
    const _id = req.query.id as string;

    if (req.method === "POST") {
      verify(req, res, async (decode) => {
        const decoded = decode as JWT;
        const _orderID = req.query.orderId as string;
        const body = req.body;
        const validation = commentSchema.safeParse(body);

        if (!validation.success)
          return res.status(400).json({
            message: "Invalid data",
            statusCode: 400,
          });

        const detailOrder = await db.query.OrdersTable.findFirst({
          where: eq(OrdersTable.id, _orderID),
          columns: {
            products: true,
            transactionCode: true,
          },
        });

        if (!detailOrder)
          return res.status(404).json({
            message: "Order not found",
            statusCode: 404,
          });

        const getInfoStoreAndProduct = await db.query.ProductsTable.findFirst({
          where: eq(ProductsTable.id, _id),
          columns: {
            rating: true,
            name: true,
          },
          with: {
            store: {
              with: {
                owner: {
                  columns: {
                    id: true,
                  },
                },
              },
            },
          },
        });

        if (!getInfoStoreAndProduct)
          return res.status(404).json({
            message: "Product not found",
            statusCode: 404,
          });

        const allRating = await db.query.CommentsTable.findMany({
          where: eq(CommentsTable.productId, _id),
          columns: {
            rating: true,
          },
        });

        const getSelectedVariantProductComment = detailOrder.products?.find(
          (product) => product.productID === _id
        )?.variant;

        await Promise.all([
          db.insert(CommentsTable).values({
            productId: _id,
            userId: decoded.id,
            content: validation.data.content,
            rating: validation.data.rating.toString(),
            medias: validation.data.medias,
            variant: getSelectedVariantProductComment,
          }),
          db.insert(NotificationTable).values([
            {
              userId: decoded.id,
              type: "order_client",
              content: templateOrderNotification(
                detailOrder.transactionCode,
                `${getInfoStoreAndProduct.name} - ${getSelectedVariantProductComment}`,
                "received",
                false
              ),
            },
            {
              userId: getInfoStoreAndProduct.store.owner.id,
              type: "order_store",
              content: templateOrderNotification(
                detailOrder.transactionCode,
                `${getInfoStoreAndProduct.name} - ${getSelectedVariantProductComment}`,
                "received",
                true
              ),
            },
          ]),
          db
            .update(OrdersTable)
            .set({
              updatedAt: sql`NOW()`,
              products: detailOrder.products?.map((product) => {
                if (product.productID === _id) {
                  return {
                    ...product,
                    status: "received",
                  };
                }
                return product;
              }),
            })
            .where(eq(OrdersTable.id, _orderID)),
          db
            .update(ProductsTable)
            .set({
              updatedAt: sql`NOW()`,
              rating: (
                (Number(getInfoStoreAndProduct.rating) *
                  allRating
                    .map((rating) => Number(rating.rating))
                    .reduce((acc, curr) => acc + curr, 0) +
                  validation.data.rating) /
                (allRating.length + 1)
              ).toString(),
            })
            .where(eq(ProductsTable.id, _id)),
        ]);

        return res.status(201).json({
          message: "Comment created successfully",
          statusCode: 201,
        });
      });
    }

    const productDetail = await db.query.ProductsTable.findFirst({
      where: eq(ProductsTable.id, _id),
      columns: {
        id: true,
        name: true,
        category: true,
        rating: true,
        variant: true,
      },
    });

    if (!productDetail)
      return res.status(404).json({
        message: "Product not found",
        statusCode: 404,
      });

    const data = await db.query.CommentsTable.findMany({
      where: eq(CommentsTable.productId, _id),
      columns: {
        id: true,
        variant: true,
        content: true,
        medias: true,
        rating: true,
        createdAt: true,
      },
      with: {
        user: {
          columns: {
            name: true,
            avatar: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Success get product comments",
      statusCode: 200,
      data,
    });
  });
}
