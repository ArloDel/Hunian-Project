import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users, type UserRole } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function getServerSession() {
  const requestHeaders = await headers();

  return auth.api.getSession({
    headers: requestHeaders,
  });
}

export async function requireUserRoute(nextPath: string) {
  const session = await getServerSession();

  if (!session) {
    redirect(`/auth?mode=login&next=${encodeURIComponent(nextPath)}`);
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user) {
    redirect("/auth?mode=login");
  }

  return {
    session,
    user,
  };
}

export async function requireRoleRoute(role: UserRole, nextPath: string) {
  const result = await requireUserRoute(nextPath);

  if (result.user.role !== role) {
    redirect(role === "owner" ? "/booking" : "/owner");
  }

  return result;
}
