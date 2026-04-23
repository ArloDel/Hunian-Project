import { eq, sql } from "drizzle-orm";
import { type NextRequest } from "next/server";

import { db } from "@/db";
import { bookings, units } from "@/db/schema";
import { sendPaymentSuccessEmail } from "@/lib/booking-notifications";
import { handleApiError, json } from "@/lib/api";
import { verifyXenditWebhook } from "@/lib/xendit";

export async function POST(request: NextRequest) {
  try {
    verifyXenditWebhook(request.headers);

    const payload = (await request.json()) as {
      id?: string;
      external_id?: string;
      status?: string;
      invoice_url?: string;
    };

    const externalId = payload.external_id;
    const invoiceStatus = String(payload.status ?? "").toUpperCase();

    if (!externalId || !invoiceStatus) {
      return json({ received: true, ignored: true });
    }

    const booking = await db.query.bookings.findFirst({
      where: (table, { eq: equals }) => equals(table.paymentExternalId, externalId),
      with: {
        unit: true,
        user: true,
      },
    });

    if (!booking) {
      return json({ received: true, ignored: true });
    }

    if (invoiceStatus === "PAID" || invoiceStatus === "SETTLED") {
      const wasVerified = booking.paymentStatus === "verified";

      await db
        .update(bookings)
        .set({
          status: "confirmed",
          paymentStatus: "verified",
          paymentReference: payload.id ?? booking.paymentReference,
          paymentUrl: payload.invoice_url ?? booking.paymentUrl,
          paidAt: booking.paidAt ?? new Date(),
          verifiedAt: booking.verifiedAt ?? new Date(),
          updatedAt: new Date(),
        })
        .where(eq(bookings.id, booking.id));

      if (!wasVerified && booking.user?.email) {
        const result = await Promise.allSettled([
          sendPaymentSuccessEmail({
            booking: {
              ...booking,
              paymentStatus: "verified",
            },
            user: booking.user,
            unit: booking.unit,
          }),
        ]);

        result.forEach((entry) => {
          if (entry.status === "rejected") {
            console.error("[booking-notification] xendit payment email failed", entry.reason);
          }
        });
      }
    }

    if (invoiceStatus === "EXPIRED") {
      await db.transaction(async (tx) => {
        await tx
          .update(bookings)
          .set({
            status: booking.status === "confirmed" ? booking.status : "cancelled",
            paymentStatus: "expired",
            paymentReference: payload.id ?? booking.paymentReference,
            paymentUrl: payload.invoice_url ?? booking.paymentUrl,
            updatedAt: new Date(),
          })
          .where(eq(bookings.id, booking.id));

        if (booking.status !== "cancelled" && booking.paymentStatus !== "expired") {
          await tx
            .update(units)
            .set({
              availableRooms: sql`least(${units.availableRooms} + 1, ${units.stock})`,
              updatedAt: new Date(),
            })
            .where(eq(units.id, booking.unitId));
        }
      });
    }

    return json({ received: true });
  } catch (error) {
    return handleApiError(error);
  }
}
