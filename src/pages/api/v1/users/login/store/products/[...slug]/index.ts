import { db } from "@/lib/db";
import {
  ProductsTable,
  PromoTable,
  TComment,
  TProducts,
  TPromo,
  TUser,
} from "@/lib/db/schema";
import { productSchema, TMedia } from "@/types/product";
import { ApiResponse, secureMethods } from "@/utils/api";
import { getStoreiD } from "@/utils/db";
import { verify } from "@/utils/helper";
import { arrayContains, eq, sql } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";

type Data = ApiResponse & {
  data?: Pick<
    TProducts,
    "category" | "description" | "id" | "name" | "variant"
  > & {
    promos: Array<Pick<TPromo, "code" | "id">>;
    medias: Array<TMedia>;
    comments: Array<
      Pick<
        TComment,
        "content" | "createdAt" | "id" | "medias" | "rating" | "variant"
      > & {
        user: Pick<TUser, "email" | "avatar">;
      }
    >;
  };
};

const acceptMethod = ["PUT", "DELETE", "GET"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, async () => {
    const id = req.query.slug![0];

    if (req.method === "GET") {
      const data = await db.query.ProductsTable.findFirst({
        where: eq(ProductsTable.id, id),
        columns: {
          id: true,
          name: true,
          category: true,
          variant: true,
          description: true,
        },
        with: {
          comments: {
            columns: {
              content: true,
              createdAt: true,
              id: true,
              rating: true,
              medias: true,
              variant: true,
            },
            with: {
              user: {
                columns: {
                  email: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });

      if (!data)
        return res.status(404).json({
          message: "Product not found",
          statusCode: 404,
        });

      const promos = await db.query.PromoTable.findMany({
        where: arrayContains(PromoTable.productsAllowed, [data?.id]),
        columns: {
          id: true,
          code: true,
        },
      });

      const medias = data.variant?.flatMap((media) => media.medias);

      return res.status(200).json({
        message: "Success get product",
        statusCode: 200,
        data: { ...data, promos, medias },
      });
    }

    verify(req, res, async (decode) => {
      const decoded = decode as JWT;
      const body = req.body;
      const storeID = await getStoreiD(decoded.id);
      if (req.method === "PUT") {
        const validation = productSchema.safeParse(body);

        if (!validation.success)
          return res.status(400).json({
            message: "Invalid data",
            statusCode: 400,
          });

        const product = await db.query.ProductsTable.findFirst({
          where: eq(ProductsTable.id, id),
          columns: {
            storeId: true,
          },
        });

        if (product?.storeId !== storeID)
          return res.status(403).json({
            message: "Access denied",
            statusCode: 403,
          });

        await db
          .update(ProductsTable)
          .set({
            name: validation.data.name,
            description: validation.data.description,
            variant: validation.data.variant,
            category: validation.data.category,
            updatedAt: sql`NOW()`,
          })
          .where(eq(ProductsTable.id, id));

        return res.status(200).json({
          message: "Success update product",
          statusCode: 200,
        });
      }

      const productStoreId = await db.query.ProductsTable.findFirst({
        where: eq(ProductsTable.id, id),
        columns: {
          storeId: true,
        },
      });

      if (storeID !== productStoreId?.storeId)
        return res.status(403).json({
          message: "Access denied",
          statusCode: 403,
        });

      await db.delete(ProductsTable).where(eq(ProductsTable.id, id));

      return res.status(200).json({
        message: "Success",
        statusCode: 200,
      });
    });
  });
}
