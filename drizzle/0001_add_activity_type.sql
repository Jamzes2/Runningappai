-- Add activity type column to track different activity types (Run, Ride, Swim, Walk, etc.)
ALTER TABLE "activities" ADD COLUMN "type" text DEFAULT 'Run';