import { db } from '../src/db/index';
import { sql } from 'drizzle-orm';

async function fixSchema() {
  try {
    if (!db) {
      console.error('Database connection not initialized.');
      process.exit(1);
    }
    
    console.log('Adding missing columns to activities table...');
    
    await db.execute(sql`
      ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "avg_cadence" integer;
    `);
    
    await db.execute(sql`
      ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "avg_temp" integer;
    `);

    console.log('Successfully updated schema.');
  } catch (err) {
    console.error('Error updating schema:', err);
  }
}

fixSchema();
