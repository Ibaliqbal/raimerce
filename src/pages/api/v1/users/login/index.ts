import { db } from "@/lib/db";
import { StoresTable, TStore, TUser, UsersTable } from "@/lib/db/schema";
import {
  addLocationSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from "@/types/user";
import { verify } from "@/utils/helper";
import { eq, sql } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "next-auth/jwt";
import bcrypt from "bcrypt";
import { gettingStartedSchema } from "@/types/store";
import { ApiResponse, secureMethods } from "@/utils/api";
import { mediaSchema } from "@/types/product";
import instance from "@/lib/axios/instance";

type Data = ApiResponse & {
  data?:
    | (Pick<
        TUser,
        "address" | "avatar" | "email" | "name" | "typeLogin" | "phone"
      > & {
        store: Pick<TStore, "id">;
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

          if (checkHasAvatar && checkHasAvatar.avatar) {
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
            message: "Success address was updated",
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

      if (!data)
        return res
          .status(404)
          .json({ message: "User not found", statusCode: 404, data: null });

      return res.status(200).json({
        message: "Success get data user login",
        statusCode: 200,
        data,
      });
    });
  });
}
