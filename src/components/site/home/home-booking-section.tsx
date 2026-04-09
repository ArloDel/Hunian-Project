import Link from "next/link";

import type { CatalogUnit } from "@/lib/catalog";
import { homeSteps, quickBookingSummary } from "@/components/site/home/home-page.data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function HomeBookingSection({ featuredUnit }: { featuredUnit?: CatalogUnit }) {
  return (
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
              Struktur ini sudah mengikuti PRD fase MVP: katalog online, akun user, booking
              manual, dan upload bukti transfer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {homeSteps.map((step, index) => (
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
              Frontend ini menyiapkan area booking yang nantinya bisa dihubungkan ke autentikasi,
              kalender, dan status pembayaran.
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
                defaultValue={featuredUnit?.name ?? "Pilih unit dari katalog"}
              />
            </div>
            <Card className="rounded-[24px] border-dashed">
              <CardContent className="grid gap-4 p-5 sm:grid-cols-3">
                {quickBookingSummary.map((item) => (
                  <div key={item.label}>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="mt-2 text-lg font-semibold">{item.value}</p>
                  </div>
                ))}
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
              Bukti transfer, foto KTP, dan verifikasi admin dapat diletakkan di tahap berikutnya
              saat backend mulai dihubungkan.
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
