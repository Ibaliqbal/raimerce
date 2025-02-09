import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const API_LOCATION = process.env.NEXT_PUBLIC_API_LOCATION;

interface ErrorResponse {
  message: string;
  statusCode: number;
}

export type ApiResponse = {
  message: string;
  statusCode: number;
};

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
    | ErrorResponse
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

export { fetchProvincies, fetchCities, fetchDistricts, secureMethods };
