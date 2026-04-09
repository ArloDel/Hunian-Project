import type {
  BookingFormState,
  BookingUnitRecord,
} from "@/components/site/booking/booking-page.types";

export function findRequestedBookingUnit(
  units: BookingUnitRecord[],
  requestedUnitId: string | null,
  requestedSlug: string | null,
) {
  return units.find(
    (unit) => unit.id === requestedUnitId || unit.slug === requestedSlug,
  );
}

export function calculateBookingTotal(
  unit: BookingUnitRecord | null,
  durationMonths: string,
) {
  if (!unit) {
    return 0;
  }

  return Number(unit.price) * Number(durationMonths || 0) + 150000;
}

export async function uploadBookingFile(
  file: File,
  kind: "ktp" | "payment-proof",
) {
  const formData = new FormData();
  formData.append("kind", kind);
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error ?? "Upload file gagal.");
  }

  return payload.data.url as string;
}

export function updateBookingFormField(
  current: BookingFormState,
  key: keyof BookingFormState,
  value: string,
): BookingFormState {
  return {
    ...current,
    [key]: value,
  };
}
