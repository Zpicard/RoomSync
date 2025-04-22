import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    console.log('Starting database cleanup...');

    // Delete all quiet times
    console.log('Deleting quiet times...');
    await prisma.quietTime.deleteMany();

    // Delete all guest announcements
    console.log('Deleting guest announcements...');
    await prisma.guestAnnouncement.deleteMany();

    // Delete all household invites
    console.log('Deleting household invites...');
    await prisma.householdInvite.deleteMany();

    // Delete all cleaning tasks
    console.log('Deleting cleaning tasks...');
    await prisma.cleaningTask.deleteMany();

    // Update all users to remove household references
    console.log('Updating users to remove household references...');
    await prisma.user.updateMany({
      data: {
        householdId: null
      }
    });

    // Delete all households
    console.log('Deleting households...');
    await prisma.household.deleteMany();

    // Delete all users
    console.log('Deleting users...');
    await prisma.user.deleteMany();

    console.log('Database cleanup completed successfully!');
  } catch (error) {
    console.error('Error during database cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
clearDatabase(); 