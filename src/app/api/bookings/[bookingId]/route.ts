import { eq } from "drizzle-orm";
import { type NextRequest } from "next/server";

import { db } from "@/db";
import { bookings } from "@/db/schema";
import {
  ApiError,
  getCurrentUserRecord,
  handleApiError,
  json,
} from "@/lib/api";
import { updateBookingSchema } from "@/lib/validators";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ bookingId: string }> },
) {
  try {
    const { session, user } = await getCurrentUserRecord(request);
    const { bookingId } = await context.params;
    const [booking] = await db.query.bookings.findMany({
      where: eq(bookings.id, bookingId),
      with: {
        unit: true,
        user: true,
      },
      limit: 1,
    });

    if (!booking) {
      throw new ApiError(404, "Booking tidak ditemukan.");
    }

    const role = user.role;

    if (role !== "owner" && booking.userId !== session.user.id) {
      throw new ApiError(403, "Anda tidak dapat melihat booking ini.");
    }

    return json({ data: booking });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ bookingId: string }> },
) {
  try {
    const { session, user } = await getCurrentUserRecord(request);
    const { bookingId } = await context.params;
    const payload = updateBookingSchema.parse(await request.json());

    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (!booking) {
      throw new ApiError(404, "Booking tidak ditemukan.");
    }

    const role = user.role;

    if (role !== "owner" && booking.userId !== session.user.id) {
      throw new ApiError(403, "Anda tidak dapat memperbarui booking ini.");
    }

    if (role !== "owner" && (payload.status || payload.roomNumber)) {
      throw new ApiError(403, "Hanya owner yang dapat mengubah status booking.");
    }

    await db
      .update(bookings)
      .set({
        status: payload.status ?? booking.status,
        paymentMethod: payload.paymentMethod ?? booking.paymentMethod,
        paymentStatus: payload.paymentStatus ?? booking.paymentStatus,
        paymentProofUrl: payload.paymentProofUrl ?? booking.paymentProofUrl,
        paymentProvider: payload.paymentProvider ?? booking.paymentProvider,
        paymentReference: payload.paymentReference ?? booking.paymentReference,
        paymentExternalId: payload.paymentExternalId ?? booking.paymentExternalId,
        paymentUrl: payload.paymentUrl ?? booking.paymentUrl,
        notes: payload.notes ?? booking.notes,
        roomNumber: payload.roomNumber ?? booking.roomNumber,
        paidAt:
          payload.paymentStatus === "verified"
            ? booking.paidAt ?? new Date()
            : booking.paidAt,
        verifiedAt:
          payload.paymentStatus === "verified" ? new Date() : booking.verifiedAt,
        verifiedByUserId:
          role === "owner" && payload.paymentStatus === "verified"
            ? session.user.id
            : booking.verifiedByUserId,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId));

    return json({ message: "Booking berhasil diperbarui." });
  } catch (error) {
    return handleApiError(error);
  }
}
