import { db } from '../src/db/index';
import { sql } from 'drizzle-orm';

async function fixColumns() {
  try {
    console.log('Updating avg_hr to double precision...');
    await db.execute(sql`ALTER TABLE activities ALTER COLUMN avg_hr TYPE double precision`);
    
    console.log('Updating max_hr to double precision...');
    await db.execute(sql`ALTER TABLE activities ALTER COLUMN max_hr TYPE double precision`);
    
    console.log('✅ Database columns updated successfully!');
  } catch (err) {
    console.error('Error updating columns:', err);
  }
}

fixColumns();
