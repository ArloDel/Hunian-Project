import type { BookingRecord, BookingFormState, BookingUnitRecord } from "@/components/site/booking/booking-page.types";

export async function fetchBookingUnits() {
  const response = await fetch("/api/units");
  const payload = await response.json();
  return (payload.data ?? []) as BookingUnitRecord[];
}

export async function fetchBookingHistory() {
  const response = await fetch("/api/bookings");
  const payload = await response.json();
  return (payload.data ?? []) as BookingRecord[];
}

export async function createBooking(form: BookingFormState) {
  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      unitId: form.unitId,
      checkInDate: form.checkInDate,
      durationMonths: Number(form.durationMonths),
      paymentMethod: form.paymentMethod,
      notes: form.notes || null,
      paymentProofUrl:
        form.paymentMethod === "manual_transfer" ? form.paymentProofUrl || null : null,
    }),
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error ?? "Booking gagal diproses.");
  }

  return payload.data as BookingRecord & { bookingCode?: string };
}

export async function updateBookingUserProfile(form: BookingFormState) {
  if (!form.phoneNumber && !form.ktpImageUrl) return;

  await fetch("/api/auth/update-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phoneNumber: form.phoneNumber || undefined,
      ktpImageUrl: form.ktpImageUrl || undefined,
    }),
  }).catch(() => null);
}
