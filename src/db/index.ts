import { createPool, type Pool } from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";

import { getEnv } from "@/lib/env";

import * as schema from "./schema";

declare global {
  var __hunianMahmudahMysqlPool: Pool | undefined;
}

function createMysqlPool() {
  const env = getEnv();

  return createPool({
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

export const pool =
  globalThis.__hunianMahmudahMysqlPool ?? createMysqlPool();

if (process.env.NODE_ENV !== "production") {
  globalThis.__hunianMahmudahMysqlPool = pool;
}

export const db = drizzle(pool, { schema, mode: "default" });
