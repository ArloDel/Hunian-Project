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

const featuredUnits = [
  {
    name: "Kost Anggrek Premium",
    type: "Kost Putri",
    location: "Lowokwaru, Malang",
    price: "Rp1.850.000/bulan",
    status: "Tersedia 3 kamar",
    highlight: "WiFi 100 Mbps, AC, KM dalam, laundry mingguan",
    color: "from-[#f6d4a5] via-[#fbead2] to-[#fff8ef]",
  },
  {
    name: "Studio Mahmudah Residence",
    type: "Kontrakan Mini",
    location: "Sumbersari, Malang",
    price: "Rp2.700.000/bulan",
    status: "Tersedia 1 unit",
    highlight: "Parkir motor luas, pantry, smart lock, area kerja",
    color: "from-[#b9ddd0] via-[#e7f5ef] to-[#fff9ee]",
  },
  {
    name: "Kamar Executive Aluna",
    type: "Kost Campur",
    location: "Dinoyo, Malang",
    price: "Rp1.550.000/bulan",
    status: "Booking ramai minggu ini",
    highlight: "Akses 24 jam, kasur queen, water heater, CCTV",
    color: "from-[#d9c1ff] via-[#f6edff] to-[#fff8ef]",
  },
];

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

export function HomePage() {
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
                  <Link href="/owner">Lihat Dashboard Owner</Link>
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
                    <span className="text-sm text-white/80">Mulai dari Rp1,5 jt</span>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-[28px] border border-white/15 bg-white/10 p-5">
                      <p className="text-sm text-white/75">Unit paling dicari minggu ini</p>
                      <h2 className="mt-2 text-2xl font-semibold">
                        Kost Anggrek Premium
                      </h2>
                      <p className="mt-3 max-w-sm text-sm leading-6 text-white/75">
                        Cocok untuk mahasiswa dan pekerja yang ingin akses cepat ke
                        kampus, kuliner, dan transportasi kota.
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
                    <p className="text-sm text-muted-foreground">Status booking</p>
                    <p className="mt-2 text-xl font-semibold">17 check-in pekan ini</p>
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
              Tampilan katalog yang menenangkan, tapi tetap fokus ke keputusan booking.
            </h2>
            <p className="text-muted-foreground">
              Desain frontend ini dibuat mobile-first, transparan untuk harga dan
              fasilitas, serta sudah menyiapkan blok informasi yang nanti mudah dihubungkan
              ke backend dan payment flow.
            </p>
          </div>
          <Card className="rounded-[28px]">
            <CardContent className="grid gap-3 p-4 sm:grid-cols-4">
              <Input placeholder="Cari lokasi" defaultValue="Malang" />
              <Input placeholder="Budget maks." defaultValue="Rp2.500.000" />
              <Input placeholder="Tipe unit" defaultValue="Kost / Kontrakan" />
              <Button className="w-full">Terapkan Filter</Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {featuredUnits.map((unit) => (
            <Card key={unit.name} className="overflow-hidden rounded-[30px]">
              <CardContent className="p-0">
                <div className={`h-52 bg-gradient-to-br ${unit.color} p-6`}>
                  <div className="flex h-full flex-col justify-between rounded-[24px] border border-white/60 bg-white/30 p-5">
                    <Badge variant="outline" className="w-fit bg-white/70">
                      {unit.type}
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
                    <span className="text-lg font-semibold">{unit.price}</span>
                    <Badge variant="accent">{unit.status}</Badge>
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{unit.highlight}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">WiFi</Badge>
                    <Badge variant="outline">AC</Badge>
                    <Badge variant="outline">Kamar mandi dalam</Badge>
                  </div>
                  <Button asChild className="w-full">
                    <Link href="/booking">Lihat Detail & Booking</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="booking" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="rounded-[32px] bg-secondary text-secondary-foreground">
            <CardHeader>
              <Badge className="w-fit bg-white/10 text-white" variant="outline">
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
                <div key={step.title} className="rounded-[24px] border border-white/12 bg-white/8 p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-white/12">
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
                <Input placeholder="Pilihan unit" defaultValue="Kost Anggrek Premium" />
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
                <Button className="flex-1">Lanjutkan Booking</Button>
                <Button variant="outline" className="flex-1">
                  Simpan Sebagai Draft
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
            <Link href="/booking">Booking</Link>
            <Link href="/owner">Dashboard Owner</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
