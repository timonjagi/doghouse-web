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
  onboarding_completed: boolean("onboarding_completed").notNull().default(false),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// BREED CATALOG
export const breeds = pgTable("breeds", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 200 }).notNull(),
  group: varchar("group", { length: 100 }), // e.g. 'sporting', 'toy'
  height: text("height"),
  weight: text("weight"),
  life_span: text("life_span"),
  description: text("description"),
  traits: jsonb("traits"), // temperament etc.
  pet_type: varchar("pet_type", { length: 50 }).default('dog'),
  featured_image_url: text("featured_image_url"),
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
  preferred_breed_id: uuid("preferred_breed_id").references(() => breeds.id),
  preferred_breed_name: varchar("preferred_breed_name", { length: 255 }),
  preferred_age: varchar("preferred_age", { length: 50 }),
  preferred_sex: varchar("preferred_sex", { length: 50 }),
  spay_neuter_preference: varchar("spay_neuter_preference", { length: 50 }),
  activity_level: varchar("activity_level", { length: 50 }),
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
  rating: numeric("rating", { precision: 3, scale: 2 }).default('0'),
  review_count: integer("review_count").default(0),
  kennel_avatar_url: text("kennel_avatar_url"),
  pet_types: jsonb("pet_types").$default(() => "[]"),
  website: text("website"),
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
  pet_type: varchar("pet_type", { length: 50 }),
  notes: text("notes"),
  images: jsonb("images").$default(() => "[]"),
  is_cross_breed: boolean("is_cross_breed").default(false),
  secondary_breed_id: uuid("secondary_breed_id").references(() => breeds.id),
  is_verified: boolean("is_verified").default(false),

  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// LISTINGS (unified table for all types of listings)
export const listings = pgTable("listings", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Core listing information
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 50 }).notNull(), // 'litter' | 'single_pet' | 'wanted'
  pet_type: varchar("pet_type", { length: 50 }),

  // Owner information
  owner_id: uuid("owner_id").notNull().references(() => users.id),
  owner_type: varchar("owner_type", { length: 32 }).notNull(), // 'breeder' | 'seeker'

  // Breed information
  breed_id: uuid("breed_id").references(() => breeds.id),
  secondary_breed_id: uuid("secondary_breed_id").references(() => breeds.id),
  is_cross_breed: boolean("is_cross_breed").default(false),
  user_breed_id: uuid("user_breed_id").references(() => user_breeds.id),

  // Litter-specific fields (only for type = 'litter')
  birth_date: timestamp("birth_date"),
  available_date: timestamp("available_date"),
  number_of_puppies: integer("number_of_puppies"),

  // Single pet fields (only for type = 'single_pet')
  pet_name: varchar("pet_name", { length: 255 }),
  pet_age: varchar("pet_age", { length: 50 }),
  pet_gender: varchar("pet_gender", { length: 20 }),

  // Common fields
  price: numeric("price", { precision: 10, scale: 2 }),
  reservation_fee: numeric("reservation_fee", { precision: 10, scale: 2 }),
  status: varchar("status", { length: 50 }).notNull().default("available"), // available/reserved/sold/completed
  photos: jsonb("photos").$default(() => "[]"),

  // Location
  location_text: varchar("location_text", { length: 255 }),
  location_lat: numeric("location_lat", { precision: 9, scale: 6 }),
  location_lng: numeric("location_lng", { precision: 9, scale: 6 }),

  // 🆕 Enhanced Information (JSON fields for comprehensive data)
  parents: jsonb("parents").$default(() => "{}"), // sire and dam details with photos
  health: jsonb("health").$default(() => "{}"), // vaccinations, health tests, certificates
  training: jsonb("training").$default(() => "{}"), // training milestones and status
  requirements: jsonb("requirements").$default(() => "{}"), // adoption requirements and preferences

  // Metadata
  is_featured: boolean("is_featured").notNull().default(false),
  view_count: integer("view_count").notNull().default(0),
  tags: jsonb("tags").$default(() => "[]"), // flexible tagging system

  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});


// ADOPTIONS (adoption requests) - Renamed from applications
export const adoptions = pgTable("adoptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  listing_id: uuid("listing_id").references(() => listings.id),
  seeker_id: uuid("seeker_id").notNull().references(() => users.id),
  status: varchar("status", { length: 50 }).notNull().default("submitted"), // submitted/pending/approved/rejected/completed
  application_data: jsonb("application_data"), // full answers, contact prefs
  contract_url: text("contract_url"),
  reservation_paid: boolean("reservation_paid").notNull().default(false),
  contract_signed: boolean("contract_signed").notNull().default(false),
  payment_completed: boolean("payment_completed").notNull().default(false),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// ADOPTION STATUS HISTORY (new table)
export const adoption_status_history = pgTable("adoption_status_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  adoption_id: uuid("adoption_id").notNull().references(() => adoptions.id),
  status: varchar("status", { length: 50 }).notNull(),
  notes: text("notes"),
  created_by: uuid("created_by").references(() => users.id),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// CONVERSATIONS (context-aware messaging threads)
export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }),
  context_type: varchar("context_type", { length: 50 }).notNull(), // 'adoption' | 'listing' | 'support' | 'general'
  context_id: uuid("context_id"), // Reference to related entity (adoption_id, listing_id, etc.)
  context_data: jsonb("context_data").$default(() => "{}"), // Metadata about the conversation context
  participants: jsonb("participants").$default(() => "[]"), // Array of user IDs participating
  last_message_at: timestamp("last_message_at"),
  last_message_preview: text("last_message_preview"),
  unread_count: jsonb("unread_count").$default(() => "{}"), // Unread counts per participant {userId: count}
  is_active: boolean("is_active").notNull().default(true),
  created_by: uuid("created_by").notNull().references(() => users.id),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// MESSAGES (enhanced with conversation support)
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversation_id: uuid("conversation_id").notNull().references(() => conversations.id),
  sender_id: uuid("sender_id").notNull().references(() => users.id),
  content: text("content"),
  attachments: jsonb("attachments"),
  read_by: jsonb("read_by").$default(() => "[]"), // Array of user IDs who have read this message
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// NOTIFICATIONS (enhanced with delivery tracking and multi-channel support)
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  notification_type_id: uuid("notification_type_id").references(() => notification_types.id),
  type: varchar("type", { length: 100 }).notNull(), // 'match', 'application', 'payment', etc.
  title: varchar("title", { length: 255 }),
  body: text("body"),
  target_type: varchar("target_type", { length: 100 }), // 'listing' | 'adoption' | 'user'
  target_id: uuid("target_id"),
  is_read: boolean("is_read").notNull().default(false),

  // Multi-channel delivery tracking
  channels_delivered: jsonb("channels_delivered").$default(() => "[]"), // ['email', 'sms', 'whatsapp', 'push']
  delivery_status: jsonb("delivery_status").$default(() => "{}"), // {email: 'sent', sms: 'failed', ...}
  delivery_attempts: integer("delivery_attempts").notNull().default(0),
  last_delivery_attempt: timestamp("last_delivery_attempt"),

  // Enhanced metadata
  meta: jsonb("meta"),
  priority: varchar("priority", { length: 20 }).notNull().default("normal"), // 'low', 'normal', 'high', 'urgent'
  expires_at: timestamp("expires_at"), // For time-sensitive notifications

  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// NOTIFICATION TYPES (predefined categories with templates)
export const notification_types = pgTable("notification_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: varchar("key", { length: 100 }).notNull().unique(), // 'application_received', 'payment_completed', etc.
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(), // 'applications', 'payments', 'matches', 'system'

  // Template configurations
  email_template: jsonb("email_template"), // {subject: '', body: '', variables: []}
  sms_template: jsonb("sms_template"), // {body: '', variables: []}
  whatsapp_template: jsonb("whatsapp_template"), // {body: '', variables: []}
  push_template: jsonb("push_template"), // {title: '', body: '', variables: []}

  // Default settings
  default_channels: jsonb("default_channels").$default(() => "['push']"), // Default delivery channels
  default_priority: varchar("default_priority", { length: 20 }).notNull().default("normal"),

  is_active: boolean("is_active").notNull().default(true),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// NOTIFICATION RULES (admin-configurable triggers and conditions)
export const notification_rules = pgTable("notification_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  notification_type_id: uuid("notification_type_id").notNull().references(() => notification_types.id),

  // Trigger conditions
  trigger_event: varchar("trigger_event", { length: 100 }).notNull(), // 'adoption_status_changed', 'payment_received', etc.
  trigger_conditions: jsonb("trigger_conditions"), // Complex conditions for when to fire

  // Target audience
  target_roles: jsonb("target_roles").$default(() => "['all']"), // ['seeker', 'breeder', 'admin']
  target_conditions: jsonb("target_conditions"), // Additional filtering

  // Delivery configuration
  channels: jsonb("channels").$default(() => "['push']"), // Override default channels
  priority: varchar("priority", { length: 20 }).notNull().default("normal"),
  cooldown_period: integer("cooldown_period"), // Minutes between similar notifications
  max_per_day: integer("max_per_day"), // Rate limiting

  // Admin controls
  is_active: boolean("is_active").notNull().default(true),
  created_by: uuid("created_by").references(() => users.id),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// USER NOTIFICATION PREFERENCES
export const user_notification_preferences = pgTable("user_notification_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id).unique(),

  // Channel preferences
  email_enabled: boolean("email_enabled").notNull().default(true),
  sms_enabled: boolean("sms_enabled").notNull().default(true),
  whatsapp_enabled: boolean("whatsapp_enabled").notNull().default(true),
  push_enabled: boolean("push_enabled").notNull().default(true),

  // Category preferences
  applications_enabled: boolean("applications_enabled").notNull().default(true),
  payments_enabled: boolean("payments_enabled").notNull().default(true),
  matches_enabled: boolean("matches_enabled").notNull().default(true),
  system_enabled: boolean("system_enabled").notNull().default(true),

  // Quiet hours
  quiet_hours_enabled: boolean("quiet_hours_enabled").notNull().default(false),
  quiet_hours_start: time("quiet_hours_start"), // 22:00
  quiet_hours_end: time("quiet_hours_end"), // 08:00

  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
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

// WISHLISTS (user saved listings and user_breeds for notifications)
export const wishlists = pgTable("wishlists", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  breed_id: uuid("breed_id").references(() => breeds.id),
  user_breed_id: uuid("user_breed_id").references(() => user_breeds.id), // optional - for saved breeds without listings
  notify_when_available: boolean("notify_when_available").notNull().default(false),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// Optional transactions table for reservation payments
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  application_id: uuid("application_id").references(() => adoptions.id), // Kept column name, referenced adoptions
  seeker_id: uuid("seeker_id").notNull().references(() => users.id),
  breeder_id: uuid("breeder_id").notNull().references(() => users.id),
  amount: numeric("amount", { precision: 10, scale: 2 }),
  commission_fee: numeric("commission_fee", { precision: 10, scale: 2 }),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // payment status
  payout_status: varchar("payout_status", { length: 50 }).notNull().default("pending"), // payout status to breeder
  payment_method: varchar("payment_method", { length: 100 }),
  meta: jsonb("meta"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type BreederProfile = typeof breeder_profiles.$inferSelect;
export type SeekerProfile = typeof seeker_profiles.$inferSelect;
export type Breed = typeof breeds.$inferSelect;
export type UserBreed = typeof user_breeds.$inferSelect;
export type Kennel = typeof kennels.$inferSelect;
export type Listing = typeof listings.$inferSelect;
export type Adoption = typeof adoptions.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type ActivityLog = typeof activity_logs.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Wishlist = typeof wishlists.$inferSelect;
