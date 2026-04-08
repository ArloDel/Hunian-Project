import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BedDouble,
  House,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import type { CatalogUnit } from "@/lib/catalog";
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

function getAvailabilityLabel(unit: CatalogUnit) {
  if (unit.availableRooms > 1) {
    return `${unit.availableRooms} unit tersedia`;
  }

  if (unit.availableRooms === 1) {
    return "Tersisa 1 unit";
  }

  return "Sedang penuh";
}

const sellingPoints = [
  {
    title: "Data unit transparan",
    description: "Harga, fasilitas, lokasi, dan ketersediaan ditampilkan langsung dari database katalog.",
    icon: BadgeCheck,
  },
  {
    title: "Cocok untuk booking cepat",
    description: "Unit yang dipilih bisa langsung dibawa ke halaman booking dengan unit sudah terisi otomatis.",
    icon: Sparkles,
  },
  {
    title: "Siap diverifikasi owner",
    description: "Begitu booking dikirim, owner bisa meninjau pembayaran dan menetapkan nomor kamar.",
    icon: ShieldCheck,
  },
];

export function UnitDetailPage({ unit }: { unit: CatalogUnit }) {
  const galleryImages = unit.imageUrls.length
    ? unit.imageUrls
    : ["/placeholder-unit-1.svg", "/placeholder-unit-2.svg", "/placeholder-unit-3.svg"];
  const primaryImage = galleryImages[0];
  const secondaryImages = galleryImages.slice(1, 3);

  return (
    <main className="relative overflow-hidden">
      <section className="hero-grid relative">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
          <SiteHeader />

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <Card className="rounded-[32px] border-white/70 bg-white/80">
              <CardHeader className="space-y-4">
                <Link
                  href="/katalog"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <ArrowLeft className="size-4" />
                  Kembali ke katalog
                </Link>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="accent">{getTypeLabel(unit.type)}</Badge>
                  <Badge variant={unit.availableRooms > 0 ? "secondary" : "outline"}>
                    {getAvailabilityLabel(unit)}
                  </Badge>
                </div>
                <CardTitle className="font-serif text-4xl leading-tight sm:text-5xl">
                  {unit.name}
                </CardTitle>
                <CardDescription className="max-w-2xl text-base leading-7">
                  {unit.description ?? "Unit ini sudah dipublikasikan dan siap ditinjau lebih lanjut sebelum booking."}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="rounded-[32px]">
              <CardHeader>
                <CardTitle className="text-2xl">Ringkasan cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-[24px] bg-muted/60 p-5">
                  <p className="text-sm text-muted-foreground">Harga sewa</p>
                  <p className="mt-2 text-3xl font-semibold text-primary">
                    {formatCurrency(unit.price)}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">per bulan</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-border bg-white/75 p-4">
                    <p className="text-sm text-muted-foreground">Stok total</p>
                    <p className="mt-2 text-xl font-semibold">{unit.stock}</p>
                  </div>
                  <div className="rounded-[24px] border border-border bg-white/75 p-4">
                    <p className="text-sm text-muted-foreground">Sisa tersedia</p>
                    <p className="mt-2 text-xl font-semibold">{unit.availableRooms}</p>
                  </div>
                </div>
                {unit.availableRooms > 0 ? (
                  <Button asChild className="w-full" size="lg">
                    <Link href={`/booking?unitId=${unit.id}&slug=${unit.slug}`}>
                      Pesan Unit Ini
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button asChild className="w-full" size="lg" variant="outline">
                    <Link href="/katalog?availability=available">
                      Lihat Unit Yang Masih Tersedia
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <Card className="overflow-hidden rounded-[32px]">
              <CardContent className="p-0">
                <div className="grid gap-4 p-6 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="relative min-h-[320px] overflow-hidden rounded-[28px] border border-border bg-muted/40">
                    <Image
                      src={primaryImage}
                      alt={`Foto utama ${unit.name}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,36,31,0.08)_0%,rgba(17,36,31,0.72)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 text-white">
                      <Badge variant="outline" className="w-fit border-white/35 bg-black/20 text-white">
                        {getTypeLabel(unit.type)}
                      </Badge>
                      <div>
                        <p className="flex items-center gap-2 text-sm text-white/80">
                          <MapPin className="size-4" />
                          {unit.location}
                        </p>
                        <h2 className="mt-3 text-3xl font-semibold tracking-tight">{unit.name}</h2>
                        <p className="mt-3 text-sm leading-6 text-white/80">
                          {unit.address ?? unit.location}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    {secondaryImages.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="relative min-h-[152px] overflow-hidden rounded-[28px] border border-border bg-muted/40"
                      >
                        <Image
                          src={image}
                          alt={`Foto ${index + 2} ${unit.name}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 30vw"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,36,31,0.06)_0%,rgba(17,36,31,0.5)_100%)]" />
                        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                          <Badge variant="secondary" className="w-fit bg-white/85 text-foreground">
                            Galeri {index + 1}
                          </Badge>
                          <p className="mt-3 text-sm leading-6 text-white/85">
                            {image.startsWith("/uploads/")
                              ? "Gambar unit diunggah dari dashboard owner dan tampil langsung di halaman detail."
                              : "Galeri unit aktif dari sumber gambar katalog yang tersimpan di database."}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[32px]">
              <CardHeader>
                <CardTitle>Fasilitas unit</CardTitle>
                <CardDescription>
                  Semua fasilitas ini diambil langsung dari data unit yang tersimpan.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                {unit.facilities.map((facility) => (
                  <Badge key={facility} variant="outline" className="px-4 py-2 text-sm">
                    {facility}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6">
            <Card className="rounded-[32px]">
              <CardHeader>
                <CardTitle className="text-2xl">Informasi lokasi dan unit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 rounded-[24px] bg-muted/55 p-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white">
                    <MapPin className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Lokasi</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{unit.location}</p>
                  </div>
                </div>
                <div className="flex gap-4 rounded-[24px] bg-muted/55 p-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white">
                    <House className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Tipe hunian</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{getTypeLabel(unit.type)}</p>
                  </div>
                </div>
                <div className="flex gap-4 rounded-[24px] bg-muted/55 p-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white">
                    <BedDouble className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Status ketersediaan</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{getAvailabilityLabel(unit)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[32px] bg-secondary text-secondary-foreground">
              <CardHeader>
                <CardTitle className="text-2xl">Kenapa halaman ini penting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sellingPoints.map((point) => (
                  <div key={point.title} className="rounded-[24px] bg-white/10 p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-white/14">
                        <point.icon className="size-4" />
                      </div>
                      <p className="font-semibold">{point.title}</p>
                    </div>
                    <p className="text-sm leading-6 text-white/75">{point.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
