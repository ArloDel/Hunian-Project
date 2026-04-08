"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  FileImage,
  LoaderCircle,
  ShieldCheck,
  Upload,
  Wallet,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

type UnitRecord = {
  id: string;
  slug: string;
  name: string;
  location: string;
  price: string;
  availableRooms: number;
  facilities: string[];
};

type BookingRecord = {
  id: string;
  bookingCode: string;
  checkInDate: string | Date;
  durationMonths: number;
  totalPrice: string;
  status: string;
  paymentStatus: string;
  paymentProofUrl: string | null;
  roomNumber: string | null;
  unit: {
    name: string;
    location?: string;
  } | null;
};

const initialForm = {
  phoneNumber: "",
  ktpImageUrl: "",
  paymentProofUrl: "",
  checkInDate: "",
  durationMonths: "12",
  unitId: "",
  notes: "",
};

export function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = authClient.useSession();
  const [units, setUnits] = useState<UnitRecord[]>([]);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUnits, setIsLoadingUnits] = useState(true);
  const [bookingHistory, setBookingHistory] = useState<BookingRecord[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [isUploadingKtp, setIsUploadingKtp] = useState(false);
  const [isUploadingProof, setIsUploadingProof] = useState(false);

  useEffect(() => {
    const loadUnits = async () => {
      try {
        const response = await fetch("/api/units");
        const payload = await response.json();
        const unitList = (payload.data ?? []) as UnitRecord[];
        setUnits(unitList);

        const requestedUnitId = searchParams.get("unitId");
        const requestedSlug = searchParams.get("slug");
        const matchedUnit = unitList.find(
          (unit) => unit.id === requestedUnitId || unit.slug === requestedSlug,
        );

        if (matchedUnit) {
          setForm((current) => ({
            ...current,
            unitId: matchedUnit.id,
          }));
        }
      } catch {
        setStatus("Gagal memuat daftar unit.");
      } finally {
        setIsLoadingUnits(false);
      }
    };

    loadUnits();
  }, [searchParams]);

  useEffect(() => {
    const loadBookings = async () => {
      if (!session?.user) {
        setBookingHistory([]);
        return;
      }

      setIsLoadingBookings(true);

      try {
        const response = await fetch("/api/bookings");
        const payload = await response.json();
        setBookingHistory(payload.data ?? []);
      } catch {
        setBookingHistory([]);
      } finally {
        setIsLoadingBookings(false);
      }
    };

    loadBookings();
  }, [session]);

  const selectedUnit = useMemo(
    () => units.find((unit) => unit.id === form.unitId) ?? null,
    [form.unitId, units],
  );

  const isPrefilledFromCatalog = Boolean(searchParams.get("unitId") || searchParams.get("slug"));

  const totalTagihan = useMemo(() => {
    if (!selectedUnit) {
      return 0;
    }

    return Number(selectedUnit.price) * Number(form.durationMonths || 0) + 150000;
  }, [form.durationMonths, selectedUnit]);

  const handleChange = (
    key: keyof typeof form,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const uploadSingleFile = async (
    file: File,
    kind: "ktp" | "payment-proof",
  ) => {
    const formData = new FormData();
    formData.append("kind", kind);
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error ?? "Upload file gagal.");
    }

    return payload.data.url as string;
  };

  const handleFileUpload = async (
    fileList: FileList | null,
    kind: "ktp" | "payment-proof",
  ) => {
    const file = fileList?.[0];

    if (!file) {
      return;
    }

    try {
      if (kind === "ktp") {
        setIsUploadingKtp(true);
      } else {
        setIsUploadingProof(true);
      }

      const url = await uploadSingleFile(file, kind);

      if (kind === "ktp") {
        handleChange("ktpImageUrl", url);
      } else {
        handleChange("paymentProofUrl", url);
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload file gagal.");
    } finally {
      if (kind === "ktp") {
        setIsUploadingKtp(false);
      } else {
        setIsUploadingProof(false);
      }
    }
  };

  const handleBooking = async () => {
    if (!session?.user) {
      router.push("/auth?mode=login&next=%2Fbooking");
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    try {
      const bookingResponse = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          unitId: form.unitId,
          checkInDate: form.checkInDate,
          durationMonths: Number(form.durationMonths),
          notes: form.notes || null,
          paymentProofUrl: form.paymentProofUrl || null,
        }),
      });

      const bookingPayload = await bookingResponse.json();

      if (!bookingResponse.ok) {
        throw new Error(bookingPayload.error ?? "Booking gagal diproses.");
      }

      if (form.phoneNumber || form.ktpImageUrl) {
        await fetch("/api/auth/update-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: form.phoneNumber || undefined,
            ktpImageUrl: form.ktpImageUrl || undefined,
          }),
        }).catch(() => null);
      }

      setStatus(
        `Booking berhasil dibuat dengan kode ${bookingPayload.data?.bookingCode ?? "-"}.
Silakan tunggu verifikasi owner.`,
      );
      setBookingHistory((current) =>
        bookingPayload.data ? [bookingPayload.data as BookingRecord, ...current] : current,
      );
      setForm((current) => ({
        ...current,
        paymentProofUrl: "",
        notes: "",
      }));
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Booking gagal diproses.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowLeft className="size-4" />
            Kembali ke beranda
          </Link>
          <Badge variant="accent" className="w-fit">
            Form Booking
          </Badge>
          <h1 className="font-serif text-4xl tracking-tight">Amankan unit sebelum keduluan.</h1>
          <p className="max-w-2xl text-muted-foreground">
            Booking tenant sekarang mendukung upload file nyata untuk KTP dan bukti transfer.
            {isPrefilledFromCatalog
              ? " Unit yang Anda pilih dari katalog juga sudah diprefill otomatis."
              : " Mulailah dengan memilih unit yang ingin Anda pesan terlebih dahulu."}
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          {isPending ? (
            <p className="text-sm text-muted-foreground">Memuat sesi...</p>
          ) : session?.user ? (
            <Badge variant="secondary">Login sebagai {session.user.name}</Badge>
          ) : (
            <Button asChild variant="secondary">
              <Link href="/auth?mode=login&next=%2Fbooking">Masuk untuk booking</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
        <Card className="rounded-[30px]">
          <CardHeader>
            <CardTitle>Form data penyewa</CardTitle>
            <CardDescription>
              Data booking akan dikirim ke backend, dan dokumen diunggah ke folder lokal proyek.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input value={session?.user.name ?? ""} disabled placeholder="Nama lengkap" />
              <Input value={session?.user.email ?? ""} disabled placeholder="Alamat email" type="email" />
              <Input
                placeholder="Nomor WhatsApp"
                value={form.phoneNumber}
                onChange={(event) => handleChange("phoneNumber", event.target.value)}
              />
              <Input
                placeholder="Tanggal masuk"
                type="date"
                value={form.checkInDate}
                onChange={(event) => handleChange("checkInDate", event.target.value)}
              />
              <Input
                type="number"
                min={1}
                max={24}
                value={form.durationMonths}
                onChange={(event) => handleChange("durationMonths", event.target.value)}
              />
              <select
                className="flex h-11 w-full rounded-2xl border border-border bg-white/75 px-4 py-2 text-sm outline-none"
                value={form.unitId}
                onChange={(event) => handleChange("unitId", event.target.value)}
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
            <Textarea
              placeholder="Catatan tambahan, kebutuhan parkir, atau preferensi kamar..."
              value={form.notes}
              onChange={(event) => handleChange("notes", event.target.value)}
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
                      onChange={(event) => handleFileUpload(event.target.files, "ktp")}
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
              <Card className="rounded-[24px] border-dashed">
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                      <Wallet className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Upload bukti transfer</p>
                      <p className="text-sm text-muted-foreground">Owner akan memverifikasi dari dashboard.</p>
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
                      onChange={(event) => handleFileUpload(event.target.files, "payment-proof")}
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
            </div>
            {status ? (
              <div className="rounded-[20px] bg-muted/80 p-4 text-sm leading-6 text-foreground whitespace-pre-line">
                {status}
              </div>
            ) : null}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                className="flex-1"
                onClick={handleBooking}
                disabled={
                  isSubmitting ||
                  isLoadingUnits ||
                  !form.unitId ||
                  !form.checkInDate ||
                  !form.durationMonths
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
      </div>

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
          {!session?.user ? (
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
    </main>
  );
}
