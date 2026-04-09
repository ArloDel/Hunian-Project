import type { DashboardPayload, UnitFormState } from "@/components/site/owner/owner-page.types";
import { createUnitPayload } from "@/components/site/owner/owner-page.utils";

export async function fetchOwnerDashboard() {
  const response = await fetch("/api/owner/dashboard");
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error ?? "Dashboard owner tidak dapat dimuat.");
  }

  return payload.data as DashboardPayload;
}

export async function uploadOwnerFile(
  file: File,
  kind: "unit-image" | "payment-proof" | "ktp",
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

export async function saveOwnerUnit(unitForm: UnitFormState) {
  const url = unitForm.id ? `/api/units/${unitForm.id}` : "/api/units";
  const method = unitForm.id ? "PATCH" : "POST";
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createUnitPayload(unitForm)),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error ?? "Menyimpan unit gagal.");
  }

  return result as { message?: string };
}

export async function deleteOwnerUnit(unitId: string) {
  const response = await fetch(`/api/units/${unitId}`, {
    method: "DELETE",
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error ?? "Menghapus unit gagal.");
  }

  return result as { message?: string };
}

export async function updateOwnerBooking(
  bookingId: string,
  action: "verified" | "rejected",
  roomNumber?: string | null,
) {
  const response = await fetch(`/api/bookings/${bookingId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      paymentStatus: action,
      status: action === "verified" ? "confirmed" : "pending",
      roomNumber: action === "verified" ? roomNumber?.trim() || null : null,
    }),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error ?? "Memperbarui booking gagal.");
  }

  return result as { message?: string };
}
