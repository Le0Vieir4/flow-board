import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@flow/shared";
import { getApiUrl } from "@/lib/api";

export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await fetch(`${getApiUrl()}/auth/me`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export async function requireAuth(): Promise<User> {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}