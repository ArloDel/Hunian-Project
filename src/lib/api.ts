import { createId } from "@paralleldrive/cuid2";
import { type NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users, type UserRole } from "@/db/schema";
import { auth } from "@/lib/auth";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function apiError(status: number, message: string) {
  return json({ error: message }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return apiError(error.status, error.message);
  }

  console.error(error);
  return apiError(500, "Terjadi kesalahan pada server.");
}

export async function getAuthSession(request: NextRequest) {
  return auth.api.getSession({
    headers: request.headers,
  });
}

export async function requireSession(request: NextRequest) {
  const session = await getAuthSession(request);

  if (!session) {
    throw new ApiError(401, "Silakan login terlebih dahulu.");
  }

  return session;
}

export async function getCurrentUserRecord(request: NextRequest) {
  const session = await requireSession(request);
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user) {
    throw new ApiError(404, "User tidak ditemukan.");
  }

  return { session, user };
}

export async function requireRole(request: NextRequest, roles: UserRole[]) {
  const { session, user } = await getCurrentUserRecord(request);
  const role = user.role;

  if (!role || !roles.includes(role)) {
    throw new ApiError(403, "Anda tidak memiliki akses ke endpoint ini.");
  }

  return {
    session,
    user,
  };
}

export function parseNumberParam(value: string | null) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export function parseBooleanParam(value: string | null) {
  if (value === null) {
    return undefined;
  }

  return value === "true";
}

export function parseJsonList(value: string | null | undefined) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

export function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function makeBookingCode() {
  return `HM-${createId().slice(0, 8).toUpperCase()}`;
}
