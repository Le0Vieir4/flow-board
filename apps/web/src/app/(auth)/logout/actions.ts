"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { trpcFetch } from "@/lib/api";

export async function logoutUser(): Promise<void> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    await trpcFetch("auth.logout", {}, { headers: { Cookie: cookieHeader } });
  } catch {
    // best effort
  }

  cookieStore.delete("fb_access");
  cookieStore.delete("fb_refresh");

  redirect("/login");
}
