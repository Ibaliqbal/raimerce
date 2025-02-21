import { db } from "@/lib/db";
import { StoresTable, TNews, TStore, TUser } from "@/lib/db/schema";
import type { NextApiRequest, NextApiResponse } from "next";
import { eq, sql } from "drizzle-orm";
import { verify } from "@/utils/api";
import { JWT } from "next-auth/jwt";
import { ApiResponse, secureMethods } from "@/utils/api";
import { TMedia } from "@/types/product";
import instance from "@/lib/axios/instance";
import { getStoreID } from "@/utils/db";

type Data = ApiResponse & {
  data?:
    | (TStore & {
        owner: Pick<TUser, "id" | "name" | "email"> | null;
        news: Array<Pick<TNews, "content" | "createdAt" | "id" | "medias">>;
      })
    | null;
};

const acceptMethod = ["GET", "PUT"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, () => {
    verify(req, res, async (decode) => {
      const decoded = decode as JWT;
      const _typeUpdate = req.query._type as string;

      if (req.method === "PUT") {
        if (_typeUpdate === "update_header") {
          const data = req.body as TMedia;

          const checkHasHeader = await db.query.StoresTable.findFirst({
            where: eq(StoresTable.userId, decoded.id),
            columns: {
              headerPhoto: true,
              id: true,
            },
          });

          if (checkHasHeader && checkHasHeader.headerPhoto) {
            try {
              await Promise.all([
                instance.delete(`/files/${checkHasHeader.headerPhoto.keyFile}`),
                db
                  .update(StoresTable)
                  .set({
                    headerPhoto: data,
                    updatedAt: sql`NOW()`,
                  })
                  .where(eq(StoresTable.id, checkHasHeader.id)),
              ]);

              return res.status(200).json({
                message: "Success update header photo",
                statusCode: 200,
              });
            } catch (err) {
              console.log(err);
              return res.status(500).json({
                message: "Failed to update header photo",
                statusCode: 500,
              });
            }
          }

          await db
            .update(StoresTable)
            .set({
              updatedAt: sql`NOW()`,
              headerPhoto: data,
            })
            .where(eq(StoresTable.id, checkHasHeader?.id as string));

          return res.status(200).json({
            message: "Success update header photo",
            statusCode: 200,
          });
        }

        if (_typeUpdate === "popup") {
          const data = req.body;
          const storeID = await getStoreID(decoded.id);

          if (!storeID)
            return res.status(404).json({
              message: "Store not found",
              statusCode: 404,
            });

          await db
            .update(StoresTable)
            .set({
              popupWhatsapp: data.popupWhatsapp,
              updatedAt: sql`NOW()`,
            })
            .where(eq(StoresTable.id, storeID));

          return res.status(200).json({
            statusCode: 200,
            message: "Success update data",
          });
        }

        return res.status(200).json({
          statusCode: 200,
          message: "Success update data",
        });
      }

      const data = await db.query.StoresTable.findFirst({
        where: eq(StoresTable.userId, decoded.id),
        with: {
          owner: {
            columns: {
              name: true,
              id: true,
              email: true,
            },
          },
          news: {
            columns: {
              updatedAt: false,
              storeId: false,
            },
            orderBy: ({ createdAt }, { desc }) => [desc(createdAt)],
            limit: 3,
          },
        },
      });

      if (!data)
        return res.status(404).json({
          message: "You don't have a store",
          statusCode: 404,
        });

      return res.status(200).json({
        message: "Sucessfully get details store owner",
        statusCode: 200,
        data,
      });
    });
  });
}
