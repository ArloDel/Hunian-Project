import { z } from "zod";

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
  imageUrls: z.array(z.string().url()).default([]),
  isPublished: z.coerce.boolean().default(true),
});

export const updateUnitSchema = createUnitSchema.partial();

export const createBookingSchema = z.object({
  unitId: z.string().min(1),
  checkInDate: z.string().date(),
  durationMonths: z.coerce.number().int().min(1).max(24),
  notes: z.string().max(2000).optional().nullable(),
  paymentProofUrl: z.string().url().optional().nullable(),
});

export const updateBookingSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]).optional(),
  paymentStatus: z
    .enum(["unpaid", "proof_uploaded", "verified", "rejected"])
    .optional(),
  paymentProofUrl: z.string().url().optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  roomNumber: z.string().max(50).optional().nullable(),
});
