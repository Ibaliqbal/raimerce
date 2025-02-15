import { AuthOptions } from "next-auth/";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { StoresTable, UsersTable } from "./db/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const secret = process.env.AUTH_SECRET ?? "";

const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
    }),
    Credentials({
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const user = await db.query.UsersTable.findFirst({
          where: eq(UsersTable.email, email),
          columns: {
            id: true,
            password: true,
            role: true,
            typeLogin: true,
            avatar: true,
            email: true,
          },
        });

        if (!user) throw new Error("Email is not found");

        if (user.typeLogin !== "credentials") return null;

        const confirm = await bcrypt.compare(password, user.password as string);

        if (!confirm) throw new Error("Invalid password");

        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const userDb = await db.query.UsersTable.findFirst({
            where: eq(UsersTable.email, user?.email as string),
            columns: {
              id: true,
              typeLogin: true,
              role: true,
            },
          });

          // Jika pengguna sudah ada, izinkan sign in
          if (userDb) {
            user.id = userDb.id;
            user.role = userDb.role;
            user.typeLogin = userDb.typeLogin;
            return true;
          }

          // Jika pengguna baru, tambahkan ke database
          const resInsert = await db
            .insert(UsersTable)
            .values({
              email: user.email as string,
              name: user.name as string,
              typeLogin: "google",
              avatar: {
                url: (user.image as string) || "",
                keyFile: "",
                name: "",
                type: "image",
              },
            })
            .returning({
              id: UsersTable.id,
              role: UsersTable.role,
              typeLogin: UsersTable.typeLogin,
            });
          user.id = resInsert[0].id;
          user.role = resInsert[0].role;
          user.typeLogin = resInsert[0].typeLogin;
          return true; // Kembalikan true setelah menambahkan pengguna baru
        } catch (error) {
          console.error("Error during sign in:", error);
          return false; // Kembalikan false jika terjadi kesalahan
        }
      }
      return !!user; // Kembalikan true jika pengguna valid
    },
    session({ session, token }) {
      if (token) {
        session.user.typeLogin = token.typeLogin;
        session.user.id = token.id;
        session.user.role = token.role;
        const accessToken = jwt.sign(token, secret, {
          algorithm: "HS256",
        });
        session.accessToken = accessToken;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        const hasStore = await db.query.StoresTable.findFirst({
          where: eq(StoresTable.userId, user.id),
          columns: {
            id: true,
          },
        });

        if (hasStore) {
          token.userHasStore = true;
        } else {
          token.userHasStore = false;
        }

        token.id = user.id;
        token.role = user.role;
        token.typeLogin = user.typeLogin;
      }
      return token;
    },
  },
  pages: {
    signIn: "/signin",
    error: undefined,
  },
};

export { authOptions };
