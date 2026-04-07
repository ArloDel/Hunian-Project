import { eq } from "drizzle-orm";
import { type NextRequest } from "next/server";

import { db } from "@/db";
import { users } from "@/db/schema";
import {
  getCurrentUserRecord,
  handleApiError,
  json,
} from "@/lib/api";
import { updateUserProfileSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const { session } = await getCurrentUserRecord(request);
    const payload = updateUserProfileSchema.parse(await request.json());

    await db
      .update(users)
      .set({
        ...(payload.name !== undefined ? { name: payload.name } : {}),
        ...(payload.phoneNumber !== undefined
          ? { phoneNumber: payload.phoneNumber }
          : {}),
        ...(payload.ktpImageUrl !== undefined
          ? { ktpImageUrl: payload.ktpImageUrl }
          : {}),
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id));

    const [updatedUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    return json({
      message: "Profil berhasil diperbarui.",
      data: updatedUser,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
