import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixHouseholdMembership() {
  try {
    console.log('Starting to fix household membership inconsistencies...');
    
    // Get all users with a householdId
    const usersWithHousehold = await prisma.user.findMany({
      where: {
        householdId: {
          not: null
        }
      },
      include: {
        household: {
          include: {
            members: true
          }
        }
      }
    });
    
    console.log(`Found ${usersWithHousehold.length} users with householdId set`);
    
    let fixedCount = 0;
    
    // Check each user's household membership
    for (const user of usersWithHousehold) {
      if (!user.household) {
        // User has a householdId but the household doesn't exist
        console.log(`Fixing user ${user.username} (${user.id}): household doesn't exist`);
        await prisma.user.update({
          where: { id: user.id },
          data: { householdId: null }
        });
        fixedCount++;
      } else {
        // Check if user is actually a member of the household
        const isMember = user.household.members.some(member => member.id === user.id);
        if (!isMember) {
          console.log(`Fixing user ${user.username} (${user.id}): not a member of household ${user.household.name}`);
          await prisma.user.update({
            where: { id: user.id },
            data: { householdId: null }
          });
          fixedCount++;
        }
      }
    }
    
    console.log(`Fixed ${fixedCount} users with inconsistent household membership`);
    console.log('Household membership fix completed successfully!');
  } catch (error) {
    console.error('Error fixing household membership:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixHouseholdMembership(); 