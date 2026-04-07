import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { createId } from "@paralleldrive/cuid2";

import { ApiError } from "@/lib/api";

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

export const uploadKinds = ["ktp", "payment-proof", "unit-image"] as const;

export type UploadKind = (typeof uploadKinds)[number];

function getExtension(filename: string) {
  const ext = path.extname(filename).toLowerCase();

  if (!ext) {
    return ".bin";
  }

  return ext;
}

export async function saveUploadedFile(file: File, kind: UploadKind) {
  if (file.size <= 0) {
    throw new ApiError(400, "File upload tidak boleh kosong.");
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    throw new ApiError(400, "Ukuran file maksimal 5 MB.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const ext = getExtension(file.name);
  const filename = `${Date.now()}-${createId()}${ext}`;
  const relativeDir = path.join("uploads", kind);
  const absoluteDir = path.join(process.cwd(), "public", relativeDir);
  const absoluteFilePath = path.join(absoluteDir, filename);

  await mkdir(absoluteDir, { recursive: true });
  await writeFile(absoluteFilePath, buffer);

  return {
    url: `/${path.posix.join("uploads", kind, filename)}`,
    filename,
    size: file.size,
    mimeType: file.type || "application/octet-stream",
  };
}
