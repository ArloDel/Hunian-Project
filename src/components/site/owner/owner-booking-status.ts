import { type DashboardPayload } from "@/components/site/owner/owner-page.types";

type OwnerBooking = DashboardPayload["ownerBookings"][number];

export function getOwnerBookingStatusLabel(status: OwnerBooking["status"]) {
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

export function getOwnerPaymentStatusLabel(status: OwnerBooking["paymentStatus"]) {
  switch (status) {
    case "proof_uploaded":
      return "Bukti diunggah";
    case "verified":
      return "Sudah dibayar";
    case "rejected":
      return "Perlu unggah ulang";
    case "expired":
      return "Tagihan kedaluwarsa";
    default:
      return "Belum dibayar";
  }
}

export function getOwnerPaymentMethodLabel(method: OwnerBooking["paymentMethod"]) {
  return method === "xendit" ? "Xendit" : "Transfer manual";
}

export function getOwnerPaymentMethodDescription(method: OwnerBooking["paymentMethod"]) {
  return method === "xendit"
    ? "Status pembayaran diperbarui otomatis dari gateway."
    : "Owner perlu memeriksa bukti transfer sebelum mengonfirmasi booking.";
}

export function needsManualReview(booking: OwnerBooking) {
  return (
    booking.paymentMethod === "manual_transfer" &&
    (booking.paymentStatus === "proof_uploaded" || booking.paymentStatus === "rejected") &&
    booking.status === "pending"
  );
}
