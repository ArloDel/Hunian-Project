import { and, desc, eq } from "drizzle-orm";
import { type NextRequest } from "next/server";

import { db } from "@/db";
import { bookings, units } from "@/db/schema";
import {
  ApiError,
  getCurrentUserRecord,
  handleApiError,
  json,
  makeBookingCode,
} from "@/lib/api";
import { createBookingSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  try {
    const { session, user } = await getCurrentUserRecord(request);
    const role = user.role;

    const filters =
      role === "owner" ? undefined : eq(bookings.userId, session.user.id);

    const records = await db.query.bookings.findMany({
      where: filters,
      with: {
        unit: true,
        user: true,
      },
      orderBy: [desc(bookings.createdAt)],
    });

    return json({ data: records });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { session } = await getCurrentUserRecord(request);
    const payload = createBookingSchema.parse(await request.json());

    const [unit] = await db
      .select()
      .from(units)
      .where(eq(units.id, payload.unitId))
      .limit(1);

    if (!unit || !unit.isPublished) {
      throw new ApiError(404, "Unit tidak ditemukan atau belum tersedia.");
    }

    if (unit.availableRooms < 1) {
      throw new ApiError(409, "Unit sedang penuh.");
    }

    const totalPrice = Number(unit.price) * payload.durationMonths;
    const id = crypto.randomUUID();

    await db.transaction(async (tx) => {
      await tx.insert(bookings).values({
        id,
        bookingCode: makeBookingCode(),
        userId: session.user.id,
        unitId: payload.unitId,
        checkInDate: new Date(payload.checkInDate),
        durationMonths: payload.durationMonths,
        totalPrice: totalPrice.toFixed(2),
        status: "pending",
        paymentStatus: payload.paymentProofUrl ? "proof_uploaded" : "unpaid",
        paymentProofUrl: payload.paymentProofUrl ?? null,
        notes: payload.notes ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await tx
        .update(units)
        .set({
          availableRooms: unit.availableRooms - 1,
          updatedAt: new Date(),
        })
        .where(and(eq(units.id, unit.id), eq(units.availableRooms, unit.availableRooms)));
    });

    const [created] = await db.query.bookings.findMany({
      where: eq(bookings.id, id),
      with: {
        unit: true,
        user: true,
      },
      limit: 1,
    });

    return json(
      {
        message: "Booking berhasil dibuat.",
        data: created,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
