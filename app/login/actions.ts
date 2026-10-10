"use server";

import { cookies } from "next/headers";

export async function authenticateUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validEmail = process.env.ADMIN_EMAIL || "borsfandaniel@gmail.com";

  if (email && email.trim().toLowerCase() === validEmail.trim().toLowerCase()) {
    // Setează cookie-ul de sesiune
    const cookieStore = await cookies();
    cookieStore.set("auth_token", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return { success: true };
  }

  return { success: false, error: "Email sau parolă incorectă." };
}