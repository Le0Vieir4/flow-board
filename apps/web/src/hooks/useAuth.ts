"use client";

import { useSyncExternalStore } from "react";
import type { User } from "@flow/shared";
import { getApiUrl } from "@/lib/api";

const API_URL = getApiUrl();

export type AuthStatus = "loading" | "authenticated" | "anonymous";

export interface AuthState {
  user: User | null;
  status: AuthStatus;
}

let state: AuthState = { user: null, status: "loading" };
const listeners = new Set<() => void>();

function emit() {
  for (const fn of listeners) fn();
}

function setState(next: AuthState) {
  state = next;
  emit();
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

async function request(path: string, init?: RequestInit, retry = true): Promise<Response> {
  const res = await fetch(`${API_URL}${path}`, { credentials: "include", ...init });
  if (res.status === 401 && retry && !path.startsWith("/auth/")) {
    const refreshed = await fetch(`${API_URL}/auth/refresh`, { method: "POST", credentials: "include" });
    if (refreshed.ok) return request(path, init, false);
  }
  return res;
}

let bootstrapped = false;

export function bootstrapAuth() {
  if (bootstrapped) return;
  bootstrapped = true;
  void refreshSession();
}

export async function refreshSession(): Promise<User | null> {
  try {
    const res = await request("/auth/me");
    const user = res.ok ? ((await res.json()) as User) : null;
    setState({ user, status: user ? "authenticated" : "anonymous" });
    return user;
  } catch {
    setState({ user: null, status: "anonymous" });
    return null;
  }
}

export function useAuth(): AuthState {
  return useSyncExternalStore(subscribe, () => state, () => state);
}

export function getAuthSnapshot(): AuthState {
  return state;
}

export function oauthUrl(provider: "google" | "github"): string {
  return `${API_URL}/auth/${provider}`;
}

export function clearAuth() {
  setState({ user: null, status: "anonymous" });
}