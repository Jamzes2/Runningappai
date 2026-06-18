import { pgTable, uuid, text, integer, doublePrecision, timestamp, jsonb } from 'drizzle-orm/pg-core';

// Users table mapping Supabase authentication references and wearable credentials
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  
  // Strava OAuth credentials
  stravaAthleteId: text('strava_athlete_id'),
  stravaAccessToken: text('strava_access_token'),
  stravaRefreshToken: text('strava_refresh_token'),
  stravaTokenExpiresAt: integer('strava_token_expires_at'),
  lastSyncAt: timestamp('last_sync_at'),
  
  // Garmin credentials placeholders
  garminToken: text('garmin_token'),
  garminSecret: text('garmin_secret'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Run Activities table
export const activities = pgTable('activities', {
  id: text('id').primaryKey(), // Using Strava activity IDs directly as text
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  distance: doublePrecision('distance').notNull(), // stored in kilometers
  duration: integer('duration').notNull(), // stored in seconds
  avgPace: text('avg_pace').notNull(), // stored as format 'M:SS'
  avgHr: integer('avg_hr'),
  maxHr: integer('max_hr'),
  avgPower: integer('avg_power'),
  avgCadence: integer('avg_cadence'),
  avgTemp: integer('avg_temp'),
  elevationGained: doublePrecision('elevation_gained'),
  routeSvg: text('route_svg'), // SVG trace coordinate lines
  splits: jsonb('splits'), // array of splits: { split: number, pace: string, hr: number, power: number }
  telemetry: jsonb('telemetry'), // High-res continuous data: [{ distance, pace, hr, cadence, power, alt }]
  metadata: jsonb('metadata'), // Additional rich metrics: { trainingEffect, calories, normalizedPower, etc. }
  date: timestamp('date').notNull(),
  aiSummary: text('ai_summary'),
  aiWorkoutRecommendation: text('ai_workout_recommendation'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Performance Plan table
export const performancePlans = pgTable('performance_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  raceName: text('race_name').notNull(),
  raceDistance: text('race_distance').notNull(), // e.g., '5km', 'Marathon'
  raceDate: timestamp('race_date').notNull(),
  raceGoal: text('race_goal').notNull(), // e.g., 'Sub 4 hours'
  personalNotes: text('personal_notes'),
  generatedPlan: text('generated_plan'), // The AI generated content
  elevationData: jsonb('elevation_data'), // Elevation profile for the race
  raceDay: text('race_day'), // e.g. 'Sunday'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// AI Coach Conversations table
export const coachConversations = pgTable('coach_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  sender: text('sender').notNull(), // 'user' or 'coach'
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
