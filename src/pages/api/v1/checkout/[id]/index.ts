import { ApiResponse, secureMethods } from "@/utils/api";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = ApiResponse

const acceptMethod = ["GET"]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req,res, () => {
    const id = req.query.id;

    console.log(id)

    return res.status(200).json({
      message: "Product retrieved successfully",
      statusCode: 200,
    })
  })
}
