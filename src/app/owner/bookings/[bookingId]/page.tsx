import { notFound } from "next/navigation";

import { OwnerBookingDetailPage } from "@/components/site/owner/owner-booking-detail-page";
import { db } from "@/db";
import { requireRoleRoute } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";

type OwnerBookingDetailRouteProps = {
  params: Promise<{
    bookingId: string;
  }>;
};

export default async function OwnerBookingDetailPageRoute({
  params,
}: OwnerBookingDetailRouteProps) {
  const { bookingId } = await params;

  await requireRoleRoute("owner", `/owner/bookings/${bookingId}`);

  const booking = await db.query.bookings.findFirst({
    where: (table, { eq }) => eq(table.id, bookingId),
    with: {
      unit: true,
      user: true,
      verifiedBy: true,
    },
  });

  if (!booking) {
    notFound();
  }

  return <OwnerBookingDetailPage booking={booking} />;
}
