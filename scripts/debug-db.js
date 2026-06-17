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
    const result = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'activities' AND column_name = 'telemetry';
    `;
    console.log('Telemetry column check:', result);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await sql.end();
  }
}

fix();
