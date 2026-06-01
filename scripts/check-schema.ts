import { db } from '../src/db/index';
import { sql } from 'drizzle-orm';

async function checkSchema() {
  try {
    if (!db) {
      console.error('Database connection not initialized. Check your DATABASE_URL.');
      process.exit(1);
    }
    const result = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'activities' 
      AND column_name IN ('avg_hr', 'max_hr', 'avg_power');
    `);
    console.log('Current Database Schema for activities:');
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Error checking schema:', err);
  }
}

checkSchema();
