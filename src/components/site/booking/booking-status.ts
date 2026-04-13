import type { BookingRecord } from "@/components/site/booking/booking-page.types";
import type { VariantProps } from "class-variance-authority";

import type { badgeVariants } from "@/components/ui/badge";

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

export function getBookingStatusLabel(status: BookingRecord["status"]) {
  switch (status) {
    case "confirmed":
      return "Terkonfirmasi";
    case "cancelled":
      return "Dibatalkan";
    case "completed":
      return "Selesai";
    default:
      return "Menunggu";
  }
}

export function getBookingStatusVariant(status: BookingRecord["status"]): BadgeVariant {
  switch (status) {
    case "confirmed":
      return "secondary";
    case "cancelled":
      return "outline";
    case "completed":
      return "accent";
    default:
      return "default";
  }
}

export function getPaymentStatusLabel(status: BookingRecord["paymentStatus"]) {
  switch (status) {
    case "verified":
      return "Sudah dibayar";
    case "proof_uploaded":
      return "Bukti diunggah";
    case "rejected":
      return "Perlu unggah ulang";
    case "expired":
      return "Tagihan kedaluwarsa";
    default:
      return "Belum dibayar";
  }
}

export function getPaymentStatusVariant(
  status: BookingRecord["paymentStatus"],
): BadgeVariant {
  switch (status) {
    case "verified":
      return "secondary";
    case "proof_uploaded":
      return "accent";
    case "rejected":
    case "expired":
      return "outline";
    default:
      return "default";
  }
}

export function getPaymentMethodLabel(method: BookingRecord["paymentMethod"]) {
  return method === "xendit" ? "Xendit" : "Transfer manual";
}

export function getPaymentMethodDescription(method: BookingRecord["paymentMethod"]) {
  return method === "xendit"
    ? "Pembayaran online melalui Xendit"
    : "Pembayaran melalui transfer manual";
}
