import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyHouseholdMembership() {
  console.log('Starting household membership verification...');

  try {
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

    for (const user of usersWithHousehold) {
      // Case 1: User has householdId but household doesn't exist
      if (!user.household) {
        console.log(`User ${user.id} (${user.email}) has invalid householdId: ${user.householdId}`);
        await prisma.user.update({
          where: { id: user.id },
          data: { householdId: null }
        });
        fixedCount++;
        continue;
      }

      // Case 2: User has householdId but is not in the household's members
      const isMember = user.household.members.some(member => member.id === user.id);
      if (!isMember) {
        console.log(`User ${user.id} (${user.email}) is not a member of household ${user.householdId}`);
        await prisma.user.update({
          where: { id: user.id },
          data: { householdId: null }
        });
        fixedCount++;
      }
    }

    console.log(`Fixed ${fixedCount} users with inconsistent household membership`);
    console.log('Household membership verification completed successfully!');
  } catch (error) {
    console.error('Error during household membership verification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyHouseholdMembership()
  .catch(console.error); 