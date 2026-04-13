"use client";

import Link from "next/link";
import { FileImage, LoaderCircle, Upload, Wallet } from "lucide-react";

import type { BookingFormState, BookingUnitRecord } from "@/components/site/booking/booking-page.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type BookingFormCardProps = {
  userName?: string;
  userEmail?: string;
  units: BookingUnitRecord[];
  form: BookingFormState;
  status: string;
  isLoadingUnits: boolean;
  isSubmitting: boolean;
  isUploadingKtp: boolean;
  isUploadingProof: boolean;
  onFieldChange: (key: keyof BookingFormState, value: string) => void;
  onFileUpload: (fileList: FileList | null, kind: "ktp" | "payment-proof") => void;
  onSubmit: () => void;
};

export function BookingFormCard({
  userName,
  userEmail,
  units,
  form,
  status,
  isLoadingUnits,
  isSubmitting,
  isUploadingKtp,
  isUploadingProof,
  onFieldChange,
  onFileUpload,
  onSubmit,
}: BookingFormCardProps) {
  return (
    <Card className="rounded-[30px]">
      <CardHeader>
        <CardTitle>Form data penyewa</CardTitle>
        <CardDescription>
          Data booking akan dikirim ke backend, dan dokumen diunggah ke folder lokal proyek.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input value={userName ?? ""} disabled placeholder="Nama lengkap" />
          <Input value={userEmail ?? ""} disabled placeholder="Alamat email" type="email" />
          <Input
            placeholder="Nomor WhatsApp"
            value={form.phoneNumber}
            onChange={(event) => onFieldChange("phoneNumber", event.target.value)}
          />
          <Input
            placeholder="Tanggal masuk"
            type="date"
            value={form.checkInDate}
            onChange={(event) => onFieldChange("checkInDate", event.target.value)}
          />
          <Input
            type="number"
            min={1}
            max={24}
            value={form.durationMonths}
            onChange={(event) => onFieldChange("durationMonths", event.target.value)}
          />
          <select
            className="flex h-11 w-full rounded-2xl border border-border bg-white/75 px-4 py-2 text-sm outline-none"
            value={form.unitId}
            onChange={(event) => onFieldChange("unitId", event.target.value)}
          >
            <option value="" disabled>
              Pilih unit yang ingin dibooking
            </option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id} disabled={unit.availableRooms < 1}>
                {unit.name} - {unit.location}
                {unit.availableRooms < 1 ? " (penuh)" : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-3">
          <p className="text-sm font-medium">Metode pembayaran</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer items-start gap-3 rounded-[24px] border border-border bg-white/70 p-4">
              <input
                type="radio"
                name="paymentMethod"
                checked={form.paymentMethod === "manual_transfer"}
                onChange={() => onFieldChange("paymentMethod", "manual_transfer")}
              />
              <div>
                <p className="font-medium">Transfer Manual</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upload bukti transfer dan tunggu verifikasi owner.
                </p>
              </div>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-[24px] border border-border bg-white/70 p-4">
              <input
                type="radio"
                name="paymentMethod"
                checked={form.paymentMethod === "xendit"}
                onChange={() => onFieldChange("paymentMethod", "xendit")}
              />
              <div>
                <p className="font-medium">Pembayaran Online Xendit</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Setelah booking dibuat, Anda akan diarahkan ke halaman checkout Xendit.
                </p>
              </div>
            </label>
          </div>
        </div>
        <Textarea
          placeholder="Catatan tambahan, kebutuhan parkir, atau preferensi kamar..."
          value={form.notes}
          onChange={(event) => onFieldChange("notes", event.target.value)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="rounded-[24px] border-dashed">
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <FileImage className="size-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Upload foto KTP</p>
                  <p className="text-sm text-muted-foreground">JPG/PNG, maksimal 5 MB</p>
                </div>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground">
                {isUploadingKtp ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
                Upload KTP
                <input
                  className="hidden"
                  type="file"
                  accept="image/*"
                  onChange={(event) => onFileUpload(event.target.files, "ktp")}
                />
              </label>
              {form.ktpImageUrl ? (
                <a
                  href={form.ktpImageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-sm text-primary underline"
                >
                  Lihat file KTP
                </a>
              ) : null}
            </CardContent>
          </Card>
          {form.paymentMethod === "manual_transfer" ? (
            <Card className="rounded-[24px] border-dashed">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                    <Wallet className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Upload bukti transfer</p>
                    <p className="text-sm text-muted-foreground">
                      Owner akan memverifikasi dari dashboard.
                    </p>
                  </div>
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground">
                  {isUploadingProof ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Upload className="size-4" />
                  )}
                  Upload Bukti
                  <input
                    className="hidden"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(event) => onFileUpload(event.target.files, "payment-proof")}
                  />
                </label>
                {form.paymentProofUrl ? (
                  <a
                    href={form.paymentProofUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-sm text-primary underline"
                  >
                    Lihat bukti transfer
                  </a>
                ) : null}
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-[24px] border-dashed">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                    <Wallet className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Checkout online via Xendit</p>
                    <p className="text-sm text-muted-foreground">
                      Sistem akan membuat invoice otomatis setelah booking berhasil dibuat.
                    </p>
                  </div>
                </div>
                <div className="rounded-[20px] bg-muted/70 p-4 text-sm leading-6 text-muted-foreground">
                  Anda tidak perlu upload bukti transfer manual. Status pembayaran akan diupdate
                  otomatis dari webhook Xendit.
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        {status ? (
          <div className="whitespace-pre-line rounded-[20px] bg-muted/80 p-4 text-sm leading-6 text-foreground">
            {status}
          </div>
        ) : null}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            className="flex-1"
            onClick={onSubmit}
            disabled={
              isSubmitting || isLoadingUnits || !form.unitId || !form.checkInDate || !form.durationMonths
            }
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Mengirim Booking
              </>
            ) : (
              "Kirim Booking"
            )}
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/katalog">Kembali ke katalog</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
