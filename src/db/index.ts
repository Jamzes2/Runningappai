import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

// For edge environments, you might want to use a different driver,
// but for standard Node.js/Next.js routes, postgres-js is excellent.
let client: any = null;
let db: any = null;

if (connectionString) {
  try {
    client = postgres(connectionString);
    db = drizzle(client, { schema });
  } catch (error) {
    console.warn('Failed to initialize database connection:', error);
  }
}

export { db };
