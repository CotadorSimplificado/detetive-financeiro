import { db } from '../db';
import { users } from '@shared/schema';

async function listUsers() {
  try {
    console.log('Listing users...');
    const allUsers = await db.select().from(users);
    console.log(allUsers);
  } catch (error) {
    console.error('Error listing users:', error);
  } finally {
    process.exit(0);
  }
}

listUsers();
