import { db } from "@/lib/db";
import {
  CartsTable,
  NotificationTable,
  OrdersTable,
  StoresTable,
  TStore,
  TUser,
  UsersTable,
} from "@/lib/db/schema";
import {
  addLocationSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from "@/types/user";
import { and, arrayContains, eq, or, sql } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";
import bcrypt from "bcrypt";
import { gettingStartedSchema } from "@/types/store";
import { ApiResponse, secureMethods, verify } from "@/utils/api";
import { mediaSchema } from "@/types/product";
import instance from "@/lib/axios/instance";

type Data = ApiResponse & {
  data?:
    | (Pick<
        TUser,
        "address" | "avatar" | "email" | "name" | "typeLogin" | "phone"
      > & {
        store: Pick<TStore, "id"> & {
          ordersCount: number;
          notificationsCount: number;
        };
        cartsCount: number;
        pendingOrdersCount: number;
        notificationsCount: number;
      })
    | null;
};

const acceptMethod = ["GET", "PUT", "POST"];
const acceptTypeUpdateProfile = [
  "update_profile",
  "change_password",
  "update_address",
  "update_avatar",
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, () => {
    verify(req, res, async (decode) => {
      const decoded = decode as JWT;
      if (req.method === "PUT") {
        const body = req.body;
        const _type = req.query._type;
        if (!acceptTypeUpdateProfile.includes(_type as string))
          return res
            .status(400)
            .json({ message: "Invalid type", statusCode: 400 });

        if (_type === "update_profile") {
          const validation = updateProfileSchema.safeParse(body);

          if (!validation.success)
            return res
              .status(400)
              .json({ message: "Invalid data", statusCode: 400, data: null });

          await db
            .update(UsersTable)
            .set({
              updatedAt: sql`NOW()`,
              name: validation.data.name,
              phone: validation.data.phone,
            })
            .where(eq(UsersTable.id, decoded.id));

          return res
            .status(200)
            .json({ message: "Success update data", statusCode: 200 });
        }

        if (_type === "update_address") {
          const validation = addLocationSchema.safeParse(body);

          if (!validation.success)
            return res
              .status(400)
              .json({ message: "Invalid data", statusCode: 400 });

          await db
            .update(UsersTable)
            .set({
              address: {
                spesific: validation.data.moreSpesific,
                district: validation.data.district,
                city: validation.data.city,
                province: validation.data.province,
              },
              updatedAt: sql`NOW()`,
            })
            .where(eq(UsersTable.id, decoded.id));

          return res.status(200).json({
            message: "Success address was updated",
            statusCode: 200,
          });
        }

        if (_type === "update_avatar") {
          const validation = mediaSchema.safeParse(body);

          if (!validation.success)
            return res.status(400).json({
              message: "Invalid data",
              statusCode: 400,
            });

          const checkHasAvatar = await db.query.UsersTable.findFirst({
            where: eq(UsersTable.id, decoded.id),
            columns: {
              avatar: true,
            },
          });

          if (
            checkHasAvatar &&
            checkHasAvatar.avatar &&
            Boolean(checkHasAvatar.avatar.keyFile)
          ) {
            await instance.delete(`/files/${checkHasAvatar.avatar.keyFile}`);
          }

          await db
            .update(UsersTable)
            .set({
              avatar: validation.data,
              updatedAt: sql`NOW()`,
            })
            .where(eq(UsersTable.id, decoded.id));

          return res.status(200).json({
            message: "Success photo profile was updated",
            statusCode: 200,
          });
        }

        const validation = resetPasswordSchema.safeParse(body);

        if (!validation.success)
          return res
            .status(400)
            .json({ message: "Invalid data", statusCode: 400, data: null });

        const password = await db.query.UsersTable.findFirst({
          where: eq(UsersTable.id, decoded.id),
          columns: {
            password: true,
          },
        });

        if (!password)
          return res
            .status(404)
            .json({ message: "User not found", statusCode: 404 });

        const confirm = await bcrypt.compare(
          validation.data.oldPassword,
          password.password as string
        );

        if (!confirm)
          return res
            .status(400)
            .json({ message: "Password is incorrect", statusCode: 400 });

        const newPassword = await bcrypt.hash(validation.data.newPassword, 12);

        await db
          .update(UsersTable)
          .set({
            updatedAt: sql`NOW()`,
            password: newPassword,
          })
          .where(eq(UsersTable.id, decoded.id));

        return res.status(200).json({
          message: "Success change password",
          statusCode: 200,
        });
      }

      if (req.method === "POST") {
        const body = req.body;
        const validation = gettingStartedSchema.safeParse(body);

        if (!validation.success)
          return res
            .status(400)
            .json({ message: "Invalid data", statusCode: 400, data: null });

        await db.insert(StoresTable).values({
          name: validation.data.name,
          description: validation.data.description,
          userId: decoded.id,
        });

        return res
          .status(201)
          .json({ message: "Success create store", statusCode: 201 });
      }

      let ordersStoreCount = 0;
      let notificationsStoreCount = 0;

      const data = await db.query.UsersTable.findFirst({
        where: eq(UsersTable.id, decoded.id),
        columns: {
          address: true,
          avatar: true,
          email: true,
          name: true,
          typeLogin: true,
          phone: true,
        },
        with: {
          store: {
            columns: {
              id: true,
            },
          },
        },
      });

      const cartsCount = await db.$count(
        CartsTable,
        eq(CartsTable.userId, decoded.id)
      );

      const pendingOrdersCount = await db.$count(
        OrdersTable,
        and(
          eq(OrdersTable.userId, decoded.id),
          eq(OrdersTable.status, "pending")
        )
      );

      const notificationsCount = await db.$count(
        NotificationTable,
        and(
          eq(NotificationTable.type, "order_client"),
          eq(NotificationTable.isRead, false),
          eq(NotificationTable.userId, decoded.id)
        )
      );

      if (!data)
        return res
          .status(404)
          .json({ message: "User not found", statusCode: 404, data: null });

      if (data.store?.id) {
        notificationsStoreCount = await db.$count(
          NotificationTable,
          and(
            or(
              eq(NotificationTable.type, "order_store"),
              eq(NotificationTable.type, "report_to_store")
            ),
            eq(NotificationTable.isRead, false),
            eq(NotificationTable.userId, decoded.id)
          )
        );
        ordersStoreCount = await db.$count(
          OrdersTable,
          and(
            arrayContains(OrdersTable.storeIds, [data.store.id]),
            eq(OrdersTable.status, "pending")
          )
        );
      }

      return res.status(200).json({
        message: "Success get data user login",
        statusCode: 200,
        data: {
          ...data,
          store: {
            id: data.store?.id,
            ordersCount: ordersStoreCount,
            notificationsCount: notificationsStoreCount,
          },
          cartsCount,
          pendingOrdersCount,
          notificationsCount,
        },
      });
    });
  });
}
