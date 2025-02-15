import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const API_LOCATION = process.env.NEXT_PUBLIC_API_LOCATION;

export interface ApiResponse {
  message: string;
  statusCode: number;
}

async function fetchProvincies() {
  const res = await axios.get(`${API_LOCATION}/provinces.json`);
  const result = res.data;

  return result;
}

async function fetchCities(province: string) {
  const res = await axios.get(`${API_LOCATION}/regencies/${province}.json`);
  const result = res.data.map(
    (op: { id: string; province_id: string; name: string }) => ({
      id: op.id,
      name: op.name,
    })
  );

  return result;
}

async function fetchDistricts(city: string) {
  const res = await axios.get(`${API_LOCATION}/districts/${city}.json`);
  const result = res.data.map(
    (op: { id: string; name: string; regency_id: string }) => ({
      id: op.id,
      name: op.name,
    })
  );

  return result;
}

function secureMethods<
  T extends
    | ApiResponse
    | {
        status: boolean;
        message: string;
      }
>(
  acceptMethods: string[],
  req: NextApiRequest,
  res: NextApiResponse<T>,
  next: () => void
) {
  if (!acceptMethods.includes(req.method as string))
    return res
      .status(405)
      .json({ message: "Method not allowed", statusCode: 405 } as T);

  next();
}

const verify = (
  req: NextApiRequest,
  res: NextApiResponse,
  callback: (decode: string | jwt.JwtPayload | undefined) => void
) => {
  const token = req.headers.authorization?.split(" ")[1] || "";
  if (!token)
    return res
      .status(401)
      .json({ statusCode: 401, message: "Unautorized", data: null });

  jwt.verify(token, process.env.AUTH_SECRET || "", async (_, decode) => {
    if (!decode)
      return res
        .status(403)
        .json({ statusCode: 403, message: "Access denied", data: null });

    callback(decode);
  });
};

export { fetchProvincies, fetchCities, fetchDistricts, secureMethods, verify };
