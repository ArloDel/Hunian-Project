import { type NextRequest } from "next/server";
import { z } from "zod";

import { handleApiError, json, requireSession } from "@/lib/api";
import { saveUploadedFile, uploadKinds } from "@/lib/upload";

const uploadSchema = z.object({
  kind: z.enum(uploadKinds),
});

export async function POST(request: NextRequest) {
  try {
    await requireSession(request);
    const formData = await request.formData();
    const parsed = uploadSchema.parse({
      kind: formData.get("kind"),
    });
    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw new Error("File tidak ditemukan.");
    }

    const uploaded = await saveUploadedFile(file, parsed.kind);

    return json({
      message: "File berhasil diunggah.",
      data: uploaded,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
