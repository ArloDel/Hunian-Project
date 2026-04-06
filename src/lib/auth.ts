import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/db";
import { authSchema } from "@/db/schema";
import { getEnv } from "@/lib/env";

export const auth = betterAuth({
  appName: "Hunian Mahmudah",
  secret: getEnv().BETTER_AUTH_SECRET,
  baseURL: getEnv().BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: authSchema,
    usePlural: false,
  }),
  plugins: [nextCookies()],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
  },
  user: {
    additionalFields: {
      phoneNumber: {
        type: "string",
        required: false,
      },
      ktpImageUrl: {
        type: "string",
        required: false,
      },
      role: {
        type: ["tenant", "owner"],
        required: false,
        defaultValue: "tenant",
        input: false,
      },
    },
  },
});
