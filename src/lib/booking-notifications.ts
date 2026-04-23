import { getEnv } from "@/lib/env";
import { sendEmail } from "@/lib/email";

type BookingNotificationContext = {
  booking: {
    id: string;
    bookingCode: string;
    totalPrice: string | number;
    paymentMethod: "manual_transfer" | "xendit";
    paymentStatus: string;
    roomNumber?: string | null;
    checkInDate?: string | Date | null;
  };
  user: {
    name: string | null;
    email: string;
  };
  unit: {
    name: string;
    location?: string | null;
  } | null;
};

function formatCurrency(value: string | number) {
  return `Rp${Number(value).toLocaleString("id-ID")}`;
}

function formatDate(value: string | Date | null | undefined) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getBookingUrl(bookingId: string) {
  return `${getEnv().NEXT_PUBLIC_APP_URL}/booking/${bookingId}`;
}

function getOwnerBookingUrl(bookingId: string) {
  return `${getEnv().NEXT_PUBLIC_APP_URL}/owner/bookings/${bookingId}`;
}

function renderEmailLayout(title: string, sections: string[]) {
  return `
    <div style="font-family: Arial, sans-serif; background:#f6f4ee; padding:24px; color:#1f2937;">
      <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:20px; padding:32px; border:1px solid #e5e7eb;">
        <p style="margin:0 0 8px; font-size:12px; letter-spacing:0.08em; text-transform:uppercase; color:#6b7280;">
          Hunian Mahmudah
        </p>
        <h1 style="margin:0 0 16px; font-size:28px; line-height:1.2; color:#0f3b2e;">
          ${title}
        </h1>
        ${sections.join("")}
      </div>
    </div>
  `;
}

async function sendTenantEmail(
  email: string,
  subject: string,
  title: string,
  sections: string[],
) {
  return sendEmail({
    to: email,
    subject,
    html: renderEmailLayout(title, sections),
    text: sections
      .join(" ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  });
}

export async function sendBookingCreatedEmail(context: BookingNotificationContext) {
  const bookingUrl = getBookingUrl(context.booking.id);

  await sendTenantEmail(
    context.user.email,
    `Booking ${context.booking.bookingCode} berhasil dibuat`,
    "Booking berhasil dibuat",
    [
      `<p style="margin:0 0 16px; line-height:1.7;">Halo ${context.user.name ?? "Penyewa"}, booking Anda untuk <strong>${context.unit?.name ?? "hunian pilihan"}</strong> sudah tercatat.</p>`,
      `<div style="margin:0 0 16px; padding:16px; border-radius:16px; background:#f3f4f6;">
        <p style="margin:0 0 8px;"><strong>Kode booking:</strong> ${context.booking.bookingCode}</p>
        <p style="margin:0 0 8px;"><strong>Check-in:</strong> ${formatDate(context.booking.checkInDate)}</p>
        <p style="margin:0;"><strong>Total tagihan:</strong> ${formatCurrency(context.booking.totalPrice)}</p>
      </div>`,
      `<p style="margin:0 0 16px; line-height:1.7;">Silakan pantau status pembayaran dan booking Anda di halaman detail berikut:</p>`,
      `<p style="margin:0;"><a href="${bookingUrl}" style="display:inline-block; padding:12px 18px; border-radius:999px; background:#0f3b2e; color:#ffffff; text-decoration:none;">Buka detail booking</a></p>`,
    ],
  );
}

export async function sendOwnerManualBookingAlert(context: BookingNotificationContext) {
  const ownerEmail = getEnv().OWNER_NOTIFICATION_EMAIL;

  if (!ownerEmail) {
    console.warn("[email] owner notification skipped because OWNER_NOTIFICATION_EMAIL is empty.");
    return;
  }

  const ownerBookingUrl = getOwnerBookingUrl(context.booking.id);

  await sendEmail({
    to: ownerEmail,
    subject: `Booking manual baru perlu review: ${context.booking.bookingCode}`,
    html: renderEmailLayout("Booking manual baru perlu ditinjau", [
      `<p style="margin:0 0 16px; line-height:1.7;">Ada booking manual baru dari <strong>${context.user.name ?? "Penyewa"}</strong> untuk unit <strong>${context.unit?.name ?? "-"}</strong>.</p>`,
      `<div style="margin:0 0 16px; padding:16px; border-radius:16px; background:#f3f4f6;">
        <p style="margin:0 0 8px;"><strong>Kode booking:</strong> ${context.booking.bookingCode}</p>
        <p style="margin:0 0 8px;"><strong>Lokasi:</strong> ${context.unit?.location ?? "-"}</p>
        <p style="margin:0;"><strong>Total tagihan:</strong> ${formatCurrency(context.booking.totalPrice)}</p>
      </div>`,
      `<p style="margin:0;"><a href="${ownerBookingUrl}" style="display:inline-block; padding:12px 18px; border-radius:999px; background:#0f3b2e; color:#ffffff; text-decoration:none;">Buka detail owner</a></p>`,
    ]),
    text: `Booking manual baru perlu ditinjau. Kode booking: ${context.booking.bookingCode}. Buka: ${ownerBookingUrl}`,
  });
}

export async function sendBookingVerifiedEmail(context: BookingNotificationContext) {
  const bookingUrl = getBookingUrl(context.booking.id);

  await sendTenantEmail(
    context.user.email,
    `Booking ${context.booking.bookingCode} sudah diverifikasi`,
    "Booking Anda sudah diverifikasi",
    [
      `<p style="margin:0 0 16px; line-height:1.7;">Halo ${context.user.name ?? "Penyewa"}, owner sudah memverifikasi booking Anda untuk <strong>${context.unit?.name ?? "hunian pilihan"}</strong>.</p>`,
      `<div style="margin:0 0 16px; padding:16px; border-radius:16px; background:#f3f4f6;">
        <p style="margin:0 0 8px;"><strong>Kode booking:</strong> ${context.booking.bookingCode}</p>
        <p style="margin:0 0 8px;"><strong>Status pembayaran:</strong> ${context.booking.paymentStatus}</p>
        <p style="margin:0;"><strong>Nomor kamar:</strong> ${context.booking.roomNumber || "Akan diinformasikan menyusul"}</p>
      </div>`,
      `<p style="margin:0;"><a href="${bookingUrl}" style="display:inline-block; padding:12px 18px; border-radius:999px; background:#0f3b2e; color:#ffffff; text-decoration:none;">Lihat detail booking</a></p>`,
    ],
  );
}

export async function sendBookingRejectedEmail(context: BookingNotificationContext) {
  const bookingUrl = getBookingUrl(context.booking.id);

  await sendTenantEmail(
    context.user.email,
    `Bukti transfer ${context.booking.bookingCode} perlu diperbarui`,
    "Bukti transfer perlu diperbarui",
    [
      `<p style="margin:0 0 16px; line-height:1.7;">Halo ${context.user.name ?? "Penyewa"}, owner meminta Anda memperbarui bukti transfer untuk booking <strong>${context.booking.bookingCode}</strong>.</p>`,
      `<p style="margin:0 0 16px; line-height:1.7;">Silakan buka detail booking untuk melihat status terbaru dan lanjutkan proses pembayaran manual Anda.</p>`,
      `<p style="margin:0;"><a href="${bookingUrl}" style="display:inline-block; padding:12px 18px; border-radius:999px; background:#0f3b2e; color:#ffffff; text-decoration:none;">Buka detail booking</a></p>`,
    ],
  );
}

export async function sendPaymentSuccessEmail(context: BookingNotificationContext) {
  const bookingUrl = getBookingUrl(context.booking.id);

  await sendTenantEmail(
    context.user.email,
    `Pembayaran ${context.booking.bookingCode} berhasil`,
    "Pembayaran berhasil diterima",
    [
      `<p style="margin:0 0 16px; line-height:1.7;">Halo ${context.user.name ?? "Penyewa"}, pembayaran untuk booking <strong>${context.booking.bookingCode}</strong> sudah berhasil diterima.</p>`,
      `<div style="margin:0 0 16px; padding:16px; border-radius:16px; background:#f3f4f6;">
        <p style="margin:0 0 8px;"><strong>Unit:</strong> ${context.unit?.name ?? "-"}</p>
        <p style="margin:0 0 8px;"><strong>Total:</strong> ${formatCurrency(context.booking.totalPrice)}</p>
        <p style="margin:0;"><strong>Metode:</strong> ${context.booking.paymentMethod === "xendit" ? "Xendit" : "Transfer manual"}</p>
      </div>`,
      `<p style="margin:0;"><a href="${bookingUrl}" style="display:inline-block; padding:12px 18px; border-radius:999px; background:#0f3b2e; color:#ffffff; text-decoration:none;">Lihat detail booking</a></p>`,
    ],
  );
}
