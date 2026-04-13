import { ApiError } from "@/lib/api";
import { getEnv } from "@/lib/env";

type CreateXenditInvoiceInput = {
  externalId: string;
  amount: number;
  payerEmail: string;
  description: string;
  successRedirectUrl: string;
  failureRedirectUrl: string;
};

type XenditInvoiceResponse = {
  id: string;
  external_id: string;
  status: string;
  invoice_url: string;
};

function getAuthorizationHeader(secretKey: string) {
  return `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`;
}

export function getAppBaseUrl() {
  const env = getEnv();
  return env.NEXT_PUBLIC_APP_URL || env.BETTER_AUTH_URL;
}

export function assertXenditConfigured() {
  const env = getEnv();

  if (!env.XENDIT_SECRET_KEY) {
    throw new ApiError(500, "Xendit belum dikonfigurasi di server.");
  }

  return env;
}

export async function createXenditInvoice(input: CreateXenditInvoiceInput) {
  const env = assertXenditConfigured();

  const response = await fetch("https://api.xendit.co/v2/invoices", {
    method: "POST",
    headers: {
      Authorization: getAuthorizationHeader(env.XENDIT_SECRET_KEY),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      external_id: input.externalId,
      amount: input.amount,
      payer_email: input.payerEmail,
      description: input.description,
      currency: "IDR",
      success_redirect_url: input.successRedirectUrl,
      failure_redirect_url: input.failureRedirectUrl,
    }),
  });

  const payload = (await response.json()) as Partial<XenditInvoiceResponse> & {
    message?: string;
    error_code?: string;
  };

  if (!response.ok || !payload.id || !payload.invoice_url) {
    throw new ApiError(
      502,
      payload.message || payload.error_code || "Gagal membuat invoice Xendit.",
    );
  }

  return {
    id: payload.id,
    externalId: payload.external_id ?? input.externalId,
    status: payload.status ?? "PENDING",
    invoiceUrl: payload.invoice_url,
  };
}

export function verifyXenditWebhook(headers: Headers) {
  const env = getEnv();
  const token = headers.get("x-callback-token");

  if (!env.XENDIT_WEBHOOK_TOKEN || token !== env.XENDIT_WEBHOOK_TOKEN) {
    throw new ApiError(401, "Webhook Xendit tidak valid.");
  }
}
