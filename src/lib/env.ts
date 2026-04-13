import { z } from "zod";

const envSchema = z.object({
  DATABASE_HOST: z.string().min(1).default("localhost"),
  DATABASE_PORT: z.coerce.number().int().positive().default(3306),
  DATABASE_USER: z.string().min(1).default("root"),
  DATABASE_PASSWORD: z.string().default(""),
  DATABASE_NAME: z.string().min(1).default("hunian_mahmudah"),
  BETTER_AUTH_SECRET: z
    .string()
    .min(16)
    .default("replace-this-with-a-secure-better-auth-secret"),
  BETTER_AUTH_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  XENDIT_SECRET_KEY: z.string().default(""),
  XENDIT_WEBHOOK_TOKEN: z.string().default(""),
});

export type AppEnv = z.infer<typeof envSchema>;

let cachedEnv: AppEnv | null = null;

export function getEnv(): AppEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  cachedEnv = envSchema.parse(process.env);
  return cachedEnv;
}
