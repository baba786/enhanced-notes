import { sql } from '@vercel/postgres';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

export async function executeQuery(query: string, values: any[] = []) {
  try {
    const result = await sql.query(query, values);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}