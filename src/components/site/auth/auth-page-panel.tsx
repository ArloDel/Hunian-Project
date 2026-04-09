import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthPagePanel() {
  return (
    <Card className="rounded-[32px] bg-secondary text-secondary-foreground">
      <CardHeader>
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/70">
          <ArrowLeft className="size-4" />
          Kembali ke beranda
        </Link>
        <Badge variant="outline" className="w-fit bg-white/10 text-white">
          Akun Penyewa
        </Badge>
        <CardTitle className="font-serif text-4xl">
          Masuk untuk mulai booking, atau daftar dalam beberapa langkah.
        </CardTitle>
        <CardDescription className="text-white/70">
          Halaman ini sudah terhubung ke Better Auth dan session route handler di backend.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="rounded-[22px] bg-white/10 p-4">
          Registrasi menggunakan email dan password.
        </div>
        <div className="rounded-[22px] bg-white/10 p-4">
          Session disimpan otomatis untuk proses booking berikutnya.
        </div>
        <div className="rounded-[22px] bg-white/10 p-4">
          Data profil seperti nomor HP bisa dipakai ulang saat booking.
        </div>
      </CardContent>
    </Card>
  );
}
