const fs = require('fs');
const path = require('path');
const postgres = require('postgres');

async function fix() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('.env.local not found');
    return;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const dbUrlMatch = envContent.match(/DATABASE_URL="?([^"\n\s]+)"?/);
  
  if (!dbUrlMatch) {
    console.error('DATABASE_URL not found in .env.local');
    return;
  }

  const databaseUrl = dbUrlMatch[1];
  console.log('Using DATABASE_URL from .env.local');

  const sql = postgres(databaseUrl, { ssl: 'require' });

  try {
    console.log('Adding telemetry column...');
    await sql`ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "telemetry" jsonb;`;
    console.log('✅ Successfully added telemetry column.');
  } catch (err) {
    console.error('❌ Error updating database:', err);
  } finally {
    await sql.end();
  }
}

fix();
