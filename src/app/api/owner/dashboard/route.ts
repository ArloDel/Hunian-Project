import { and, desc, eq, sql } from "drizzle-orm";
import { type NextRequest } from "next/server";

import { db } from "@/db";
import { bookings, units } from "@/db/schema";
import { handleApiError, json, parseJsonList, requireRole } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, ["owner"]);

    const [unitSummary] = await db
      .select({
        totalUnits: sql<number>`count(*)`,
        emptyUnits: sql<number>`sum(case when ${units.availableRooms} > 0 then 1 else 0 end)`,
        occupancyRate: sql<number>`round(((count(*) - sum(case when ${units.availableRooms} > 0 then 1 else 0 end)) / nullif(count(*), 0)) * 100, 0)`,
      })
      .from(units);

    const [bookingSummary] = await db
      .select({
        activeTenants: sql<number>`count(distinct ${bookings.userId})`,
        monthlyRevenue: sql<string>`coalesce(sum(case when ${bookings.paymentStatus} = 'verified' then ${bookings.totalPrice} else 0 end), 0)`,
        pendingPayments: sql<number>`sum(case when ${bookings.paymentStatus} in ('proof_uploaded', 'unpaid') then 1 else 0 end)`,
        pendingBookings: sql<number>`sum(case when ${bookings.status} = 'pending' then 1 else 0 end)`,
        invoicesThisMonth: sql<number>`sum(case when month(${bookings.createdAt}) = month(current_timestamp()) and year(${bookings.createdAt}) = year(current_timestamp()) then 1 else 0 end)`,
      })
      .from(bookings);

    const latestBookings = await db.query.bookings.findMany({
      with: {
        unit: true,
        user: true,
      },
      orderBy: [desc(bookings.createdAt)],
      limit: 5,
    });

    const unitsByType = await db
      .select({
        type: units.type,
        total: sql<number>`count(*)`,
        available: sql<number>`sum(${units.availableRooms})`,
      })
      .from(units)
      .groupBy(units.type);

    const pendingPaymentItems = await db.query.bookings.findMany({
      where: and(
        eq(bookings.status, "pending"),
        eq(bookings.paymentMethod, "manual_transfer"),
      ),
      with: {
        unit: true,
        user: true,
      },
      orderBy: [desc(bookings.createdAt)],
      limit: 5,
    });

    const managedUnits = await db.query.units.findMany({
      orderBy: [desc(units.createdAt)],
      limit: 20,
    });

    return json({
      data: {
        summary: {
          activeTenants: bookingSummary?.activeTenants ?? 0,
          emptyUnits: unitSummary?.emptyUnits ?? 0,
          monthlyRevenue: bookingSummary?.monthlyRevenue ?? "0",
          pendingPayments: bookingSummary?.pendingPayments ?? 0,
          pendingBookings: bookingSummary?.pendingBookings ?? 0,
          occupancyRate: unitSummary?.occupancyRate ?? 0,
          invoicesThisMonth: bookingSummary?.invoicesThisMonth ?? 0,
          totalUnits: unitSummary?.totalUnits ?? 0,
        },
        latestBookings,
        unitsByType,
        pendingPaymentItems,
        managedUnits: managedUnits.map((unit) => ({
          ...unit,
          facilities: parseJsonList(unit.facilities),
          imageUrls: parseJsonList(unit.imageUrls),
        })),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
