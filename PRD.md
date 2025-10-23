Excellent — let’s refine the **Doghouse PRD** to make the dashboard features much more robust and actionable.
We’ll expand the **Dashboard** section into three role-specific views (Breeder, Seeker, Admin) with detailed modules, user interactions, and notification logic — while polishing the rest for clarity and alignment with the new product direction.

---

## 🐾 **Refined Product Requirements Document (PRD) — Doghouse Platform**

### **1. Overview**

Doghouse is a digital platform connecting verified breeders with responsible dog seekers in Kenya.
It streamlines the discovery, matching, and adoption workflow through an intelligent dashboard system and seamless WhatsApp integration — making dog ownership more ethical, transparent, and human-centered.

---

### **2. Objectives**

* Empower breeders to manage their operations (breeds, litters, and applicants) efficiently.
* Help seekers discover verified breeders and litters based on lifestyle, location, and breed preference.
* Ensure transparent, guided communication between breeders and seekers.
* Leverage WhatsApp automation for lead management, notifications, and adoption updates.
* Build trust in the breeding ecosystem via verification, accountability, and storytelling.

---

### **3. User Personas**

1. **Breeders** – Manage their kennels, litters, and inquiries.
2. **Seekers (Clients)** – Apply for adoption or express interest in specific breeds.
3. **Admins** – Verify breeder profiles, monitor platform activity, and ensure compliance.

---

### **4. Key Features**

#### **A. Authentication & Profiles**

* Email/phone sign-up via Supabase Auth.
* Two-step breeder verification (KRA/personal ID + facility proof).
* Roles: `breeder`, `seeker`, `admin`.
* Editable profile details: bio, photo, location, WhatsApp contact link, and kennel name (for breeders).

---

#### **B. Breed & Litter Management (Breeder Dashboard Module)**

* **Breed Manager**

  * Add/edit breeds they offer.
  * Tag breeds with attributes (size, temperament, use case, health info).
  * View total inquiries per breed.
* **Litter Tracker**

  * Add new litter → name, DOB, number of puppies, availability date, reservation fee.
  * Auto-update litter status (Available / Reserved / Adopted).
  * Upload litter images/videos.
* **Inquiry Log**

  * View list of seekers who’ve expressed interest.
  * Filter by breed, location, or inquiry stage.
  * Click to open WhatsApp conversation via deep link.

---

#### **C. Seeker Experience (Client Dashboard Module)**

* **Breed Discovery**

  * Explore available breeds filtered by size, age, or breeder location.
  * “Wanted Listing” option → seekers can post a breed request with preferences.
* **Matching & Notifications**

  * Instant alerts when a breeder with a matching breed becomes available.
  * WhatsApp message & in-app notification sent automatically.
* **My Applications**

  * Track applications by status: Submitted / Approved / Pending Visit / Completed.
  * Option to schedule a visit (integration with breeder’s calendar).
* **Profile Settings**

  * Manage personal details, living environment info, and contact preferences.

---

#### **D. Admin Dashboard**

* **Verification Panel**

  * View breeder documents, approve or reject verification requests.
* **Analytics Overview**

  * Track total breeders, seekers, and active litters.
  * Monitor engagement metrics (applications, messages, adoption success).
* **Content & Community**

  * Broadcast updates to WhatsApp Channel or all verified breeders.
  * Flag or remove inappropriate listings.

---

#### **E. Communication & Notification System**

* Integrated **WhatsApp Cloud API** + OneSignal push.
* Templates:

  * “New Breed Match Found” → Sent to breeder when seeker matches their listing.
  * “Application Update” → Sent to seekers as adoption progresses.
  * “Verification Approved” → For breeders after admin approval.
* Real-time dashboard alerts (toast + activity feed).

---

### **5. MVP Dashboard Summary**

| Role        | Core Dashboard Components           | Primary Actions                                | Notifications                             |
| ----------- | ----------------------------------- | ---------------------------------------------- | ----------------------------------------- |
| **Breeder** | Breeds, Litters, Inquiries, Profile | Add/Edit breed, View seekers, Approve interest | WhatsApp + In-App when new seeker matches |
| **Seeker**  | Matches, My Applications, Profile   | Submit application, Track progress, Chat       | Alerts for matching breeders & updates    |
| **Admin**   | Verification, Analytics, Broadcasts | Approve breeders, Remove listings              | Weekly activity summary                   |

---

### **6. Technical Overview**

* **Frontend:** Next.js + TailwindCSS (for responsive dashboard)
* **Backend:** Supabase (Auth, PostgreSQL, Edge Functions, Storage)
* **Notifications:** OneSignal + WhatsApp Cloud API
* **Maps & Location:** Leaflet.js
* **Hosting:** Vercel

---

### **7. Success Metrics**

* 80% of verified breeders actively managing listings monthly.
* 70% of seekers completing at least one application.
* <24hr average response time for breeder inquiries.
* 90% of WhatsApp notifications successfully delivered.


## 1) High-level ER Summary (entities & relationships)

Primary entities:

* **users** — platform users (breeder, seeker, admin)
* **breeder_profiles** — extended data for breeder users (verification)
* **kennels** — optional: breeder’s kennel data (location, photos)
* **breeds** — canonical breed catalog
* **user_breeds** — which breeds a breeder offers / owns (join)
* **litters** — individual litters managed by breeders (a litter is a group of puppies)
* **pets** — individual animals (optional; litters are primary for breeding flow)
* **wanted_listings** — seeker "wanted" ads
* **applications** — seeker applications for a litter/pet (adoption requests)
* **messages** — simple messaging / conversation records (if applicable)
* **notifications** — notification records (for UX/history)
* **activity_logs** — audit trail / events
* **files** / storage refs — images, docs (supabase storage references)
* **transactions** (optional later) — payments/reservations

Relationships:

* `users (1) -> breeder_profiles (0..1)` (a breeder user has profile)
* `users (1) -> kennels (0..n)` (a user can have a kennel)
* `kennels (1) -> litters (0..n)`
* `breeder_profiles (1) -> user_breeds (0..n)` -> `breeds`
* `litters (1) -> applications (0..n)` (seekers apply to a litter)
* `users (seeker) -> wanted_listings (0..n)`
* `users -> messages` (sender/recipient)
* Notifications are tied to `users` and reference other objects via polymorphic `{target_type, target_id}`

---

## 2) Drizzle ORM schema (TypeScript)

Below are `drizzle-orm/pg-core` table definitions. Save to e.g. `db/schema.ts`. These are opinionated: add/modify fields to match your exact needs.

```ts
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

// USERS
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 32 }),
  display_name: varchar("display_name", { length: 200 }),
  role: varchar("role", { length: 32 }).notNull(), // 'seeker' | 'breeder' | 'admin'
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

// BREEDER PROFILE (extended user info)
export const breeder_profiles = pgTable("breeder_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  kennel_name: varchar("kennel_name", { length: 255 }),
  kennel_location: varchar("kennel_location", { length: 255 }),
  verification_docs: jsonb("verification_docs"), // references to storage keys
  verified_at: timestamp("verified_at"),
  rating: numeric("rating", { precision: 3, scale: 2 }).default(0),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// KENNELS (optional)
export const kennels = pgTable("kennels", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
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
```

---

## 3) Indexes and performance hints

Add indexes for common search/access patterns:

* `CREATE INDEX idx_users_location ON users (location_lat, location_lng);`
* `CREATE INDEX idx_litters_breeder ON litters (breeder_id);`
* `CREATE INDEX idx_litters_status ON litters (status);`
* `CREATE INDEX idx_user_breeds_breed ON user_breeds (breed_id);`
* `CREATE INDEX idx_wanted_geo ON wanted_listings USING gist (...)` — consider PostGIS for spatial queries; or use simple b-tree on lat/lng if basic.

For geo queries, consider PostGIS or use bounding-box queries on lat/lng with indexes.

---

## 4) Row-Level Security (RLS) recommendations (Supabase)

Enable RLS and add policies:

* **users**: allow `auth.uid()` to select/update their row.
* **breeder_profiles**: only owner and admins can update; public can read breeder profiles if `is_verified = true`.
* **litters**: public `SELECT` allowed for `status = 'available'`; `INSERT` restricted to breeder role; `UPDATE` allowed for owner or admin.
* **applications**: seeker can `INSERT` for applying; breeder and admin can `SELECT`/`UPDATE` applications for their litters; seekers can view their own applications.

Example policy pseudo:

```sql
-- enable rls
ALTER TABLE litters ENABLE ROW LEVEL SECURITY;

-- allow breeder to insert
CREATE POLICY "insert_litter_by_breeder" ON litters
  FOR INSERT
  WITH CHECK (auth.role() = 'breeder' AND auth.uid() = breeder_id);

-- allow public select on available
CREATE POLICY "public_select_available" ON litters
  FOR SELECT
  USING (status = 'available');
```

Supabase CLI / dashboard lets you write these policies.

---

## 5) Notifications / matching workflow (implementation notes)

**Matching logic** (when a wanted listing created OR seeker onboarding):

* On creation of `wanted_listings`:

  * Query `user_breeds` and `litters` for breeders offering that breed within desired radius / filters.
  * For each match, create a `notifications` record for breeder and trigger push/WhatsApp.

**Implementation**:

* Use a background worker (Supabase edge function / serverless function) triggered by DB insert (a trigger or listening to `pg_changes`).
* Worker composes:

  * Create notification rows (for history)
  * Send WhatsApp Cloud API message (or OneSignal push) to breeder with deep link to the dashboard / thread.
* Log activity record in `activity_logs`.

**Example trigger**:

* Postgres trigger that calls a Supabase Edge Function (via webhook) OR insert into a `notification_queue` table that worker picks up.

---

## 6) Sample Drizzle queries (patterns)

Example: get active litters for a given breed & location bounding box:

```ts
import { db } from "./db"; // drizzle client
import { litters, breeds, user_breeds, users } from "./schema";
import { and, eq, gt, sql } from "drizzle-orm";

async function findLittersByBreedNear(breedName: string, swLat:number, swLng:number, neLat:number, neLng:number){
  const found = await db.select()
    .from(litters)
    .leftJoin(user_breeds, eq(litters.user_breed_id, user_breeds.id))
    .leftJoin(breeds, eq(user_breeds.breed_id, breeds.id))
    .leftJoin(users, eq(litters.breeder_id, users.id))
    .where(
      and(
        eq(breeds.name, breedName),
        eq(litters.status, "available"),
        sql`${litters}.available_date IS NOT NULL`,
        sql`${users}.location_lat BETWEEN ${swLat} AND ${neLat}`,
        sql`${users}.location_lng BETWEEN ${swLng} AND ${neLng}`
      )
    )
    .limit(50);
  return found;
}
```

Example: create an application and notify breeder:

```ts
async function createApplicationAndNotify({litterId, seekerId, answers}) {
  const app = await db.insert(applications).values({
    litter_id: litterId,
    seeker_id: seekerId,
    application_data: answers,
    status: 'submitted'
  }).returning();

  // create notification
  await db.insert(notifications).values({
    user_id: breederId, // look up from litter
    type: 'new_application',
    title: 'New adoption application',
    body: `A new application for your litter ${litterId}`,
    target_type: 'application',
    target_id: app[0].id
  });

  // call your notification service (OneSignal/WhatsApp) — via edge function.
}
```

---

## 7) Admin operations / dashboards supported by the schema

* Approve breeder: set `breeder_profiles.verified_at` and `users.is_verified`.
* See metrics: count of `applications` by status, average time-to-adopt (use timestamps).
* Bulk exports: export `applications`, `litters` to CSV for offline review.

---

## 8) Security & privacy notes

* Store sensitive docs (IDs) in Supabase storage and only expose signed URLs for limited durations.
* Ensure `application_data` JSON doesn't include payment or highly sensitive personal data unless encrypted.
* Rate-limit WhatsApp notifications to avoid spam and comply with WhatsApp Business policies.
* Keep an audit trail in `activity_logs`.

---
