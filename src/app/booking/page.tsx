import { BookingPage } from "@/components/site/booking-page";
import { requireRoleRoute } from "@/lib/auth-guard";

export default async function Booking() {
  await requireRoleRoute("tenant", "/booking");
  return <BookingPage />;
}
