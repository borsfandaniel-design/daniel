"use server";

import { cookies } from "next/headers";

export async function authenticateUser(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase() || "";
  const password = (formData.get("password") as string)?.trim() || "";

  const validEmail = (process.env.ADMIN_EMAIL || "borsfandaniel@gmail.com").trim().toLowerCase();
  const validPassword = (process.env.ADMIN_PASSWORD || "anto123nonplay").trim();

  if (email && email !== validEmail) {
    return { success: false, error: "Email-ul introdus nu este autorizat." };
  }

  // Verificare strictă parolă: doar anto123nonplay este acceptată
  if (!password || password !== validPassword) {
    return { success: false, error: "Parolă incorectă. Introdu parola corectă." };
  }

  // Setează cookie-ul de sesiune accesibil și securizat pe orice mediu
  const cookieStore = await cookies();
  cookieStore.set("auth_token", "authenticated", {
    httpOnly: false,
    secure: false,
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