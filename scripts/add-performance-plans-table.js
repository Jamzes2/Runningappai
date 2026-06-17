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
  const sql = postgres(databaseUrl, { ssl: 'require' });

  try {
    console.log('Creating performance_plans table...');
    await sql`
      CREATE TABLE IF NOT EXISTS "performance_plans" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid REFERENCES "users"("id") ON DELETE CASCADE,
        "race_name" text NOT NULL,
        "race_distance" text NOT NULL,
        "race_date" timestamp NOT NULL,
        "race_goal" text NOT NULL,
        "personal_notes" text,
        "generated_plan" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `;
    console.log('✅ Successfully created performance_plans table.');
  } catch (err) {
    console.error('❌ Error updating database:', err);
  } finally {
    await sql.end();
  }
}

fix();
