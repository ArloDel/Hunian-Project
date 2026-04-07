"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CircleDollarSign,
  FileImage,
  HousePlus,
  LoaderCircle,
  Pencil,
  ReceiptText,
  Save,
  ShieldCheck,
  Trash2,
  Upload,
  UserRoundCheck,
  XCircle,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type DashboardPayload = {
  summary: {
    activeTenants: number;
    emptyUnits: number;
    monthlyRevenue: string;
    pendingPayments: number;
    pendingBookings: number;
    occupancyRate: number;
    invoicesThisMonth: number;
    totalUnits: number;
  };
  unitsByType: Array<{
    type: string;
    total: number;
    available: number;
  }>;
  pendingPaymentItems: Array<{
    id: string;
    bookingCode: string;
    totalPrice: string;
    checkInDate: string | Date;
    paymentProofUrl: string | null;
    paymentStatus: string;
    unit: { name: string } | null;
    user: { name: string } | null;
  }>;
  managedUnits: Array<{
    id: string;
    name: string;
    type: "kost" | "kontrakan";
    location: string;
    address: string | null;
    description: string | null;
    price: string;
    stock: number;
    availableRooms: number;
    facilities: string[];
    imageUrls: string[];
    isPublished: boolean;
  }>;
};

type UnitFormState = {
  id?: string;
  name: string;
  type: "kost" | "kontrakan";
  location: string;
  address: string;
  description: string;
  price: string;
  stock: string;
  availableRooms: string;
  facilities: string;
  imageUrls: string[];
  isPublished: boolean;
};

const initialUnitForm: UnitFormState = {
  name: "",
  type: "kost",
  location: "",
  address: "",
  description: "",
  price: "",
  stock: "1",
  availableRooms: "1",
  facilities: "",
  imageUrls: [],
  isPublished: true,
};

function toUnitForm(
  unit?: DashboardPayload["managedUnits"][number] | null,
): UnitFormState {
  if (!unit) {
    return initialUnitForm;
  }

  return {
    id: unit.id,
    name: unit.name,
    type: unit.type,
    location: unit.location,
    address: unit.address ?? "",
    description: unit.description ?? "",
    price: String(Number(unit.price)),
    stock: String(unit.stock),
    availableRooms: String(unit.availableRooms),
    facilities: unit.facilities.join(", "),
    imageUrls: unit.imageUrls,
    isPublished: unit.isPublished,
  };
}

export function OwnerPage() {
  const { data: session, isPending } = authClient.useSession();
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [unitForm, setUnitForm] = useState<UnitFormState>(initialUnitForm);
  const [isSavingUnit, setIsSavingUnit] = useState(false);
  const [isUploadingUnitImage, setIsUploadingUnitImage] = useState(false);
  const [bookingRoomNumbers, setBookingRoomNumbers] = useState<Record<string, string>>({});
  const [busyBookingId, setBusyBookingId] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      const response = await fetch("/api/owner/dashboard");
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Dashboard owner tidak dapat dimuat.");
      }

      setDashboard(payload.data);
      setMessage("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Dashboard owner tidak dapat dimuat.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = dashboard
    ? [
        {
          label: "Total penghuni",
          value: String(dashboard.summary.activeTenants),
          icon: UserRoundCheck,
          note: `${dashboard.summary.pendingBookings} booking masih menunggu konfirmasi`,
        },
        {
          label: "Unit kosong",
          value: String(dashboard.summary.emptyUnits),
          icon: HousePlus,
          note: `Dari total ${dashboard.summary.totalUnits} unit aktif`,
        },
        {
          label: "Pendapatan bulan ini",
          value: `Rp${Number(dashboard.summary.monthlyRevenue).toLocaleString("id-ID")}`,
          icon: CircleDollarSign,
          note: `${dashboard.summary.pendingPayments} pembayaran perlu dicek`,
        },
      ]
    : [];

  const setUnitField = (key: keyof UnitFormState, value: string | boolean | string[]) => {
    setUnitForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const uploadSingleFile = async (file: File, kind: "unit-image" | "payment-proof" | "ktp") => {
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

  const handleUnitImageUpload = async (fileList: FileList | null) => {
    if (!fileList?.length) {
      return;
    }

    setIsUploadingUnitImage(true);

    try {
      const uploadedUrls = await Promise.all(
        Array.from(fileList).map((file) => uploadSingleFile(file, "unit-image")),
      );

      setUnitForm((current) => ({
        ...current,
        imageUrls: [...current.imageUrls, ...uploadedUrls],
      }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload gambar unit gagal.");
    } finally {
      setIsUploadingUnitImage(false);
    }
  };

  const resetUnitForm = () => {
    setUnitForm(initialUnitForm);
  };

  const handleSaveUnit = async () => {
    setIsSavingUnit(true);
    setMessage("");

    try {
      const payload = {
        name: unitForm.name,
        type: unitForm.type,
        location: unitForm.location,
        address: unitForm.address || null,
        description: unitForm.description || null,
        price: Number(unitForm.price),
        stock: Number(unitForm.stock),
        availableRooms: Number(unitForm.availableRooms),
        facilities: unitForm.facilities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        imageUrls: unitForm.imageUrls,
        isPublished: unitForm.isPublished,
      };

      const url = unitForm.id ? `/api/units/${unitForm.id}` : "/api/units";
      const method = unitForm.id ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Menyimpan unit gagal.");
      }

      setMessage(result.message ?? "Unit berhasil disimpan.");
      resetUnitForm();
      await loadDashboard();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Menyimpan unit gagal.");
    } finally {
      setIsSavingUnit(false);
    }
  };

  const handleDeleteUnit = async (unitId: string) => {
    const confirmed = window.confirm("Hapus unit ini?");

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/units/${unitId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Menghapus unit gagal.");
      }

      if (unitForm.id === unitId) {
        resetUnitForm();
      }

      setMessage(result.message ?? "Unit berhasil dihapus.");
      await loadDashboard();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Menghapus unit gagal.");
    }
  };

  const handleBookingAction = async (
    bookingId: string,
    action: "verified" | "rejected",
  ) => {
    setBusyBookingId(bookingId);

    try {
      const roomNumber = bookingRoomNumbers[bookingId]?.trim() || null;
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentStatus: action,
          status: action === "verified" ? "confirmed" : "pending",
          roomNumber: action === "verified" ? roomNumber : null,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Memperbarui booking gagal.");
      }

      setMessage(
        action === "verified"
          ? "Booking berhasil diverifikasi."
          : "Bukti transfer ditandai perlu perbaikan.",
      );
      await loadDashboard();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Memperbarui booking gagal.");
    } finally {
      setBusyBookingId(null);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowLeft className="size-4" />
            Kembali ke beranda
          </Link>
          <Badge variant="secondary" className="w-fit">
            Dashboard Owner
          </Badge>
          <h1 className="font-serif text-4xl tracking-tight">Operasional harian dalam satu layar.</h1>
          <p className="max-w-2xl text-muted-foreground">
            Dashboard ini sekarang mendukung verifikasi booking, upload gambar unit, serta CRUD unit langsung dari UI.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          {isPending ? (
            <p className="text-sm text-muted-foreground">Memuat sesi...</p>
          ) : session?.user ? (
            <Badge variant="accent">Masuk sebagai {session.user.name}</Badge>
          ) : (
            <Button asChild>
              <Link href="/auth?mode=login&next=%2Fowner">Masuk sebagai owner</Link>
            </Button>
          )}
        </div>
      </div>

      {message ? (
        <Card className="rounded-[24px]">
          <CardContent className="p-4 text-sm">{message}</CardContent>
        </Card>
      ) : null}

      {loading ? (
        <Card className="rounded-[30px]">
          <CardContent className="flex items-center gap-3 p-6 text-muted-foreground">
            <LoaderCircle className="size-5 animate-spin" />
            Memuat dashboard owner...
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-3">
            {stats.map((stat) => (
              <Card key={stat.label} className="rounded-[30px]">
                <CardHeader>
                  <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
                    <stat.icon className="size-5 text-primary" />
                  </div>
                  <CardDescription>{stat.label}</CardDescription>
                  <CardTitle className="text-3xl">{stat.value}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{stat.note}</CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-5">
              <Card className="rounded-[30px]">
                <CardHeader>
                  <CardTitle>Verifikasi pembayaran</CardTitle>
                  <CardDescription>
                    Owner bisa verifikasi atau menolak bukti transfer langsung dari daftar ini.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dashboard?.pendingPaymentItems.length ? (
                    dashboard.pendingPaymentItems.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-[24px] border border-border bg-white/75 p-4"
                      >
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div className="space-y-1">
                            <p className="font-semibold">
                              {item.unit?.name ?? "Unit"} - {item.bookingCode}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.user?.name ?? "Penyewa"} | Check-in{" "}
                              {new Date(item.checkInDate).toLocaleDateString("id-ID")} | Rp
                              {Number(item.totalPrice).toLocaleString("id-ID")}
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
                              onChange={(event) =>
                                setBookingRoomNumbers((current) => ({
                                  ...current,
                                  [item.id]: event.target.value,
                                }))
                              }
                            />
                            <div className="flex gap-2">
                              <Button
                                className="flex-1"
                                size="sm"
                                onClick={() => handleBookingAction(item.id, "verified")}
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
                                onClick={() => handleBookingAction(item.id, "rejected")}
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

              <Card className="rounded-[30px]">
                <CardHeader>
                  <CardTitle>{unitForm.id ? "Edit unit" : "Tambah unit baru"}</CardTitle>
                  <CardDescription>
                    Form ini terhubung langsung ke endpoint create dan update unit.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      placeholder="Nama unit"
                      value={unitForm.name}
                      onChange={(event) => setUnitField("name", event.target.value)}
                    />
                    <select
                      className="flex h-11 w-full rounded-2xl border border-border bg-white/75 px-4 py-2 text-sm outline-none"
                      value={unitForm.type}
                      onChange={(event) =>
                        setUnitField("type", event.target.value as "kost" | "kontrakan")
                      }
                    >
                      <option value="kost">Kost</option>
                      <option value="kontrakan">Kontrakan</option>
                    </select>
                    <Input
                      placeholder="Lokasi"
                      value={unitForm.location}
                      onChange={(event) => setUnitField("location", event.target.value)}
                    />
                    <Input
                      placeholder="Harga"
                      value={unitForm.price}
                      onChange={(event) => setUnitField("price", event.target.value)}
                    />
                    <Input
                      placeholder="Stok total"
                      value={unitForm.stock}
                      onChange={(event) => setUnitField("stock", event.target.value)}
                    />
                    <Input
                      placeholder="Kamar tersedia"
                      value={unitForm.availableRooms}
                      onChange={(event) => setUnitField("availableRooms", event.target.value)}
                    />
                  </div>
                  <Input
                    placeholder="Alamat"
                    value={unitForm.address}
                    onChange={(event) => setUnitField("address", event.target.value)}
                  />
                  <Textarea
                    placeholder="Deskripsi unit"
                    value={unitForm.description}
                    onChange={(event) => setUnitField("description", event.target.value)}
                  />
                  <Textarea
                    placeholder="Fasilitas, pisahkan dengan koma"
                    value={unitForm.facilities}
                    onChange={(event) => setUnitField("facilities", event.target.value)}
                  />
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div className="rounded-[22px] border border-dashed border-border p-4 text-sm">
                      <p className="font-medium">Upload gambar unit</p>
                      <p className="mt-1 text-muted-foreground">
                        File akan disimpan ke folder `public/uploads/unit-image`.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {unitForm.imageUrls.map((url) => (
                          <Badge key={url} variant="outline">
                            {url.split("/").pop()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground">
                      {isUploadingUnitImage ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : (
                        <Upload className="size-4" />
                      )}
                      Upload Gambar
                      <input
                        className="hidden"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(event) => handleUnitImageUpload(event.target.files)}
                      />
                    </label>
                  </div>
                  <label className="flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={unitForm.isPublished}
                      onChange={(event) => setUnitField("isPublished", event.target.checked)}
                    />
                    Publikasikan unit ini
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button onClick={handleSaveUnit} disabled={isSavingUnit}>
                      {isSavingUnit ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : unitForm.id ? (
                        <Save className="size-4" />
                      ) : (
                        <HousePlus className="size-4" />
                      )}
                      {unitForm.id ? "Simpan Perubahan" : "Tambah Unit"}
                    </Button>
                    <Button variant="outline" onClick={resetUnitForm}>
                      Reset Form
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-5">
              <Card className="rounded-[30px] bg-secondary text-secondary-foreground">
                <CardHeader>
                  <CardTitle className="text-xl">Manajemen unit</CardTitle>
                  <CardDescription className="text-white/70">
                    Ringkasan live stok unit per tipe.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dashboard?.unitsByType.map((item) => (
                    <div key={item.type} className="rounded-[22px] bg-white/10 p-4 text-sm">
                      {item.type.toUpperCase()} • {item.total} unit • {item.available} kamar/rumah tersedia
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-[30px]">
                <CardHeader>
                  <CardTitle>Daftar unit aktif</CardTitle>
                  <CardDescription>
                    Pilih edit atau hapus unit langsung dari daftar ini.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dashboard?.managedUnits.map((unit) => (
                    <div
                      key={unit.id}
                      className="rounded-[24px] border border-border bg-white/75 p-4"
                    >
                      <div className="flex flex-col gap-3">
                        <div>
                          <p className="font-semibold">{unit.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {unit.location} • {unit.type} • Rp
                            {Number(unit.price).toLocaleString("id-ID")}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">
                            tersedia {unit.availableRooms}/{unit.stock}
                          </Badge>
                          <Badge variant={unit.isPublished ? "secondary" : "accent"}>
                            {unit.isPublished ? "published" : "draft"}
                          </Badge>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setUnitForm(toUnitForm(unit))}
                          >
                            <Pencil className="size-4" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUnit(unit.id)}
                          >
                            <Trash2 className="size-4" />
                            Hapus
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-[30px]">
                <CardHeader>
                  <CardTitle>Laporan keuangan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-[24px] bg-muted/60 p-4">
                    <div className="mb-2 flex items-center gap-3">
                      <Building2 className="size-5 text-primary" />
                      <p className="font-medium">Occupancy rate</p>
                    </div>
                    <p className="text-3xl font-semibold">{dashboard?.summary.occupancyRate ?? 0}%</p>
                  </div>
                  <div className="rounded-[24px] bg-muted/60 p-4">
                    <div className="mb-2 flex items-center gap-3">
                      <ReceiptText className="size-5 text-primary" />
                      <p className="font-medium">Invoice terbit bulan ini</p>
                    </div>
                    <p className="text-3xl font-semibold">{dashboard?.summary.invoicesThisMonth ?? 0}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
