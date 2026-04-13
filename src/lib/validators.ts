import { z } from "zod";

function isValidUploadUrl(value: string) {
  if (value.startsWith("/uploads/")) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const uploadUrlSchema = z.string().refine(isValidUploadUrl, {
  message: "URL file tidak valid.",
});

export const createUnitSchema = z.object({
  name: z.string().min(3).max(160),
  type: z.enum(["kost", "kontrakan"]),
  location: z.string().min(3).max(180),
  address: z.string().max(1000).optional().nullable(),
  description: z.string().max(4000).optional().nullable(),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().min(0),
  availableRooms: z.coerce.number().int().min(0),
  facilities: z.array(z.string().min(1)).min(1),
  imageUrls: z.array(uploadUrlSchema).default([]),
  isPublished: z.coerce.boolean().default(true),
});

export const updateUnitSchema = createUnitSchema.partial();

export const createBookingSchema = z.object({
  unitId: z.string().min(1),
  checkInDate: z.string().date(),
  durationMonths: z.coerce.number().int().min(1).max(24),
  paymentMethod: z.enum(["manual_transfer", "xendit"]).default("manual_transfer"),
  notes: z.string().max(2000).optional().nullable(),
  paymentProofUrl: uploadUrlSchema.optional().nullable(),
});

export const updateBookingSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]).optional(),
  paymentMethod: z.enum(["manual_transfer", "xendit"]).optional(),
  paymentStatus: z
    .enum(["unpaid", "proof_uploaded", "verified", "rejected", "expired"])
    .optional(),
  paymentProofUrl: uploadUrlSchema.optional().nullable(),
  paymentProvider: z.string().max(50).optional().nullable(),
  paymentReference: z.string().max(100).optional().nullable(),
  paymentExternalId: z.string().max(100).optional().nullable(),
  paymentUrl: z.string().url().optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  roomNumber: z.string().max(50).optional().nullable(),
});

export const updateUserProfileSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  phoneNumber: z.string().max(32).optional().nullable(),
  ktpImageUrl: uploadUrlSchema.optional().nullable(),
});
