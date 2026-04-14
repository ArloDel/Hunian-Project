import Link from "next/link";
import {
  ArrowLeft,
  CalendarClock,
  CreditCard,
  FileImage,
  Home,
  MapPin,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import type { BookingRecord } from "@/components/site/booking/booking-page.types";
import {
  getBookingStatusLabel,
  getBookingStatusVariant,
  getPaymentMethodDescription,
  getPaymentMethodLabel,
  getPaymentStatusLabel,
  getPaymentStatusVariant,
} from "@/components/site/booking/booking-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type BookingDetailPageProps = {
  booking: BookingRecord & {
    notes?: string | null;
    verifiedAt?: string | Date | null;
    unit: {
      name: string;
      location?: string | null;
      address?: string | null;
      type?: string | null;
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

export function BookingDetailPage({ booking }: BookingDetailPageProps) {
  const isXenditPending = booking.paymentMethod === "xendit" && booking.paymentStatus === "unpaid";

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Link href="/booking" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowLeft className="size-4" />
            Kembali ke halaman booking
          </Link>
          <Badge variant="secondary" className="w-fit">
            Detail Pembayaran
          </Badge>
          <h1 className="font-serif text-4xl tracking-tight">
            {booking.unit?.name ?? "Booking"} - {booking.bookingCode}
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Halaman ini merangkum status booking, metode pembayaran, dan tindakan berikutnya untuk
            hunian yang sudah Anda pesan.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant={getBookingStatusVariant(booking.status)}>
            {getBookingStatusLabel(booking.status)}
          </Badge>
          <Badge variant={getPaymentStatusVariant(booking.paymentStatus)}>
            {getPaymentStatusLabel(booking.paymentStatus)}
          </Badge>
          <Badge variant="outline">{getPaymentMethodLabel(booking.paymentMethod)}</Badge>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="grid gap-5">
          <Card className="rounded-[30px]">
            <CardHeader>
              <CardTitle>Ringkasan booking</CardTitle>
              <CardDescription>
                Detail unit, tanggal masuk, durasi, dan total tagihan Anda.
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
                  <p className="mt-1 text-sm text-muted-foreground">{booking.unit?.type ?? "Hunian"}</p>
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
                  <span className="text-muted-foreground">Tanggal check-in</span>
                  <span className="font-semibold">{formatDate(booking.checkInDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Durasi sewa</span>
                  <span className="font-semibold">{booking.durationMonths} bulan</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Metode pembayaran</span>
                  <span className="font-semibold">{getPaymentMethodLabel(booking.paymentMethod)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-base">
                  <span>Total tagihan</span>
                  <span className="font-semibold text-primary">
                    Rp{Number(booking.totalPrice).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[30px]">
            <CardHeader>
              <CardTitle>Tindakan pembayaran</CardTitle>
              <CardDescription>
                Langkah berikutnya menyesuaikan metode dan status pembayaran saat ini.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-[24px] border border-border bg-white/80 p-4">
                <p className="font-medium">{getPaymentMethodDescription(booking.paymentMethod)}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {isXenditPending
                    ? "Invoice online Anda masih aktif. Lanjutkan checkout untuk menyelesaikan pembayaran."
                    : booking.paymentMethod === "xendit"
                      ? "Pembayaran online Anda akan atau sudah diproses melalui Xendit."
                      : "Jika sudah transfer, owner akan memeriksa bukti pembayaran Anda dari dashboard."}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {isXenditPending && booking.paymentUrl ? (
                  <Button asChild className="flex-1">
                    <a href={booking.paymentUrl} target="_blank" rel="noreferrer">
                      <CreditCard className="size-4" />
                      Lanjutkan Checkout Xendit
                    </a>
                  </Button>
                ) : null}
                {booking.paymentProofUrl ? (
                  <Button asChild variant="outline" className="flex-1">
                    <a href={booking.paymentProofUrl} target="_blank" rel="noreferrer">
                      <FileImage className="size-4" />
                      Lihat Bukti Transfer
                    </a>
                  </Button>
                ) : null}
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/booking">Kembali ke daftar booking</Link>
                </Button>
              </div>

              {booking.paymentReference ? (
                <div className="rounded-[20px] bg-muted/70 p-4 text-sm text-muted-foreground">
                  Referensi pembayaran: <span className="font-semibold text-foreground">{booking.paymentReference}</span>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5">
          <Card className="rounded-[30px] bg-secondary text-secondary-foreground">
            <CardHeader>
              <CardTitle className="text-xl">Timeline status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex gap-3 rounded-[22px] bg-white/10 p-4">
                <CalendarClock className="mt-0.5 size-5" />
                <div>
                  <p className="font-medium">Booking dibuat</p>
                  <p className="mt-1 text-white/75">{formatDate(booking.checkInDate)}</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-[22px] bg-white/10 p-4">
                <Wallet className="mt-0.5 size-5" />
                <div>
                  <p className="font-medium">{getPaymentStatusLabel(booking.paymentStatus)}</p>
                  <p className="mt-1 text-white/75">
                    {booking.paidAt
                      ? `Pembayaran tercatat pada ${formatDate(booking.paidAt)}`
                      : "Status pembayaran akan diperbarui sesuai metode yang Anda pilih."}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 rounded-[22px] bg-white/10 p-4">
                <ShieldCheck className="mt-0.5 size-5" />
                <div>
                  <p className="font-medium">{getBookingStatusLabel(booking.status)}</p>
                  <p className="mt-1 text-white/75">
                    {booking.roomNumber
                      ? `Nomor kamar Anda: ${booking.roomNumber}`
                      : booking.verifiedAt
                        ? `Diverifikasi pada ${formatDate(booking.verifiedAt)}`
                        : "Nomor kamar akan tampil setelah booking diverifikasi owner."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[30px]">
            <CardHeader>
              <CardTitle>Catatan booking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="leading-6 text-muted-foreground">
                {booking.notes || "Belum ada catatan tambahan untuk booking ini."}
              </p>
              {booking.paymentExternalId ? (
                <div className="rounded-[20px] bg-muted/60 p-4">
                  <p className="text-muted-foreground">External ID pembayaran</p>
                  <p className="mt-1 font-semibold">{booking.paymentExternalId}</p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
