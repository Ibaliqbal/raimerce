// import { db } from "@/lib/db";
import { db } from "@/lib/db";
import { UsersTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { signupSchema } from "@/types/user";

type Data = {
  statusCode: number;
  message: string;
  successCraete: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const body = req.body;

    const validation = signupSchema.safeParse(body);

    if (!validation.success)
      return res.status(400).json({
        message: "Validation error",
        successCraete: false,
        statusCode: 400,
      });

    const existUser = await db.query.UsersTable.findFirst({
      where: eq(UsersTable.email, validation.data.email),
    });

    if (existUser)
      return res.status(200).json({
        message: "Email already exists",
        statusCode: 200,
        successCraete: false,
      });

    const password = await bcrypt.hash(validation.data.password, 12);

    await db.insert(UsersTable).values({
      email: validation.data.email,
      password,
      name: validation.data.name,
    });

    return res.status(201).json({
      message: "Pendaftaran berhasil. Silahkan login.",
      statusCode: 201,
      successCraete: true,
    });
  }

  res.status(405).json({
    message: "Method Not Allowed",
    statusCode: 405,
    successCraete: false,
  });
}
