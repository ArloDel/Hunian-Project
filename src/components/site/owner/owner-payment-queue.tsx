"use client";

import { FileImage, LoaderCircle, ShieldCheck, XCircle } from "lucide-react";

import type { DashboardPayload } from "@/components/site/owner/owner-page.types";
import { formatCurrency } from "@/components/site/owner/owner-page.utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type OwnerPaymentQueueProps = {
  items: DashboardPayload["pendingPaymentItems"];
  bookingRoomNumbers: Record<string, string>;
  busyBookingId: string | null;
  onRoomNumberChange: (bookingId: string, value: string) => void;
  onBookingAction: (bookingId: string, action: "verified" | "rejected") => void;
};

export function OwnerPaymentQueue({
  items,
  bookingRoomNumbers,
  busyBookingId,
  onRoomNumberChange,
  onBookingAction,
}: OwnerPaymentQueueProps) {
  return (
    <Card className="rounded-[30px]">
      <CardHeader>
        <CardTitle>Verifikasi pembayaran</CardTitle>
        <CardDescription>
          Owner bisa verifikasi atau menolak bukti transfer langsung dari daftar ini.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length ? (
          items.map((item) => (
            <div key={item.id} className="rounded-[24px] border border-border bg-white/75 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-1">
                  <p className="font-semibold">
                    {item.unit?.name ?? "Unit"} - {item.bookingCode}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.user?.name ?? "Penyewa"} | Check-in{" "}
                    {new Date(item.checkInDate).toLocaleDateString("id-ID")} |{" "}
                    {formatCurrency(item.totalPrice)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{item.paymentStatus}</Badge>
                    {item.paymentProofUrl ? (
                      <Button asChild variant="ghost" size="sm">
                        <a href={item.paymentProofUrl} target="_blank" rel="noreferrer">
                          <FileImage className="size-4" />
                          Lihat Bukti
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </div>
                <div className="flex w-full flex-col gap-2 lg:max-w-xs">
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
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">Tidak ada pembayaran pending saat ini.</p>
        )}
      </CardContent>
    </Card>
  );
}
