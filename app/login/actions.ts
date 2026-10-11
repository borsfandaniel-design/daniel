"use server";

import { cookies } from "next/headers";

export async function authenticateUser(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = (formData.get("password") as string)?.trim();

  const validEmail = (process.env.ADMIN_EMAIL || "borsfandaniel@gmail.com").trim().toLowerCase();
  const validPassword = process.env.ADMIN_PASSWORD;

  if (!email) {
    return { success: false, error: "Te rugăm să introduci adresa de email." };
  }

  if (email !== validEmail) {
    return { success: false, error: "Email-ul introdus nu este autorizat." };
  }

  // Dacă este configurat ADMIN_PASSWORD în .env.local, îl verificăm
  if (validPassword && password !== validPassword) {
    return { success: false, error: "Parola introdusă este incorectă." };
  }

  // Setează cookie-ul de sesiune
  const cookieStore = await cookies();
  cookieStore.set("auth_token", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 zile
    path: "/",
  });

  return { success: true };
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  return { success: true };
}