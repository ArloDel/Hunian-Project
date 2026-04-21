import Link from "next/link";
import {
  ArrowLeft,
  CalendarClock,
  CreditCard,
  FileImage,
  Home,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import {
  getOwnerBookingStatusLabel,
  getOwnerPaymentMethodDescription,
  getOwnerPaymentMethodLabel,
  getOwnerPaymentStatusLabel,
} from "@/components/site/owner/owner-booking-status";
import { formatCurrency } from "@/components/site/owner/owner-page.utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { bookings } from "@/db/schema";

type OwnerBookingDetailPageProps = {
  booking: typeof bookings.$inferSelect & {
    unit: {
      name: string;
      location: string;
      address: string | null;
      type: string;
    } | null;
    user: {
      name: string;
      email: string;
      phoneNumber: string | null;
    } | null;
    verifiedBy: {
      name: string;
    } | null;
  };
};

function formatDate(value: string | Date | null | undefined) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function OwnerBookingDetailPage({ booking }: OwnerBookingDetailPageProps) {
  const isXenditPending = booking.paymentMethod === "xendit" && booking.paymentStatus === "unpaid";

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Link
            href="/owner"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground"
          >
            <ArrowLeft className="size-4" />
            Kembali ke dashboard owner
          </Link>
          <Badge variant="secondary" className="w-fit">
            Detail Booking Owner
          </Badge>
          <h1 className="font-serif text-4xl tracking-tight">
            {booking.unit?.name ?? "Booking"} | {booking.bookingCode}
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Halaman ini merangkum detail penyewa, status pembayaran, serta hasil verifikasi yang
            sudah terjadi pada booking ini.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="accent">{getOwnerBookingStatusLabel(booking.status)}</Badge>
          <Badge variant="secondary">{getOwnerPaymentStatusLabel(booking.paymentStatus)}</Badge>
          <Badge variant="outline">{getOwnerPaymentMethodLabel(booking.paymentMethod)}</Badge>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.92fr]">
        <div className="grid gap-5">
          <Card className="rounded-[30px]">
            <CardHeader>
              <CardTitle>Ringkasan booking</CardTitle>
              <CardDescription>
                Informasi unit, jadwal masuk, durasi sewa, dan total tagihan.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] bg-muted/55 p-4">
                  <div className="mb-2 flex items-center gap-3">
                    <Home className="size-5 text-primary" />
                    <p className="font-medium">Unit</p>
                  </div>
                  <p className="text-lg font-semibold">{booking.unit?.name ?? "-"}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{booking.unit?.type ?? "-"}</p>
                </div>
                <div className="rounded-[24px] bg-muted/55 p-4">
                  <div className="mb-2 flex items-center gap-3">
                    <MapPin className="size-5 text-primary" />
                    <p className="font-medium">Lokasi</p>
                  </div>
                  <p className="text-lg font-semibold">{booking.unit?.location ?? "-"}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{booking.unit?.address ?? "-"}</p>
                </div>
              </div>

              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Check-in</span>
                  <span className="font-semibold">{formatDate(booking.checkInDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Durasi sewa</span>
                  <span className="font-semibold">{booking.durationMonths} bulan</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Metode pembayaran</span>
                  <span className="font-semibold">
                    {getOwnerPaymentMethodLabel(booking.paymentMethod)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Nomor kamar</span>
                  <span className="font-semibold">{booking.roomNumber || "-"}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-base">
                  <span>Total tagihan</span>
                  <span className="font-semibold text-primary">
                    {formatCurrency(booking.totalPrice)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[30px]">
            <CardHeader>
              <CardTitle>Detail penyewa</CardTitle>
              <CardDescription>
                Informasi tenant yang melakukan booking untuk memudahkan follow up owner.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-border bg-white/80 p-4">
                <div className="mb-2 flex items-center gap-3">
                  <Mail className="size-5 text-primary" />
                  <p className="font-medium">Kontak utama</p>
                </div>
                <p className="font-semibold">{booking.user?.name ?? "-"}</p>
                <p className="mt-1 text-sm text-muted-foreground">{booking.user?.email ?? "-"}</p>
              </div>
              <div className="rounded-[24px] border border-border bg-white/80 p-4">
                <div className="mb-2 flex items-center gap-3">
                  <Phone className="size-5 text-primary" />
                  <p className="font-medium">Nomor telepon</p>
                </div>
                <p className="font-semibold">{booking.user?.phoneNumber || "-"}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Gunakan nomor ini untuk konfirmasi kedatangan atau follow up pembayaran.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[30px]">
            <CardHeader>
              <CardTitle>Tindakan pembayaran</CardTitle>
              <CardDescription>
                Status pembayaran ditangani berbeda untuk transfer manual dan Xendit.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-[24px] border border-border bg-white/80 p-4">
                <p className="font-medium">
                  {getOwnerPaymentMethodDescription(booking.paymentMethod)}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {isXenditPending
                    ? "Invoice online ini masih aktif. Tenant masih bisa menyelesaikan checkout dari link Xendit."
                    : booking.paymentMethod === "xendit"
                      ? "Untuk pembayaran online, owner tidak perlu memverifikasi manual karena status diperbarui otomatis."
                      : "Untuk transfer manual, owner bisa memakai dashboard utama untuk memverifikasi atau menolak bukti transfer."}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {booking.paymentUrl ? (
                  <Button asChild className="flex-1">
                    <a href={booking.paymentUrl} target="_blank" rel="noreferrer">
                      <CreditCard className="size-4" />
                      Buka checkout Xendit
                    </a>
                  </Button>
                ) : null}
                {booking.paymentProofUrl ? (
                  <Button asChild variant="outline" className="flex-1">
                    <a href={booking.paymentProofUrl} target="_blank" rel="noreferrer">
                      <FileImage className="size-4" />
                      Lihat bukti transfer
                    </a>
                  </Button>
                ) : null}
              </div>

              {(booking.paymentReference || booking.paymentExternalId || booking.paymentProvider) ? (
                <div className="grid gap-3 rounded-[24px] bg-muted/60 p-4 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Provider</span>
                    <span className="font-semibold">{booking.paymentProvider || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Referensi pembayaran</span>
                    <span className="font-semibold">{booking.paymentReference || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">External ID</span>
                    <span className="font-semibold">{booking.paymentExternalId || "-"}</span>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5">
          <Card className="rounded-[30px] bg-secondary text-secondary-foreground">
            <CardHeader>
              <CardTitle className="text-xl">Timeline operasional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex gap-3 rounded-[22px] bg-white/10 p-4">
                <CalendarClock className="mt-0.5 size-5" />
                <div>
                  <p className="font-medium">Booking dibuat</p>
                  <p className="mt-1 text-white/75">{formatDate(booking.createdAt)}</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-[22px] bg-white/10 p-4">
                <Wallet className="mt-0.5 size-5" />
                <div>
                  <p className="font-medium">{getOwnerPaymentStatusLabel(booking.paymentStatus)}</p>
                  <p className="mt-1 text-white/75">
                    {booking.paidAt
                      ? `Pembayaran tercatat pada ${formatDate(booking.paidAt)}`
                      : "Belum ada pembayaran yang tercatat pada booking ini."}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 rounded-[22px] bg-white/10 p-4">
                <ShieldCheck className="mt-0.5 size-5" />
                <div>
                  <p className="font-medium">{getOwnerBookingStatusLabel(booking.status)}</p>
                  <p className="mt-1 text-white/75">
                    {booking.verifiedAt
                      ? `Diverifikasi pada ${formatDate(booking.verifiedAt)}`
                      : "Belum ada verifikasi owner yang tercatat."}
                  </p>
                  {booking.verifiedBy ? (
                    <p className="mt-1 text-white/75">Verifier: {booking.verifiedBy.name}</p>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[30px]">
            <CardHeader>
              <CardTitle>Catatan owner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="leading-6 text-muted-foreground">
                {booking.notes || "Belum ada catatan tambahan untuk booking ini."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
