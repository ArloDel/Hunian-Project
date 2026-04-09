"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { AuthFormCard } from "@/components/site/auth/auth-form-card";
import { AuthPagePanel } from "@/components/site/auth/auth-page-panel";
import { AuthSessionCard } from "@/components/site/auth/auth-session-card";
import type { AuthMode } from "@/components/site/auth/auth-page.types";
import { emptyAuthForm } from "@/components/site/auth/auth-page.types";

export function AuthPage({
  mode,
  nextPath,
}: {
  mode: AuthMode;
  nextPath: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState(emptyAuthForm);
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
    return <AuthSessionCard userName={session.user.name} nextPath={nextPath} />;
  }

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid w-full gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <AuthPagePanel />
        <AuthFormCard
          mode={mode}
          nextPath={nextPath}
          form={form}
          message={message}
          loading={loading}
          onFieldChange={handleChange}
          onSubmit={submit}
        />
      </div>
    </main>
  );
}
