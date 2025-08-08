import { db } from '../db';
import { users, accounts, transactions, creditCards, monthlyPlans, categories } from '@shared/schema';
import { eq } from 'drizzle-orm';

const userIdToDelete = '46114828';

async function deleteUser(userId: string) {
  try {
    console.log(`Starting deletion for user ID: ${userId}`);

    // Delete related data
    await db.delete(accounts).where(eq(accounts.userId, userId));
    console.log('Deleted user accounts');

    await db.delete(transactions).where(eq(transactions.userId, userId));
    console.log('Deleted user transactions');

    await db.delete(creditCards).where(eq(creditCards.userId, userId));
    console.log('Deleted user credit cards');

    await db.delete(monthlyPlans).where(eq(monthlyPlans.userId, userId));
    console.log('Deleted user monthly plans');

    await db.delete(categories).where(eq(categories.userId, userId));
    console.log('Deleted user categories');

    // Delete the user
    await db.delete(users).where(eq(users.id, userId));
    console.log(`User with ID: ${userId} deleted successfully.`);

  } catch (error) {
    console.error('Error deleting user:', error);
  } finally {
    process.exit(0);
  }
}

deleteUser(userIdToDelete);
