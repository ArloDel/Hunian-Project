"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CircleDollarSign,
  HousePlus,
  LoaderCircle,
  ReceiptText,
  UserRoundCheck,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
  latestBookings: Array<{
    id: string;
    bookingCode: string;
    status: string;
    paymentStatus: string;
    totalPrice: string;
    unit: { name: string } | null;
    user: { name: string } | null;
  }>;
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
    unit: { name: string } | null;
    user: { name: string } | null;
  }>;
};

export function OwnerPage() {
  const { data: session, isPending } = authClient.useSession();
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetch("/api/owner/dashboard");
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error ?? "Dashboard owner tidak dapat dimuat.");
        }

        setDashboard(payload.data);
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

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
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
            Dashboard ini sekarang membaca data live dari API owner dan booking.
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

      {loading ? (
        <Card className="rounded-[30px]">
          <CardContent className="flex items-center gap-3 p-6 text-muted-foreground">
            <LoaderCircle className="size-5 animate-spin" />
            Memuat dashboard owner...
          </CardContent>
        </Card>
      ) : message ? (
        <Card className="rounded-[30px]">
          <CardContent className="p-6 text-sm text-foreground">{message}</CardContent>
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

          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="rounded-[30px]">
              <CardHeader>
                <CardTitle>Verifikasi pembayaran</CardTitle>
                <CardDescription>Daftar transaksi live yang menunggu pengecekan owner.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboard?.pendingPaymentItems.length ? (
                  dashboard.pendingPaymentItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 rounded-[24px] border border-border bg-white/75 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold">
                          {item.unit?.name ?? "Unit"} - {item.bookingCode}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.user?.name ?? "Penyewa"} | Check-in{" "}
                          {new Date(item.checkInDate).toLocaleDateString("id-ID")} | Rp
                          {Number(item.totalPrice).toLocaleString("id-ID")}
                        </p>
                      </div>
                      <Badge variant="accent" className="w-fit">
                        Pending
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Tidak ada pembayaran pending saat ini.</p>
                )}
              </CardContent>
            </Card>

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
