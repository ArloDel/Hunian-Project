"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  FileImage,
  LoaderCircle,
  ShieldCheck,
  Wallet,
  XCircle,
} from "lucide-react";

import type { DashboardPayload } from "@/components/site/owner/owner-page.types";
import {
  getOwnerBookingStatusLabel,
  getOwnerPaymentMethodDescription,
  getOwnerPaymentMethodLabel,
  getOwnerPaymentStatusLabel,
  needsManualReview,
} from "@/components/site/owner/owner-booking-status";
import { formatCurrency } from "@/components/site/owner/owner-page.utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type MethodFilter = "all" | "manual_transfer" | "xendit";
type PaymentFilter =
  | "all"
  | "needs_review"
  | "unpaid"
  | "verified"
  | "expired"
  | "rejected";

type OwnerBookingsCardProps = {
  items: DashboardPayload["ownerBookings"];
  bookingRoomNumbers: Record<string, string>;
  busyBookingId: string | null;
  onRoomNumberChange: (bookingId: string, value: string) => void;
  onBookingAction: (bookingId: string, action: "verified" | "rejected") => void;
};

export function OwnerBookingsCard({
  items,
  bookingRoomNumbers,
  busyBookingId,
  onRoomNumberChange,
  onBookingAction,
}: OwnerBookingsCardProps) {
  const [methodFilter, setMethodFilter] = useState<MethodFilter>("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("all");

  const summary = useMemo(
    () => ({
      manualReview: items.filter((item) => needsManualReview(item)).length,
      onlineWaiting: items.filter(
        (item) => item.paymentMethod === "xendit" && item.paymentStatus === "unpaid",
      ).length,
      paid: items.filter((item) => item.paymentStatus === "verified").length,
    }),
    [items],
  );

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        if (methodFilter !== "all" && item.paymentMethod !== methodFilter) {
          return false;
        }

        switch (paymentFilter) {
          case "needs_review":
            return needsManualReview(item);
          case "unpaid":
            return item.paymentStatus === "unpaid";
          case "verified":
            return item.paymentStatus === "verified";
          case "expired":
            return item.paymentStatus === "expired";
          case "rejected":
            return item.paymentStatus === "rejected";
          default:
            return true;
        }
      }),
    [items, methodFilter, paymentFilter],
  );

  return (
    <Card className="rounded-[30px]">
      <CardHeader className="space-y-4">
        <div className="space-y-2">
          <CardTitle>Operasional booking & pembayaran</CardTitle>
          <CardDescription>
            Semua booking terbaru tampil di sini. Booking manual bisa diverifikasi langsung,
            sedangkan booking Xendit cukup dipantau statusnya.
          </CardDescription>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-[22px] bg-muted/60 p-4">
            <p className="text-sm text-muted-foreground">Perlu review manual</p>
            <p className="mt-2 text-2xl font-semibold">{summary.manualReview}</p>
          </div>
          <div className="rounded-[22px] bg-muted/60 p-4">
            <p className="text-sm text-muted-foreground">Xendit menunggu dibayar</p>
            <p className="mt-2 text-2xl font-semibold">{summary.onlineWaiting}</p>
          </div>
          <div className="rounded-[22px] bg-muted/60 p-4">
            <p className="text-sm text-muted-foreground">Booking sudah dibayar</p>
            <p className="mt-2 text-2xl font-semibold">{summary.paid}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              ["all", "Semua metode"],
              ["manual_transfer", "Transfer manual"],
              ["xendit", "Xendit"],
            ].map(([value, label]) => (
              <Button
                key={value}
                variant={methodFilter === value ? "default" : "outline"}
                size="sm"
                onClick={() => setMethodFilter(value as MethodFilter)}
              >
                {label}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              ["all", "Semua status"],
              ["needs_review", "Perlu review"],
              ["unpaid", "Belum dibayar"],
              ["verified", "Sudah dibayar"],
              ["expired", "Kedaluwarsa"],
              ["rejected", "Ditolak"],
            ].map(([value, label]) => (
              <Button
                key={value}
                variant={paymentFilter === value ? "default" : "outline"}
                size="sm"
                onClick={() => setPaymentFilter(value as PaymentFilter)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {filteredItems.length ? (
          filteredItems.map((item) => {
            const canReview = needsManualReview(item);

            return (
              <div key={item.id} className="rounded-[24px] border border-border bg-white/75 p-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">
                          {item.unit?.name ?? "Unit"} | {item.bookingCode}
                        </p>
                        <Badge variant="outline">
                          {getOwnerPaymentMethodLabel(item.paymentMethod)}
                        </Badge>
                        <Badge variant="secondary">
                          {getOwnerPaymentStatusLabel(item.paymentStatus)}
                        </Badge>
                        <Badge variant="accent">
                          {getOwnerBookingStatusLabel(item.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.user?.name ?? "Penyewa"} | {item.user?.email ?? "-"} |{" "}
                        {item.unit?.location ?? "Lokasi belum tersedia"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Check-in {new Date(item.checkInDate).toLocaleDateString("id-ID")} | Total{" "}
                        {formatCurrency(item.totalPrice)} | Dibuat{" "}
                        {new Date(item.createdAt).toLocaleDateString("id-ID")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {getOwnerPaymentMethodDescription(item.paymentMethod)}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.paymentProofUrl ? (
                          <Button asChild variant="ghost" size="sm">
                            <a href={item.paymentProofUrl} target="_blank" rel="noreferrer">
                              <FileImage className="size-4" />
                              Lihat bukti transfer
                            </a>
                          </Button>
                        ) : null}
                        {item.paymentUrl ? (
                          <Button asChild variant="ghost" size="sm">
                            <a href={item.paymentUrl} target="_blank" rel="noreferrer">
                              <Wallet className="size-4" />
                              Buka checkout
                            </a>
                          </Button>
                        ) : null}
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/owner/bookings/${item.id}`}>
                            <ArrowUpRight className="size-4" />
                            Lihat detail owner
                          </Link>
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 xl:w-full xl:max-w-xs">
                      {item.roomNumber ? (
                        <div className="rounded-[20px] bg-muted/60 p-3 text-sm">
                          Nomor kamar terpasang: <span className="font-semibold">{item.roomNumber}</span>
                        </div>
                      ) : null}
                      {item.paidAt ? (
                        <div className="rounded-[20px] bg-muted/60 p-3 text-sm">
                          Dibayar pada{" "}
                          <span className="font-semibold">
                            {new Date(item.paidAt).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                      ) : null}
                      {canReview ? (
                        <>
                          <Input
                            placeholder="Nomor kamar jika verified"
                            value={bookingRoomNumbers[item.id] ?? ""}
                            onChange={(event) => onRoomNumberChange(item.id, event.target.value)}
                          />
                          <div className="flex gap-2">
                            <Button
                              className="flex-1"
                              size="sm"
                              onClick={() => onBookingAction(item.id, "verified")}
                              disabled={busyBookingId === item.id}
                            >
                              {busyBookingId === item.id ? (
                                <LoaderCircle className="size-4 animate-spin" />
                              ) : (
                                <ShieldCheck className="size-4" />
                              )}
                              Verify
                            </Button>
                            <Button
                              className="flex-1"
                              size="sm"
                              variant="outline"
                              onClick={() => onBookingAction(item.id, "rejected")}
                              disabled={busyBookingId === item.id}
                            >
                              <XCircle className="size-4" />
                              Tolak
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="rounded-[20px] border border-dashed border-border p-3 text-sm text-muted-foreground">
                          {item.paymentMethod === "xendit"
                            ? "Booking Xendit diproses otomatis. Owner cukup memantau status pembayaran."
                            : "Tidak ada aksi manual yang diperlukan untuk booking ini."}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground">
            Tidak ada booking yang cocok dengan filter saat ini.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
