import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

import { BookingDetailPage } from "@/components/site/booking/booking-detail-page";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { requireRoleRoute } from "@/lib/auth-guard";

export default async function BookingDetail({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  const { session } = await requireRoleRoute("tenant", `/booking/${bookingId}`);

  const [booking] = await db.query.bookings.findMany({
    where: eq(bookings.id, bookingId),
    with: {
      unit: true,
      user: true,
    },
    limit: 1,
  });

  if (!booking) {
    notFound();
  }

  if (booking.userId !== session.user.id) {
    redirect("/booking");
  }

  return <BookingDetailPage booking={booking} />;
}
