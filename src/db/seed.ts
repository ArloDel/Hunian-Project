import "dotenv/config";

import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";

import { db, pool } from "@/db";
import { accounts, bookings, units, users } from "@/db/schema";

async function upsertUser(input: {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: "tenant" | "owner";
}) {
  const existing = await db.query.users.findFirst({
    where: eq(users.email, input.email),
  });

  if (existing) {
    await db
      .update(users)
      .set({
        name: input.name,
        phoneNumber: input.phoneNumber,
        role: input.role,
        emailVerified: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, existing.id));

    const credentialAccount = await db.query.accounts.findFirst({
      where: eq(accounts.userId, existing.id),
    });

    if (!credentialAccount) {
      await db.insert(accounts).values({
        id: createId(),
        accountId: existing.id,
        providerId: "credential",
        userId: existing.id,
        password: await hashPassword(input.password),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return existing.id;
  }

  const userId = createId();
  const passwordHash = await hashPassword(input.password);

  await db.insert(users).values({
    id: userId,
    name: input.name,
    email: input.email,
    emailVerified: true,
    image: null,
    phoneNumber: input.phoneNumber,
    ktpImageUrl: null,
    role: input.role,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await db.insert(accounts).values({
    id: createId(),
    accountId: userId,
    providerId: "credential",
    userId,
    password: passwordHash,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return userId;
}

async function upsertUnit(input: {
  name: string;
  slug: string;
  type: "kost" | "kontrakan";
  location: string;
  address: string;
  description: string;
  price: number;
  stock: number;
  availableRooms: number;
  facilities: string[];
  imageUrls: string[];
  createdByUserId: string;
}) {
  const existing = await db.query.units.findFirst({
    where: eq(units.slug, input.slug),
  });

  if (existing) {
    await db
      .update(units)
      .set({
        name: input.name,
        type: input.type,
        location: input.location,
        address: input.address,
        description: input.description,
        price: input.price.toFixed(2),
        stock: input.stock,
        availableRooms: input.availableRooms,
        facilities: JSON.stringify(input.facilities),
        imageUrls: JSON.stringify(input.imageUrls),
        isPublished: true,
        createdByUserId: input.createdByUserId,
        updatedAt: new Date(),
      })
      .where(eq(units.id, existing.id));

    return existing.id;
  }

  const unitId = createId();

  await db.insert(units).values({
    id: unitId,
    name: input.name,
    slug: input.slug,
    type: input.type,
    location: input.location,
    address: input.address,
    description: input.description,
    price: input.price.toFixed(2),
    stock: input.stock,
    availableRooms: input.availableRooms,
    facilities: JSON.stringify(input.facilities),
    imageUrls: JSON.stringify(input.imageUrls),
    isPublished: true,
    createdByUserId: input.createdByUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return unitId;
}

async function upsertBooking(input: {
  bookingCode: string;
  userId: string;
  unitId: string;
  checkInDate: Date;
  durationMonths: number;
  totalPrice: number;
  status: "pending" | "confirmed";
  paymentStatus: "proof_uploaded" | "verified";
  roomNumber?: string;
  verifiedByUserId?: string;
}) {
  const existing = await db.query.bookings.findFirst({
    where: eq(bookings.bookingCode, input.bookingCode),
  });

  if (existing) {
    return existing.id;
  }

  const bookingId = createId();

  await db.insert(bookings).values({
    id: bookingId,
    bookingCode: input.bookingCode,
    userId: input.userId,
    unitId: input.unitId,
    checkInDate: input.checkInDate,
    durationMonths: input.durationMonths,
    totalPrice: input.totalPrice.toFixed(2),
    status: input.status,
    paymentStatus: input.paymentStatus,
    paymentProofUrl: "https://example.com/proof-transfer-demo.jpg",
    notes: "Seed demo booking",
    roomNumber: input.roomNumber ?? null,
    verifiedAt: input.paymentStatus === "verified" ? new Date() : null,
    verifiedByUserId: input.verifiedByUserId ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return bookingId;
}

async function main() {
  const ownerId = await upsertUser({
    name: "Owner Mahmudah",
    email: "owner@hunian.test",
    password: "Owner12345!",
    phoneNumber: "081234567890",
    role: "owner",
  });

  const tenantId = await upsertUser({
    name: "Nadia Penyewa",
    email: "tenant@hunian.test",
    password: "Tenant12345!",
    phoneNumber: "089876543210",
    role: "tenant",
  });

  const kostId = await upsertUnit({
    name: "Kost Anggrek Premium",
    slug: "kost-anggrek-premium",
    type: "kost",
    location: "Lowokwaru, Malang",
    address: "Jl. Anggrek No. 12, Lowokwaru, Malang",
    description: "Kost nyaman dekat kampus dengan akses 24 jam dan WiFi cepat.",
    price: 1850000,
    stock: 12,
    availableRooms: 3,
    facilities: ["WiFi 100 Mbps", "AC", "KM dalam", "Laundry mingguan"],
    imageUrls: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858",
    ],
    createdByUserId: ownerId,
  });

  const kontrakanId = await upsertUnit({
    name: "Studio Mahmudah Residence",
    slug: "studio-mahmudah-residence",
    type: "kontrakan",
    location: "Sumbersari, Malang",
    address: "Jl. Sumbersari Raya No. 18, Malang",
    description: "Kontrakan mini dengan pantry dan area kerja untuk pekerja muda.",
    price: 2700000,
    stock: 4,
    availableRooms: 1,
    facilities: ["Pantry", "Parkir motor", "Smart lock", "Area kerja"],
    imageUrls: [
      "https://images.unsplash.com/photo-1494526585095-c41746248156",
    ],
    createdByUserId: ownerId,
  });

  await upsertBooking({
    bookingCode: "HM-DEMO001",
    userId: tenantId,
    unitId: kostId,
    checkInDate: new Date("2026-04-10"),
    durationMonths: 6,
    totalPrice: 11100000,
    status: "pending",
    paymentStatus: "proof_uploaded",
  });

  await upsertBooking({
    bookingCode: "HM-DEMO002",
    userId: tenantId,
    unitId: kontrakanId,
    checkInDate: new Date("2026-05-01"),
    durationMonths: 12,
    totalPrice: 32400000,
    status: "confirmed",
    paymentStatus: "verified",
    roomNumber: "A2",
    verifiedByUserId: ownerId,
  });

  console.log("Seed selesai.");
  console.log("Owner demo: owner@hunian.test / Owner12345!");
  console.log("Tenant demo: tenant@hunian.test / Tenant12345!");
}

main()
  .catch((error) => {
    console.error("Seed gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    const owner = await db.query.users.findFirst({
      where: eq(users.email, "owner@hunian.test"),
    }).catch(() => null);

    if (owner) {
      console.log("Data demo siap digunakan.");
    }

    await pool.end();
  });
