import { z } from "zod";

export const resetPasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(8, { message: "Password minimun 8 char" })
    .max(20, { message: "Password miximum 20 char" }),
  newPassword: z
    .string()
    .min(8, { message: "Password minimun 8 char" })
    .max(20, { message: "Password miximum 20 char" })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Confirm password must contain at least one uppercase letter",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "Confirm password must contain at least one number",
    })
    .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
      message: "Confirm password must contain at least one special character",
    }),
});

export type TResetPasswordT = z.infer<typeof resetPasswordSchema>;

export const updateProfileSchema = z
  .object({
    name: z.string().min(5),
    email: z.string().email(),
    phone: z.string(),
  })
  .refine((data) => !isNaN(Number(data.phone)), {
    message: "Invalid phone number",
    path: ["phone"],
  });

export type UpdateProfileT = z.infer<typeof updateProfileSchema>;

export const signinSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password minimun 8 char" })
    .max(16, { message: "Password miximum 20 char" }),
});

export type SigninSchemaT = z.infer<typeof signinSchema>;

export const signupSchema = z
  .object({
    name: z.string().min(5),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Password minimun 8 char" })
      .max(16, { message: "Password miximum 20 char" })
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((val) => /[0-9]/.test(val), {
        message: "Password must contain at least one number",
      })
      .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password minimun 8 char" })
      .max(16, { message: "Password miximum 20 char" })
      .refine((val) => /[A-Z]/.test(val), {
        message: "Confirm password must contain at least one uppercase letter",
      })
      .refine((val) => /[0-9]/.test(val), {
        message: "Confirm password must contain at least one number",
      })
      .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
        message: "Confirm password must contain at least one special character",
      }),
  })
  .refine((val) => val.password === val.confirmPassword, {
    message: "Confirm password is not same as password",
    path: ["confirmPassword"],
  });

export type SignupSchemaT = z.infer<typeof signupSchema>;

export const addLocationSchema = z.object({
  moreSpesific: z.string().max(100).trim(),
  province: z.string({ required_error: "Please which one of these" }),
  city: z.string({ required_error: "Please which one of these" }),
  district: z.string({ required_error: "Please which one of these" }),
});

export type AddLocationT = z.infer<typeof addLocationSchema>;

export type Address = {
  spesific: string;
  province: string;
  city: string;
  district: string;
};
