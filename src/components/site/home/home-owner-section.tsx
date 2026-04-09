import { homeAdvantages, homeRoadmap } from "@/components/site/home/home-page.data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HomeOwnerSection() {
  return (
    <section id="owner" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-5 lg:grid-cols-2">
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
    </section>
  );
}
