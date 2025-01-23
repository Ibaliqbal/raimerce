import { utapi } from "@/lib/uploadthing";
import { ApiResponse, secureMethods } from "@/utils/api";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = ApiResponse;

const acceptMethod = ["DELETE"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  secureMethods(acceptMethod, req, res, async () => {
    const key = req.query.key as string;

    try {
      await utapi.deleteFiles(key);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Failed to delete product file",
        statusCode: 500,
      });
    }

    return res.status(200).json({
      message: "File deleted successfully",
      statusCode: 200,
    });
  });
}
