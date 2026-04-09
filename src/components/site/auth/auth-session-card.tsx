import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthSessionCard({ userName, nextPath }: { userName: string; nextPath: string }) {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-4xl items-center px-4 py-8 sm:px-6 lg:px-8">
      <Card className="w-full rounded-[32px]">
        <CardHeader>
          <Badge variant="secondary" className="w-fit">
            Sudah Login
          </Badge>
          <CardTitle className="font-serif text-4xl">Halo, {userName}</CardTitle>
          <CardDescription>
            Anda sudah memiliki sesi aktif. Silakan lanjut ke proses booking atau kembali ke
            beranda.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href={nextPath}>Lanjutkan</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Kembali ke beranda</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
