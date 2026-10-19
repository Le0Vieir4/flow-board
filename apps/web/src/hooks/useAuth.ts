"use client";

import { useSyncExternalStore } from "react";
import type { User } from "@flow/shared";
import { getApiUrl } from "@/lib/api";
import { trpcFetch } from "@/lib/api";

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
  return () => {
    listeners.delete(fn);
  };
}

export async function refreshSession(): Promise<User | null> {
  try {
    const { result } = await trpcFetch<User>("auth.me");
    setState({ user: result, status: "authenticated" });
    return result;
  } catch {
    try {
      await trpcFetch("auth.refresh");
      const { result } = await trpcFetch<User>("auth.me");
      setState({ user: result, status: "authenticated" });
      return result;
    } catch {
      setState({ user: null, status: "anonymous" });
      return null;
    }
  }
}

let bootstrapped = false;

export function bootstrapAuth() {
  if (bootstrapped) return;
  bootstrapped = true;
  void refreshSession();
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
