import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { formatCatalogPrice, getCatalogAvailabilityLabel, getCatalogUnitTypeLabel, type CatalogUnit } from "@/lib/catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function UnitDetailPageHero({ unit }: { unit: CatalogUnit }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <Card className="rounded-[32px] border-white/70 bg-white/80">
        <CardHeader className="space-y-4">
          <Link href="/katalog" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowLeft className="size-4" />
            Kembali ke katalog
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="accent">{getCatalogUnitTypeLabel(unit.type)}</Badge>
            <Badge variant={unit.availableRooms > 0 ? "secondary" : "outline"}>
              {getCatalogAvailabilityLabel(unit)}
            </Badge>
          </div>
          <CardTitle className="font-serif text-4xl leading-tight sm:text-5xl">{unit.name}</CardTitle>
          <CardDescription className="max-w-2xl text-base leading-7">
            {unit.description ??
              "Unit ini sudah dipublikasikan dan siap ditinjau lebih lanjut sebelum booking."}
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
            <p className="mt-2 text-3xl font-semibold text-primary">{formatCatalogPrice(unit.price)}</p>
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
  );
}
