import Link from "next/link";
import { ArrowRight, Building2, MapPin } from "lucide-react";

import { formatCatalogPrice, getCatalogAvailabilityLabel, getCatalogUnitTypeLabel, type CatalogUnit } from "@/lib/catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CatalogPageGrid({ units }: { units: CatalogUnit[] }) {
  if (!units.length) {
    return (
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
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {units.map((unit) => (
        <Card key={unit.id} className="overflow-hidden rounded-[30px]">
          <CardContent className="p-0">
            <div className="h-52 bg-gradient-to-br from-[#f6d4a5] via-[#fbead2] to-[#fff8ef] p-6">
              <div className="flex h-full flex-col justify-between rounded-[24px] border border-white/60 bg-white/30 p-5">
                <div className="flex items-start justify-between gap-3">
                  <Badge variant="outline" className="w-fit bg-white/75">
                    {getCatalogUnitTypeLabel(unit.type)}
                  </Badge>
                  <Badge variant={unit.availableRooms > 0 ? "accent" : "secondary"}>
                    {getCatalogAvailabilityLabel(unit)}
                  </Badge>
                </div>
                <div>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="size-4" />
                    {unit.location}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">{unit.name}</h2>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="text-lg font-semibold">{formatCatalogPrice(unit.price)}/bulan</span>
                <span className="text-sm text-muted-foreground">Stok total {unit.stock}</span>
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
                  <Link href={`/booking?unitId=${unit.id}&slug=${unit.slug}`}>
                    Booking Sekarang
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href={`/katalog/${unit.slug}`}>
                    <Building2 className="size-4" />
                    Detail Unit
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
