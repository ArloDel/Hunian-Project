import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2, Filter, MapPin } from "lucide-react";

import type { CatalogAvailability, CatalogUnit } from "@/lib/catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SiteHeader } from "@/components/site/site-header";

type CatalogPageProps = {
  units: CatalogUnit[];
  availability: CatalogAvailability;
  type: "all" | "kost" | "kontrakan";
};

function formatCurrency(value: string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function getTypeLabel(type: CatalogUnit["type"]) {
  return type === "kost" ? "Kost" : "Kontrakan";
}

function getStatusLabel(unit: CatalogUnit) {
  if (unit.availableRooms > 1) {
    return `${unit.availableRooms} unit tersedia`;
  }

  if (unit.availableRooms === 1) {
    return "Tersisa 1 unit";
  }

  return "Penuh";
}

function getAvailabilityCopy(availability: CatalogAvailability) {
  if (availability === "available") {
    return "Hanya menampilkan unit yang masih bisa dibooking.";
  }

  if (availability === "full") {
    return "Menampilkan unit yang sudah penuh untuk membantu pemantauan stok.";
  }

  return "Menampilkan seluruh katalog kost dan kontrakan, dari yang masih tersedia sampai yang sudah penuh.";
}

export function CatalogPage({ units, availability, type }: CatalogPageProps) {
  return (
    <main className="relative overflow-hidden">
      <section className="hero-grid relative">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
          <SiteHeader />

          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="rounded-[32px] border-white/70 bg-white/80">
              <CardHeader className="space-y-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <ArrowLeft className="size-4" />
                  Kembali ke beranda
                </Link>
                <Badge variant="accent" className="w-fit">
                  Katalog Lengkap
                </Badge>
                <CardTitle className="font-serif text-4xl leading-tight sm:text-5xl">
                  Semua katalog Hunian Mahmudah dalam satu halaman.
                </CardTitle>
                <CardDescription className="max-w-2xl text-base leading-7">
                  {getAvailabilityCopy(availability)}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="rounded-[32px]">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Filter className="size-4" />
                  Filter cepat
                </div>
                <CardTitle className="text-2xl">Lihat katalog sesuai kebutuhan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant={availability === "all" ? "default" : "outline"} size="sm">
                    <Link href={`/katalog?type=${type}`}>Semua status</Link>
                  </Button>
                  <Button
                    asChild
                    variant={availability === "available" ? "default" : "outline"}
                    size="sm"
                  >
                    <Link href={`/katalog?availability=available&type=${type}`}>Tersedia</Link>
                  </Button>
                  <Button asChild variant={availability === "full" ? "default" : "outline"} size="sm">
                    <Link href={`/katalog?availability=full&type=${type}`}>Penuh</Link>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant={type === "all" ? "default" : "outline"} size="sm">
                    <Link href={`/katalog?availability=${availability}`}>Semua tipe</Link>
                  </Button>
                  <Button asChild variant={type === "kost" ? "default" : "outline"} size="sm">
                    <Link href={`/katalog?availability=${availability}&type=kost`}>Kost</Link>
                  </Button>
                  <Button
                    asChild
                    variant={type === "kontrakan" ? "default" : "outline"}
                    size="sm"
                  >
                    <Link href={`/katalog?availability=${availability}&type=kontrakan`}>
                      Kontrakan
                    </Link>
                  </Button>
                </div>
                <div className="rounded-[24px] bg-muted/60 p-4 text-sm text-muted-foreground">
                  Total unit tampil: <span className="font-semibold text-foreground">{units.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
        {units.length ? (
          <div className="grid gap-5 lg:grid-cols-3">
            {units.map((unit) => (
              <Card key={unit.id} className="overflow-hidden rounded-[30px]">
                <CardContent className="p-0">
                  <div className="h-52 bg-gradient-to-br from-[#f6d4a5] via-[#fbead2] to-[#fff8ef] p-6">
                    <div className="flex h-full flex-col justify-between rounded-[24px] border border-white/60 bg-white/30 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <Badge variant="outline" className="w-fit bg-white/75">
                          {getTypeLabel(unit.type)}
                        </Badge>
                        <Badge variant={unit.availableRooms > 0 ? "accent" : "secondary"}>
                          {getStatusLabel(unit)}
                        </Badge>
                      </div>
                      <div>
                        <p className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="size-4" />
                          {unit.location}
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                          {unit.name}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-lg font-semibold">
                        {formatCurrency(unit.price)}/bulan
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Stok total {unit.stock}
                      </span>
                    </div>

                    <p className="min-h-16 text-sm leading-6 text-muted-foreground">
                      {unit.description ?? "Unit ini siap dipertimbangkan untuk booking berikutnya."}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {unit.facilities.slice(0, 4).map((facility) => (
                        <Badge key={facility} variant="outline">
                          {facility}
                        </Badge>
                      ))}
                    </div>

                    <div className="rounded-[22px] bg-muted/55 p-4 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">{unit.address ?? unit.location}</p>
                      <p className="mt-1">
                        {unit.availableRooms > 0
                          ? `Masih ada ${unit.availableRooms} unit yang bisa dibooking sekarang.`
                          : "Saat ini unit sedang penuh, tetapi tetap ditampilkan untuk kebutuhan monitoring katalog."}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button asChild className="flex-1">
                        <Link href="/booking">
                          Booking Sekarang
                          <ArrowRight className="size-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="flex-1">
                        <Link href="/owner">
                          <Building2 className="size-4" />
                          Dashboard
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="rounded-[32px]">
            <CardContent className="space-y-3 p-8">
              <Badge variant="secondary" className="w-fit">
                Tidak ada hasil
              </Badge>
              <h2 className="text-2xl font-semibold">Belum ada unit untuk filter yang dipilih.</h2>
              <p className="text-muted-foreground">
                Coba ganti filter status atau tipe unit agar katalog yang tersedia bisa muncul lagi.
              </p>
              <Button asChild className="w-fit">
                <Link href="/katalog">Reset filter</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}
