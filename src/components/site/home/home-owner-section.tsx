import { CircleCheckBig } from "lucide-react";

import {
  homeAdvantages,
  homeRoadmap,
  ownerPreviewCards,
  ownerPreviewPayments,
} from "@/components/site/home/home-page.data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function HomeOwnerSection() {
  return (
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
              Menyediakan ringkasan jumlah penghuni, unit kosong, verifikasi pembayaran, dan
              laporan keuangan seperti yang tertulis di PRD.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-3">
              {ownerPreviewCards.map((item) => (
                <div key={item.label} className="rounded-[24px] border border-border bg-white/75 p-5">
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
                {ownerPreviewPayments.map((item) => (
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
              {homeAdvantages.map((item) => (
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
              {homeRoadmap.map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  <item.icon className="mt-1 size-4 text-primary" />
                  <p>{item.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
