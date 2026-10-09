"use server";

import { redirect } from "next/navigation";

export async function authenticateUser(email: string, pass: string) {
  const validEmail = process.env.ADMIN_EMAIL || "borsfandaniel@gmail.com";

  // Verificăm emailul
  if (email.trim().toLowerCase() === validEmail.trim().toLowerCase()) {
    // Redirecționarea nativă Next.js pe Vercel direct la dashboard
    redirect("/dashboard");
  }

  return { success: false, error: "Email sau parolă incorectă." };
}