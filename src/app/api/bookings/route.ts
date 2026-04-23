import { and, desc, eq } from "drizzle-orm";
import { type NextRequest } from "next/server";

import { db } from "@/db";
import { bookings, units } from "@/db/schema";
import {
  sendBookingCreatedEmail,
  sendOwnerManualBookingAlert,
} from "@/lib/booking-notifications";
import {
  ApiError,
  getCurrentUserRecord,
  handleApiError,
  json,
  makeBookingCode,
} from "@/lib/api";
import { createBookingSchema } from "@/lib/validators";
import { createXenditInvoice, getAppBaseUrl } from "@/lib/xendit";

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

    const adminFee = payload.paymentMethod === "manual_transfer" ? 150000 : 0;
    const totalPrice = Number(unit.price) * payload.durationMonths + adminFee;
    const id = crypto.randomUUID();
    const bookingCode = makeBookingCode();
    const isXenditPayment = payload.paymentMethod === "xendit";

    await db.transaction(async (tx) => {
      await tx.insert(bookings).values({
        id,
        bookingCode,
        userId: session.user.id,
        unitId: payload.unitId,
        checkInDate: new Date(payload.checkInDate),
        durationMonths: payload.durationMonths,
        totalPrice: totalPrice.toFixed(2),
        paymentMethod: payload.paymentMethod,
        paymentProvider: isXenditPayment ? "xendit" : null,
        status: "pending",
        paymentStatus:
          payload.paymentMethod === "manual_transfer" && payload.paymentProofUrl
            ? "proof_uploaded"
            : "unpaid",
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

    if (isXenditPayment) {
      try {
        const appBaseUrl = getAppBaseUrl();
        const invoice = await createXenditInvoice({
          externalId: bookingCode,
          amount: totalPrice,
          payerEmail: session.user.email,
          description: `Pembayaran booking ${bookingCode} untuk ${unit.name}`,
          successRedirectUrl: `${appBaseUrl}/booking?payment=success&booking=${bookingCode}`,
          failureRedirectUrl: `${appBaseUrl}/booking?payment=failed&booking=${bookingCode}`,
        });

        await db
          .update(bookings)
          .set({
            paymentReference: invoice.id,
            paymentExternalId: invoice.externalId,
            paymentUrl: invoice.invoiceUrl,
            updatedAt: new Date(),
          })
          .where(eq(bookings.id, id));
      } catch (error) {
        await db.transaction(async (tx) => {
          await tx.delete(bookings).where(eq(bookings.id, id));
          await tx
            .update(units)
            .set({
              availableRooms: unit.availableRooms,
              updatedAt: new Date(),
            })
            .where(eq(units.id, unit.id));
        });

        throw error;
      }
    }

    const [created] = await db.query.bookings.findMany({
      where: eq(bookings.id, id),
      with: {
        unit: true,
        user: true,
      },
      limit: 1,
    });

    if (created?.user?.email) {
      const notificationContext = {
        booking: created,
        user: created.user,
        unit: created.unit,
      };

      const notificationTasks = [sendBookingCreatedEmail(notificationContext)];

      if (created.paymentMethod === "manual_transfer") {
        notificationTasks.push(sendOwnerManualBookingAlert(notificationContext));
      }

      const results = await Promise.allSettled(notificationTasks);

      results.forEach((result) => {
        if (result.status === "rejected") {
          console.error("[booking-notification] create booking email failed", result.reason);
        }
      });
    }

    return json(
      {
        message: isXenditPayment
          ? "Booking berhasil dibuat dan invoice Xendit sudah siap."
          : "Booking berhasil dibuat.",
        data: created,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
