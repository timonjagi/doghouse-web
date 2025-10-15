// db/schema.ts
import {
  pgTable,
  serial,
  uuid,
  text,
  varchar,
  integer,
  timestamp,
  boolean,
  jsonb,
  numeric,
  time,
} from "drizzle-orm/pg-core";

// USERS (clean - only universal fields)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 32 }),
  display_name: varchar("display_name", { length: 200 }),
  role: varchar("role", { length: 32 }), // 'seeker' | 'breeder' | 'admin'
  is_verified: boolean("is_verified").notNull().default(false),
  profile_photo_url: text("profile_photo_url"),
  bio: text("bio"),
  location_text: varchar("location_text", { length: 255 }),
  location_lat: numeric("location_lat", { precision: 9, scale: 6 }), // lat/lng as decimals
  location_lng: numeric("location_lng", { precision: 9, scale: 6 }),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// BREED CATALOG
export const breeds = pgTable("breeds", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 200 }).notNull(),
  group: varchar("group", { length: 100 }), // e.g. 'sporting', 'toy'
  size: varchar("size", { length: 50 }), // small/medium/large
  description: text("description"),
  traits: jsonb("traits"), // temperament etc.
  image_url: text("image_url"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// SEEKER PROFILES (new table for seeker-specific data)
export const seeker_profiles = pgTable("seeker_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  living_situation: text("living_situation"),
  experience_level: varchar("experience_level", { length: 50 }),
  has_allergies: boolean("has_allergies").default(false),
  has_children: boolean("has_children").default(false),
  has_other_pets: boolean("has_other_pets").default(false),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// BREEDER PROFILES (enhanced existing)
export const breeder_profiles = pgTable("breeder_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  kennel_name: varchar("kennel_name", { length: 255 }),
  kennel_location: varchar("kennel_location", { length: 255 }),
  facility_type: varchar("facility_type", { length: 100 }),
  verification_docs: jsonb("verification_docs"), // references to storage keys
  verified_at: timestamp("verified_at"),
  rating: numeric("rating", { precision: 3, scale: 2 }).default(0),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// KENNELS (enhanced for multiple facilities)
export const kennels = pgTable("kennels", {
  id: uuid("id").primaryKey().defaultRandom(),
  breeder_profile_id: uuid("breeder_profile_id").notNull().references(() => breeder_profiles.id),
  name: varchar("name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  location_lat: numeric("location_lat", { precision: 9, scale: 6 }),
  location_lng: numeric("location_lng", { precision: 9, scale: 6 }),
  photos: jsonb("photos"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// USER_BREEDS (breeder offers or owns these breeds)
export const user_breeds = pgTable("user_breeds", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  breed_id: uuid("breed_id").notNull().references(() => breeds.id),
  is_owner: boolean("is_owner").notNull().default(true),
  notes: text("notes"),
  images: jsonb("images").$default(() => "[]"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// LITTERS (breeder litters)
export const litters = pgTable("litters", {
  id: uuid("id").primaryKey().defaultRandom(),
  breeder_id: uuid("breeder_id").notNull().references(() => users.id),
  user_breed_id: uuid("user_breed_id").references(() => user_breeds.id),
  name: varchar("name", { length: 255 }), // optional name like 'Litter A'
  birth_date: timestamp("birth_date"),
  available_date: timestamp("available_date"),
  number_of_puppies: integer("number_of_puppies"),
  reservation_fee: numeric("reservation_fee", { precision: 10, scale: 2 }),
  status: varchar("status", { length: 50 }).notNull().default("available"), // available/reserved/adopted
  photos: jsonb("photos"),
  description: text("description"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// WANTED LISTINGS (seekers)
export const wanted_listings = pgTable("wanted_listings", {
  id: uuid("id").primaryKey().defaultRandom(),
  seeker_id: uuid("seeker_id").notNull().references(() => users.id),
  pet_type: varchar("pet_type", { length: 50 }).notNull(), // dog, cat, bird...
  preferred_breed: varchar("preferred_breed", { length: 255 }),
  experience_level: varchar("experience_level", { length: 50 }),
  living_situation: text("living_situation"),
  notes: text("notes"),
  location_lat: numeric("location_lat", { precision: 9, scale: 6 }),
  location_lng: numeric("location_lng", { precision: 9, scale: 6 }),
  is_active: boolean("is_active").notNull().default(true),
  // Enhanced preference fields
  preferred_age: varchar("preferred_age", { length: 50 }),
  preferred_sex: varchar("preferred_sex", { length: 50 }),
  spay_neuter_preference: varchar("spay_neuter_preference", { length: 50 }),
  activity_level: varchar("activity_level", { length: 50 }),
  has_allergies: boolean("has_allergies").default(false),
  has_children: boolean("has_children").default(false),
  has_other_pets: boolean("has_other_pets").default(false),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// APPLICATIONS (adoption requests)
export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  litter_id: uuid("litter_id").references(() => litters.id),
  seeker_id: uuid("seeker_id").notNull().references(() => users.id),
  status: varchar("status", { length: 50 }).notNull().default("submitted"), // submitted/pending/approved/rejected/completed
  application_data: jsonb("application_data"), // full answers, contact prefs
  contract_url: text("contract_url"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// MESSAGES (lightweight)
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  thread_id: uuid("thread_id"),
  sender_id: uuid("sender_id").notNull().references(() => users.id),
  recipient_id: uuid("recipient_id").notNull().references(() => users.id),
  content: text("content"),
  attachments: jsonb("attachments"),
  read: boolean("read").notNull().default(false),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// NOTIFICATIONS (history)
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  type: varchar("type", { length: 100 }).notNull(), // 'match', 'application', etc.
  title: varchar("title", { length: 255 }),
  body: text("body"),
  target_type: varchar("target_type", { length: 100 }), // 'litter' | 'wanted' | 'application'
  target_id: uuid("target_id"),
  is_read: boolean("is_read").notNull().default(false),
  meta: jsonb("meta"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// ACTIVITY LOGS
export const activity_logs = pgTable("activity_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => users.id),
  action: varchar("action", { length: 255 }).notNull(),
  description: text("description"),
  context: jsonb("context"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// Optional transactions table for reservation payments
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  application_id: uuid("application_id").references(() => applications.id),
  seeker_id: uuid("seeker_id").notNull().references(() => users.id),
  breeder_id: uuid("breeder_id").notNull().references(() => users.id),
  amount: numeric("amount", { precision: 10, scale: 2 }),
  commission_fee: numeric("commission_fee", { precision: 10, scale: 2 }),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  payment_method: varchar("payment_method", { length: 100 }),
  meta: jsonb("meta"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});
