import { relations, sql } from "drizzle-orm";
import {
  boolean,
  date,
  datetime,
  decimal,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const userRoleValues = ["tenant", "owner"] as const;
export const unitTypeValues = ["kost", "kontrakan"] as const;
export const bookingStatusValues = [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
] as const;
export const paymentStatusValues = [
  "unpaid",
  "proof_uploaded",
  "verified",
  "rejected",
] as const;

export const users = mysqlTable(
  "user",
  {
    id: varchar("id", { length: 191 }).primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    phoneNumber: varchar("phone_number", { length: 32 }),
    ktpImageUrl: text("ktp_image_url"),
    role: mysqlEnum("role", userRoleValues).notNull().default("tenant"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .onUpdateNow(),
  },
  (table) => ({
    emailUnique: uniqueIndex("user_email_unique").on(table.email),
    roleIdx: index("user_role_idx").on(table.role),
  }),
);

export const sessions = mysqlTable(
  "session",
  {
    id: varchar("id", { length: 191 }).primaryKey(),
    expiresAt: datetime("expires_at").notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .onUpdateNow(),
    ipAddress: varchar("ip_address", { length: 255 }),
    userAgent: text("user_agent"),
    userId: varchar("user_id", { length: 191 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => ({
    tokenUnique: uniqueIndex("session_token_unique").on(table.token),
    userIdx: index("session_user_idx").on(table.userId),
  }),
);

export const accounts = mysqlTable(
  "account",
  {
    id: varchar("id", { length: 191 }).primaryKey(),
    accountId: varchar("account_id", { length: 255 }).notNull(),
    providerId: varchar("provider_id", { length: 255 }).notNull(),
    userId: varchar("user_id", { length: 191 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: datetime("access_token_expires_at"),
    refreshTokenExpiresAt: datetime("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .onUpdateNow(),
  },
  (table) => ({
    providerAccountUnique: uniqueIndex("account_provider_account_unique").on(
      table.providerId,
      table.accountId,
    ),
    accountUserIdx: index("account_user_idx").on(table.userId),
  }),
);

export const verifications = mysqlTable(
  "verification",
  {
    id: varchar("id", { length: 191 }).primaryKey(),
    identifier: varchar("identifier", { length: 255 }).notNull(),
    value: text("value").notNull(),
    expiresAt: datetime("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .onUpdateNow(),
  },
  (table) => ({
    identifierIdx: index("verification_identifier_idx").on(table.identifier),
  }),
);

export const units = mysqlTable(
  "units",
  {
    id: varchar("id", { length: 191 }).primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    slug: varchar("slug", { length: 180 }).notNull(),
    type: mysqlEnum("type", unitTypeValues).notNull(),
    location: varchar("location", { length: 180 }).notNull(),
    address: text("address"),
    description: text("description"),
    price: decimal("price", { precision: 12, scale: 2 }).notNull(),
    stock: int("stock").notNull().default(0),
    availableRooms: int("available_rooms").notNull().default(0),
    facilities: text("facilities").notNull(),
    imageUrls: text("image_urls").notNull(),
    isPublished: boolean("is_published").notNull().default(true),
    createdByUserId: varchar("created_by_user_id", { length: 191 }).references(
      () => users.id,
      { onDelete: "set null" },
    ),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .onUpdateNow(),
  },
  (table) => ({
    slugUnique: uniqueIndex("units_slug_unique").on(table.slug),
    typeIdx: index("units_type_idx").on(table.type),
    locationIdx: index("units_location_idx").on(table.location),
    publishedIdx: index("units_published_idx").on(table.isPublished),
  }),
);

export const bookings = mysqlTable(
  "bookings",
  {
    id: varchar("id", { length: 191 }).primaryKey(),
    bookingCode: varchar("booking_code", { length: 32 }).notNull(),
    userId: varchar("user_id", { length: 191 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    unitId: varchar("unit_id", { length: 191 })
      .notNull()
      .references(() => units.id, { onDelete: "cascade" }),
    checkInDate: date("check_in_date").notNull(),
    durationMonths: int("duration_months").notNull(),
    totalPrice: decimal("total_price", { precision: 12, scale: 2 }).notNull(),
    status: mysqlEnum("status", bookingStatusValues).notNull().default("pending"),
    paymentStatus: mysqlEnum("payment_status", paymentStatusValues)
      .notNull()
      .default("unpaid"),
    paymentProofUrl: text("payment_proof_url"),
    notes: text("notes"),
    roomNumber: varchar("room_number", { length: 50 }),
    reminderSentAt: datetime("reminder_sent_at"),
    verifiedAt: datetime("verified_at"),
    verifiedByUserId: varchar("verified_by_user_id", { length: 191 }).references(
      () => users.id,
      { onDelete: "set null" },
    ),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .onUpdateNow(),
  },
  (table) => ({
    bookingCodeUnique: uniqueIndex("bookings_code_unique").on(table.bookingCode),
    bookingUserIdx: index("bookings_user_idx").on(table.userId),
    bookingUnitIdx: index("bookings_unit_idx").on(table.unitId),
    bookingStatusIdx: index("bookings_status_idx").on(table.status),
    bookingPaymentStatusIdx: index("bookings_payment_status_idx").on(
      table.paymentStatus,
    ),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  bookings: many(bookings),
  managedUnits: many(units),
  verifiedBookings: many(bookings, { relationName: "bookingVerifier" }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const unitsRelations = relations(units, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [units.createdByUserId],
    references: [users.id],
  }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  unit: one(units, {
    fields: [bookings.unitId],
    references: [units.id],
  }),
  verifiedBy: one(users, {
    relationName: "bookingVerifier",
    fields: [bookings.verifiedByUserId],
    references: [users.id],
  }),
}));

export const authSchema = {
  user: users,
  session: sessions,
  account: accounts,
  verification: verifications,
};

export const schema = {
  ...authSchema,
  units,
  bookings,
};

export type UserRole = (typeof userRoleValues)[number];
export type UnitType = (typeof unitTypeValues)[number];
export type BookingStatus = (typeof bookingStatusValues)[number];
export type PaymentStatus = (typeof paymentStatusValues)[number];

export const dashboardAggregates = {
  activeTenants: sql<number>`count(distinct ${bookings.userId})`,
  emptyUnits: sql<number>`sum(case when ${units.availableRooms} > 0 then 1 else 0 end)`,
  monthlyRevenue: sql<string>`coalesce(sum(case when ${bookings.paymentStatus} = 'verified' then ${bookings.totalPrice} else 0 end), 0)`,
  pendingPayments: sql<number>`sum(case when ${bookings.paymentStatus} in ('proof_uploaded', 'unpaid') then 1 else 0 end)`,
  pendingBookings: sql<number>`sum(case when ${bookings.status} = 'pending' then 1 else 0 end)`,
};
