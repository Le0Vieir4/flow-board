import * as passport from "passport";
import type { Profile } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";

export interface OAuthProfile {
  provider: "google" | "github";
  providerId: string;
  email?: string;
  name?: string;
  username?: string;
  avatar?: string | null;
}

export function googleConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function githubConfigured(): boolean {
  return Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);
}

export function configurePassport() {
  if (googleConfigured()) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          callbackURL: process.env.GOOGLE_CALLBACK_URL ?? "http://localhost:4000/api/auth/google/callback",
        },
        (_accessToken, _refreshToken, profile, done) => {
          done(null, {
            provider: "google" as const,
            providerId: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
            avatar: profile.photos?.[0]?.value ?? null,
          } satisfies OAuthProfile);
        }
      )
    );
  }

  if (githubConfigured()) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID!,
          clientSecret: process.env.GITHUB_CLIENT_SECRET!,
          callbackURL: process.env.GITHUB_CALLBACK_URL ?? "http://localhost:4000/api/auth/github/callback",
        },
        (_accessToken: string, _refreshToken: string, profile: Profile, done: (err: Error | null, user: OAuthProfile) => void) => {
          done(null, {
            provider: "github" as const,
            providerId: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName || profile.username,
            username: profile.username,
            avatar: profile.photos?.[0]?.value ?? null,
          });
        }
      )
    );
  }
}
