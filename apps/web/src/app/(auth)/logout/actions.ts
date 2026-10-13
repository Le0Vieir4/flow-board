"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getApiUrl } from "@/lib/api";

export async function logoutUser(): Promise<void> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  await fetch(`${getApiUrl()}/auth/logout`, {
    method: "POST",
    headers: { Cookie: cookieHeader },
  }).catch(() => {});

  cookieStore.delete("fb_access");
  cookieStore.delete("fb_refresh");

  redirect("/login");
}