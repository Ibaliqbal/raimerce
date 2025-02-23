import axios from "axios";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

const headers = {
  Accept: "application/json",
  "Chache-control": "no-cache",
  Expires: 0,
};

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers,
  timeout: 60 * 1000,
});

instance.interceptors.request.use(
  async (request) => {
    const session = (await getSession()) as Session | null;

    if (!session) return request;

    request.headers.Authorization = `Bearer ${session.accessToken}`;
    return request;
  },
  (err) => Promise.reject(err)
);

instance.interceptors.response.use(
  (response) => response,
  (err) => Promise.reject(err)
);

export default instance;
