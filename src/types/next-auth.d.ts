import { DefaultSession } from "next-auth";
import { DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      typeLogin: "google" | "credentials" | null;
      id: string
    } & DefaultSession["user"];
    accessToken: string;
  }
  interface User extends DefaultUser {
    role: "admin" | "member";
    typeLogin: "google" | "credentials" | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: "admin" | "member";
    id: string;
    typeLogin: "google" | "credentials" | null;
  }
}
