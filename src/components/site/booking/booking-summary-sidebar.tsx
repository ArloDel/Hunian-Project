"use client";

import { CalendarClock, ShieldCheck, Wallet } from "lucide-react";

import type { BookingFormState, BookingUnitRecord } from "@/components/site/booking/booking-page.types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type BookingSummarySidebarProps = {
  selectedUnit: BookingUnitRecord | null;
  form: BookingFormState;
  totalTagihan: number;
};

export function BookingSummarySidebar({
  selectedUnit,
  form,
  totalTagihan,
}: BookingSummarySidebarProps) {
  return (
    <div className="grid gap-5">
      <Card className="rounded-[30px]">
        <CardHeader>
          <Badge variant="secondary" className="w-fit">
            Ringkasan Unit
          </Badge>
          <CardTitle>{selectedUnit?.name ?? "Belum ada unit dipilih"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-[24px] bg-[linear-gradient(135deg,#f5dbb5_0%,#fff4e5_100%)] p-5">
            <p className="text-sm text-muted-foreground">Lokasi</p>
            <p className="mt-2 text-lg font-semibold">
              {selectedUnit?.location ?? "Pilih unit dari dropdown di sebelah kiri."}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              {(selectedUnit?.facilities ?? []).join(", ") ||
                "Setelah unit dipilih, fasilitas dan harga akan muncul di kartu ringkasan ini."}
            </p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Harga bulanan</span>
              <span className="font-semibold">
                Rp{Number(selectedUnit?.price ?? 0).toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Durasi sewa</span>
              <span className="font-semibold">{form.durationMonths || 0} bulan</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Biaya admin</span>
              <span className="font-semibold">Rp150.000</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-base">
              <span>Total tagihan</span>
              <span className="font-semibold text-primary">
                Rp{totalTagihan.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[30px] bg-secondary text-secondary-foreground">
        <CardHeader>
          <CardTitle className="text-xl">Status proses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-center gap-3 rounded-[22px] bg-white/10 p-4">
            <CalendarClock className="size-5" />
            <p>Tanggal check-in dan durasi akan masuk sebagai booking baru.</p>
          </div>
          <div className="flex items-center gap-3 rounded-[22px] bg-white/10 p-4">
            <ShieldCheck className="size-5" />
            <p>Profil user, nomor HP, dan KTP akan tersimpan di profil penyewa.</p>
          </div>
          <div className="flex items-center gap-3 rounded-[22px] bg-white/10 p-4">
            <Wallet className="size-5" />
            <p>Owner bisa langsung verify atau reject bukti transfer dari dashboard owner.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
