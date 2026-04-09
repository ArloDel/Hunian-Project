import Link from "next/link";

import type { CatalogUnit } from "@/lib/catalog";
import {
  formatCatalogPrice,
  getCatalogUnitTypeLabel,
  getHomeAvailabilityLabel,
} from "@/lib/catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function HomeCatalogSection({ units }: { units: CatalogUnit[] }) {
  return (
    <section id="katalog" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <Badge variant="secondary" className="w-fit">
            Katalog Unit
          </Badge>
          <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">
            Katalog beranda sekarang memakai data live dari database.
          </h2>
          <p className="text-muted-foreground">
            Unit di bawah ini tidak lagi hardcode. Data nama, harga, fasilitas, lokasi, dan status
            ketersediaan diambil langsung dari tabel `units`.
          </p>
        </div>
        <Card className="rounded-[28px]">
          <CardContent className="grid gap-3 p-4 sm:grid-cols-4">
            <Input placeholder="Cari lokasi" defaultValue="Malang" readOnly />
            <Input placeholder="Budget maks." defaultValue="Rp2.500.000" readOnly />
            <Input placeholder="Tipe unit" defaultValue="Kost / Kontrakan" readOnly />
            <Button asChild className="w-full">
              <Link href="/katalog">Lihat katalog lengkap</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {units.length ? (
        <div className="grid gap-5 lg:grid-cols-3">
          {units.map((unit) => (
            <Card key={unit.id} className="overflow-hidden rounded-[30px]">
              <CardContent className="p-0">
                <div className="h-52 bg-gradient-to-br from-[#f6d4a5] via-[#fbead2] to-[#fff8ef] p-6">
                  <div className="flex h-full flex-col justify-between rounded-[24px] border border-white/60 bg-white/30 p-5">
                    <Badge variant="outline" className="w-fit bg-white/70">
                      {getCatalogUnitTypeLabel(unit.type)}
                    </Badge>
                    <div>
                      <p className="text-sm text-muted-foreground">{unit.location}</p>
                      <h3 className="mt-2 text-2xl font-semibold tracking-tight">{unit.name}</h3>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-lg font-semibold">
                      {formatCatalogPrice(unit.price)}/bulan
                    </span>
                    <Badge variant={unit.availableRooms > 0 ? "accent" : "secondary"}>
                      {getHomeAvailabilityLabel(unit)}
                    </Badge>
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {unit.description ??
                      "Unit ini sudah siap untuk ditinjau lebih lanjut dari katalog lengkap."}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {unit.facilities.slice(0, 3).map((facility) => (
                      <Badge key={facility} variant="outline">
                        {facility}
                      </Badge>
                    ))}
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/katalog/${unit.slug}`}>Lihat Detail & Booking</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="rounded-[30px]">
          <CardContent className="space-y-3 p-8">
            <Badge variant="secondary" className="w-fit">
              Belum ada unit
            </Badge>
            <h3 className="text-2xl font-semibold">
              Katalog akan tampil otomatis setelah owner menambah unit.
            </h3>
            <p className="text-muted-foreground">
              Setelah unit dibuat dari dashboard owner, beranda dan halaman katalog lengkap akan
              ikut terisi.
            </p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
