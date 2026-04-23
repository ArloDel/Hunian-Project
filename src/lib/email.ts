import { getEnv } from "@/lib/env";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

type SendEmailResult =
  | { status: "sent"; id: string | null }
  | { status: "skipped"; reason: string };

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const env = getEnv();

  if (!env.RESEND_API_KEY) {
    console.warn(`[email] skipped sending "${input.subject}" because RESEND_API_KEY is empty.`);
    return { status: "skipped", reason: "RESEND_API_KEY missing" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.NOTIFICATION_FROM_EMAIL,
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text || stripHtml(input.html),
    }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message ?? `Mengirim email gagal dengan status ${response.status}.`);
  }

  const payload = (await response.json()) as { id?: string };

  return {
    status: "sent",
    id: payload.id ?? null,
  };
}
