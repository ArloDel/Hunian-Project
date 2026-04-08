import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  Camera,
  ChartColumnIncreasing,
  CircleCheckBig,
  Landmark,
  MapPin,
  MessagesSquare,
  MoonStar,
  ShieldCheck,
  WalletCards,
  Wifi,
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SiteHeader } from "@/components/site/site-header";

const steps = [
  {
    title: "Cari hunian yang pas",
    description:
      "Gunakan filter harga, lokasi, dan tipe kamar untuk menemukan pilihan yang paling cocok dengan kebutuhan harian Anda.",
    icon: MapPin,
  },
  {
    title: "Tentukan check-in dan durasi",
    description:
      "Pilih tanggal masuk, lama sewa, dan lengkapi data diri untuk mengamankan unit sebelum didahului calon penyewa lain.",
    icon: CalendarDays,
  },
  {
    title: "Upload pembayaran dan tunggu verifikasi",
    description:
      "Sistem menyiapkan invoice dan status booking. Admin memverifikasi transfer agar akses kamar dapat dikirim otomatis.",
    icon: WalletCards,
  },
];

const ownerStats = [
  { label: "Unit aktif", value: "48", detail: "31 kost, 17 kontrakan" },
  { label: "Unit kosong", value: "7", detail: "Prioritas promosi minggu ini" },
  { label: "Pendapatan bulan ini", value: "Rp72,4 jt", detail: "+12% dari bulan lalu" },
];

const facilities = [
  { label: "WiFi kencang", icon: Wifi },
  { label: "Keamanan CCTV", icon: ShieldCheck },
  { label: "Galeri foto lengkap", icon: Camera },
  { label: "Booking fleksibel", icon: CalendarDays },
];

function formatCurrency(value: string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function getUnitTypeLabel(type: CatalogUnit["type"]) {
  return type === "kost" ? "Kost" : "Kontrakan";
}

function getAvailabilityLabel(unit: CatalogUnit) {
  if (unit.availableRooms > 1) {
    return `Tersedia ${unit.availableRooms} unit`;
  }

  if (unit.availableRooms === 1) {
    return "Tersisa 1 unit";
  }

  return "Sedang penuh";
}

function getCatalogPreview(units: CatalogUnit[]) {
  return units.slice(0, 3);
}

export function HomePage({ units }: { units: CatalogUnit[] }) {
  const featuredUnits = getCatalogPreview(units);

  return (
    <main className="relative overflow-hidden">
      <section className="hero-grid relative">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8">
          <SiteHeader />

          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div className="space-y-6 py-4">
              <Badge variant="accent" className="w-fit">
                Platform digital untuk kost dan kontrakan
              </Badge>
              <div className="space-y-4">
                <h1 className="max-w-3xl font-serif text-4xl leading-tight tracking-tight text-foreground sm:text-5xl lg:text-7xl">
                  Cari hunian yang rapi, jelas harganya, dan bisa langsung dibooking.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  Hunian Mahmudah membantu calon penyewa melihat unit, mengecek
                  fasilitas, memilih tanggal masuk, lalu menyelesaikan booking tanpa
                  perlu datang berkali-kali ke lokasi.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/booking">
                    Pesan Sekarang
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/katalog">Lihat Semua Katalog</Link>
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {ownerStats.map((stat) => (
                  <Card key={stat.label} className="rounded-[24px]">
                    <CardHeader className="pb-2">
                      <CardDescription>{stat.label}</CardDescription>
                      <CardTitle className="text-2xl">{stat.value}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      {stat.detail}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="overflow-hidden rounded-[32px] border-white/70">
              <CardContent className="p-0">
                <div className="bg-[linear-gradient(140deg,#23493f_0%,#2d6456_35%,#f0c77b_140%)] p-6 text-secondary-foreground sm:p-8">
                  <div className="mb-8 flex items-center justify-between">
                    <Badge className="bg-white/16 text-white" variant="outline">
                      Featured Stay
                    </Badge>
                    <span className="text-sm text-white/80">
                      {featuredUnits[0] ? `${formatCurrency(featuredUnits[0].price)}/bulan` : "Mulai dari Rp1,5 jt"}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-[28px] border border-white/15 bg-white/10 p-5">
                      <p className="text-sm text-white/75">Unit paling dicari minggu ini</p>
                      <h2 className="mt-2 text-2xl font-semibold">
                        {featuredUnits[0]?.name ?? "Katalog sedang disiapkan"}
                      </h2>
                      <p className="mt-3 max-w-sm text-sm leading-6 text-white/75">
                        {featuredUnits[0]?.description ??
                          "Unit akan tampil otomatis dari database begitu katalog aktif di dashboard owner."}
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {facilities.map((facility) => (
                        <div
                          key={facility.label}
                          className="rounded-[24px] border border-white/15 bg-white/10 p-4"
                        >
                          <facility.icon className="mb-3 size-5" />
                          <p className="text-sm font-medium">{facility.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
                  <div>
                    <p className="text-sm text-muted-foreground">Status katalog</p>
                    <p className="mt-2 text-xl font-semibold">{units.length} unit dipublikasikan</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Notifikasi aktif</p>
                    <p className="mt-2 text-xl font-semibold">WA dan email H-5 jatuh tempo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

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
              Unit di bawah ini tidak lagi hardcode. Data nama, harga, fasilitas, lokasi,
              dan status ketersediaan diambil langsung dari tabel `units`.
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

        {featuredUnits.length ? (
          <div className="grid gap-5 lg:grid-cols-3">
            {featuredUnits.map((unit) => (
              <Card key={unit.id} className="overflow-hidden rounded-[30px]">
                <CardContent className="p-0">
                  <div className="h-52 bg-gradient-to-br from-[#f6d4a5] via-[#fbead2] to-[#fff8ef] p-6">
                    <div className="flex h-full flex-col justify-between rounded-[24px] border border-white/60 bg-white/30 p-5">
                      <Badge variant="outline" className="w-fit bg-white/70">
                        {getUnitTypeLabel(unit.type)}
                      </Badge>
                      <div>
                        <p className="text-sm text-muted-foreground">{unit.location}</p>
                        <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                          {unit.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-lg font-semibold">
                        {formatCurrency(unit.price)}/bulan
                      </span>
                      <Badge variant={unit.availableRooms > 0 ? "accent" : "secondary"}>
                        {getAvailabilityLabel(unit)}
                      </Badge>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {unit.description ?? "Unit ini sudah siap untuk ditinjau lebih lanjut dari katalog lengkap."}
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
              <h3 className="text-2xl font-semibold">Katalog akan tampil otomatis setelah owner menambah unit.</h3>
              <p className="text-muted-foreground">
                Setelah unit dibuat dari dashboard owner, beranda dan halaman katalog lengkap akan ikut terisi.
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      <section id="booking" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="rounded-[32px] border border-[#2f5d50] bg-[linear-gradient(160deg,#1f4339_0%,#275448_100%)] text-secondary-foreground shadow-[0_24px_80px_rgba(17,45,37,0.18)]">
            <CardHeader>
              <Badge className="w-fit border-white/20 bg-[#315f52] text-white" variant="outline">
                User Journey
              </Badge>
              <CardTitle className="font-serif text-3xl leading-tight">
                Alur booking yang sederhana dari cari unit sampai konfirmasi kamar.
              </CardTitle>
              <CardDescription className="text-white/75">
                Struktur ini sudah mengikuti PRD fase MVP: katalog online, akun user,
                booking manual, dan upload bukti transfer.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-[24px] border border-[#3d7363] bg-[#315f52] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-[#3b6e5f]">
                      <step.icon className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                        Step {index + 1}
                      </p>
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm leading-6 text-white/75">{step.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-[32px]">
            <CardHeader>
              <Badge variant="accent" className="w-fit">
                Quick Booking
              </Badge>
              <CardTitle className="text-2xl">Form simulasi check-in</CardTitle>
              <CardDescription>
                Frontend ini menyiapkan area booking yang nantinya bisa dihubungkan ke
                autentikasi, kalender, dan status pembayaran.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input placeholder="Nama lengkap" />
                <Input placeholder="Email aktif" type="email" />
                <Input placeholder="No. WhatsApp" />
                <Input placeholder="Tanggal masuk" type="date" />
                <Input placeholder="Durasi sewa" defaultValue="6 bulan" />
                <Input
                  placeholder="Pilihan unit"
                  defaultValue={featuredUnits[0]?.name ?? "Pilih unit dari katalog"}
                />
              </div>
              <Card className="rounded-[24px] border-dashed">
                <CardContent className="grid gap-4 p-5 sm:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Biaya sewa</p>
                    <p className="mt-2 text-lg font-semibold">Rp11.100.000</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Biaya admin</p>
                    <p className="mt-2 text-lg font-semibold">Rp150.000</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total pembayaran</p>
                    <p className="mt-2 text-lg font-semibold text-primary">Rp11.250.000</p>
                  </div>
                </CardContent>
              </Card>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild className="flex-1">
                  <Link href="/booking">Lanjutkan Booking</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/katalog">Cek Katalog Lengkap</Link>
                </Button>
              </div>
              <div className="rounded-[24px] bg-muted/75 p-4 text-sm leading-6 text-muted-foreground">
                Bukti transfer, foto KTP, dan verifikasi admin dapat diletakkan di tahap
                berikutnya saat backend mulai dihubungkan.
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="owner" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="rounded-[32px]">
            <CardHeader>
              <Badge variant="secondary" className="w-fit">
                Owner Dashboard
              </Badge>
              <CardTitle className="font-serif text-3xl">
                Ringkas, informatif, dan siap untuk operasional harian pemilik.
              </CardTitle>
              <CardDescription>
                Menyediakan ringkasan jumlah penghuni, unit kosong, verifikasi pembayaran,
                dan laporan keuangan seperti yang tertulis di PRD.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    label: "Penghuni aktif",
                    value: "41",
                    icon: Building2,
                  },
                  {
                    label: "Pembayaran pending",
                    value: "6",
                    icon: Landmark,
                  },
                  {
                    label: "Revenue tahunan",
                    value: "Rp814 jt",
                    icon: ChartColumnIncreasing,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-border bg-white/75 p-5"
                  >
                    <item.icon className="mb-3 size-5 text-primary" />
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-[28px] border border-border bg-white/75 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Verifikasi pembayaran terbaru</p>
                    <p className="text-sm text-muted-foreground">
                      Booking menunggu pengecekan bukti transfer
                    </p>
                  </div>
                  <Badge variant="accent">Perlu tindak lanjut</Badge>
                </div>
                <div className="space-y-3">
                  {[
                    "Kamar B-12 • Masuk 10 April 2026 • Transfer BCA",
                    "Kontrakan A2 • Perpanjangan 12 bulan • Upload bukti jam 08:15",
                    "Kamar C-07 • Booking baru • Total Rp3.100.000",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between gap-3 rounded-[22px] border border-border bg-background/80 px-4 py-3"
                    >
                      <p className="text-sm">{item}</p>
                      <CircleCheckBig className="size-4 text-secondary" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-5">
            <Card className="rounded-[32px]">
              <CardHeader>
                <CardTitle className="text-xl">Keunggulan yang langsung terasa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "Informasi unit transparan",
                    text: "Foto, fasilitas, harga, dan stok ditampilkan jelas agar penyewa tidak perlu menebak-nebak.",
                    icon: BadgeCheck,
                  },
                  {
                    title: "Pengingat pembayaran otomatis",
                    text: "Area notifikasi sudah disiapkan untuk email dan WhatsApp sebelum masa sewa habis.",
                    icon: MessagesSquare,
                  },
                  {
                    title: "Aman untuk data identitas",
                    text: "Struktur frontend memperhitungkan alur upload KTP yang nantinya bisa dilengkapi enkripsi di backend.",
                    icon: ShieldCheck,
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 rounded-[24px] bg-muted/55 p-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white">
                      <item.icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.text}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card id="faq" className="rounded-[32px] bg-[linear-gradient(135deg,#fff9ef_0%,#ffe8c8_100%)]">
              <CardHeader>
                <Badge variant="accent" className="w-fit">
                  Siap untuk tahap berikutnya
                </Badge>
                <CardTitle className="text-xl">Roadmap frontend yang sudah diantisipasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
                <div className="flex items-start gap-3">
                  <MoonStar className="mt-1 size-4 text-primary" />
                  <p>Fase 1: katalog, akun user, booking manual, dan upload bukti transfer.</p>
                </div>
                <div className="flex items-start gap-3">
                  <WalletCards className="mt-1 size-4 text-primary" />
                  <p>Fase 2: integrasi payment gateway, virtual account, e-wallet, dan reminder otomatis.</p>
                </div>
                <div className="flex items-start gap-3">
                  <MessagesSquare className="mt-1 size-4 text-primary" />
                  <p>Fase 3: pelaporan komplain atau maintenance langsung dari dashboard penghuni.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-10 sm:px-6 lg:px-8">
        <Separator />
        <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Hunian Mahmudah dibuat sebagai fondasi frontend untuk platform pemesanan kost yang modern.</p>
          <div className="flex gap-4">
            <Link href="/katalog">Katalog</Link>
            <Link href="/booking">Booking</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
