import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteAllHouseholds() {
  try {
    console.log('Starting to delete all households...');
    
    // First, delete all guest announcements
    console.log('Deleting guest announcements...');
    await prisma.guestAnnouncement.deleteMany();
    
    // Delete all cleaning tasks
    console.log('Deleting cleaning tasks...');
    await prisma.cleaningTask.deleteMany();
    
    // Delete all household invites
    console.log('Deleting household invites...');
    await prisma.householdInvite.deleteMany();
    
    // Update all users to remove household references
    console.log('Updating users to remove household references...');
    await prisma.user.updateMany({
      data: {
        householdId: null
      }
    });
    
    // Finally, delete all households
    console.log('Deleting households...');
    await prisma.household.deleteMany();
    
    console.log('All households and related data have been deleted successfully!');
  } catch (error) {
    console.error('Error deleting households:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllHouseholds(); 