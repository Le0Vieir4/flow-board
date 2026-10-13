import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

const connectionString = process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/flowboard";

export const pool = postgres(connectionString, { max: 10 });

export const db: PostgresJsDatabase<typeof schema> = drizzle(pool, { schema });
