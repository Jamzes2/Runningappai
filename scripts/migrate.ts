import { createClient } from '@supabase/supabase-js';

async function applyMigration() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    // Check if the type column already exists
    const { data, error } = await supabase.rpc('check_column_exists', {
      table_name: 'activities',
      column_name: 'type'
    });

    if (error) {
      console.log('Column check error (trying to add anyway):', error.message);
    } else if (data) {
      console.log('Column already exists, skipping migration');
      return;
    }

    // Add the type column
    const { error: alterError } = await supabase.rpc('execute_sql', {
      sql: 'ALTER TABLE "activities" ADD COLUMN "type" text DEFAULT \'Run\''
    });

    if (alterError) {
      console.error('Migration error:', alterError);
      process.exit(1);
    }

    console.log('✅ Migration applied successfully');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

applyMigration();
