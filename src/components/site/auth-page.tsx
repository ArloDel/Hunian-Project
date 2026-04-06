"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LoaderCircle, LogIn, UserPlus } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type AuthMode = "login" | "register";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  phoneNumber: "",
};

export function AuthPage({
  mode,
  nextPath,
}: {
  mode: AuthMode;
  nextPath: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  const isRegister = useMemo(() => mode === "register", [mode]);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async () => {
    setLoading(true);
    setMessage("");

    try {
      if (isRegister) {
        const result = await authClient.signUp.email({
          name: form.name,
          email: form.email,
          password: form.password,
        });

        if (result.error) {
          throw new Error(result.error.message || "Registrasi gagal.");
        }

        if (form.phoneNumber) {
          await fetch("/api/auth/update-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phoneNumber: form.phoneNumber,
            }),
          }).catch(() => null);
        }
      } else {
        const result = await authClient.signIn.email({
          email: form.email,
          password: form.password,
        });

        if (result.error) {
          throw new Error(result.error.message || "Login gagal.");
        }
      }

      router.push(nextPath);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Autentikasi gagal.");
    } finally {
      setLoading(false);
    }
  };

  if (!isPending && session?.user) {
    return (
      <main className="mx-auto flex min-h-[70vh] w-full max-w-4xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <Card className="w-full rounded-[32px]">
          <CardHeader>
            <Badge variant="secondary" className="w-fit">
              Sudah Login
            </Badge>
            <CardTitle className="font-serif text-4xl">Halo, {session.user.name}</CardTitle>
            <CardDescription>
              Anda sudah memiliki sesi aktif. Silakan lanjut ke proses booking atau kembali ke beranda.
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

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid w-full gap-6 lg:grid-cols-[0.95fr_1.05fr]">
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

        <Card className="rounded-[32px]">
          <CardHeader>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={isRegister ? "outline" : "default"}
                size="sm"
                asChild
              >
                <Link href={`/auth?mode=login&next=${encodeURIComponent(nextPath)}`}>
                  <LogIn className="size-4" />
                  Login
                </Link>
              </Button>
              <Button
                variant={isRegister ? "default" : "outline"}
                size="sm"
                asChild
              >
                <Link href={`/auth?mode=register&next=${encodeURIComponent(nextPath)}`}>
                  <UserPlus className="size-4" />
                  Register
                </Link>
              </Button>
            </div>
            <CardTitle className="text-2xl">
              {isRegister ? "Buat akun penyewa" : "Masuk ke akun Anda"}
            </CardTitle>
            <CardDescription>
              {isRegister
                ? "Setelah akun aktif, Anda bisa langsung mengirim booking."
                : "Masuk untuk melihat dan membuat booking dengan akun yang sama."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isRegister ? (
              <Input
                placeholder="Nama lengkap"
                value={form.name}
                onChange={(event) => handleChange("name", event.target.value)}
              />
            ) : null}
            <Input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(event) => handleChange("email", event.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(event) => handleChange("password", event.target.value)}
            />
            {isRegister ? (
              <Input
                placeholder="Nomor WhatsApp"
                value={form.phoneNumber}
                onChange={(event) => handleChange("phoneNumber", event.target.value)}
              />
            ) : null}
            {message ? (
              <div className="rounded-[20px] bg-muted/80 p-4 text-sm">{message}</div>
            ) : null}
            <Button
              className="w-full"
              onClick={submit}
              disabled={
                loading ||
                !form.email ||
                !form.password ||
                (isRegister && !form.name)
              }
            >
              {loading ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Memproses
                </>
              ) : isRegister ? (
                "Daftar Sekarang"
              ) : (
                "Masuk Sekarang"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
