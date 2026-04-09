"use client";

import { LoaderCircle } from "lucide-react";

import type { BookingRecord } from "@/components/site/booking/booking-page.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type BookingHistoryCardProps = {
  isLoggedIn: boolean;
  isLoadingBookings: boolean;
  bookingHistory: BookingRecord[];
};

export function BookingHistoryCard({
  isLoggedIn,
  isLoadingBookings,
  bookingHistory,
}: BookingHistoryCardProps) {
  return (
    <Card className="rounded-[30px]">
      <CardHeader>
        <Badge variant="secondary" className="w-fit">
          Riwayat Booking
        </Badge>
        <CardTitle>Aktivitas booking user</CardTitle>
        <CardDescription>
          Area ini membaca riwayat booking langsung dari `/api/bookings`.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {!isLoggedIn ? (
          <p className="text-sm text-muted-foreground">
            Login terlebih dahulu untuk melihat riwayat booking Anda.
          </p>
        ) : isLoadingBookings ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LoaderCircle className="size-4 animate-spin" />
            Memuat riwayat booking...
          </div>
        ) : bookingHistory.length ? (
          bookingHistory.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col gap-3 rounded-[24px] border border-border bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold">
                  {booking.unit?.name ?? "Unit"} - {booking.bookingCode}
                </p>
                <p className="text-sm text-muted-foreground">
                  Check-in {new Date(booking.checkInDate).toLocaleDateString("id-ID")} •{" "}
                  {booking.durationMonths} bulan • Rp
                  {Number(booking.totalPrice).toLocaleString("id-ID")}
                </p>
                {booking.roomNumber ? (
                  <p className="text-sm text-muted-foreground">Nomor kamar: {booking.roomNumber}</p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{booking.status}</Badge>
                <Badge variant="accent">{booking.paymentStatus}</Badge>
                {booking.paymentProofUrl ? (
                  <Button asChild variant="ghost" size="sm">
                    <a href={booking.paymentProofUrl} target="_blank" rel="noreferrer">
                      Bukti Transfer
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            Belum ada booking. Coba kirim booking pertama Anda dari form di atas.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
