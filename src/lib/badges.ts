// Create: src/lib/badges.ts
import prisma from '@/lib/prisma';
// ✅ Define the badge types locally instead of importing from Prisma
export type BadgeType = 'PARTICIPATION' | 'COMPETITION_MILESTONE' | 'SPECIAL_ACHIEVEMENT' | 'PROFILE_COMPLETION';

export interface BadgeRule {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  type: BadgeType; // ✅ Use the local type
  requirement?: number;
  checkCondition: (userId: number, userData?: any) => Promise<boolean>;
}

// Define all badge rules
export const BADGE_RULES: BadgeRule[] = [
  {
    id: 'early_member',
    name: 'Early Member',
    description: 'One of the first 100 members to join Cosbaii',
    iconUrl: '/badges/early-member.svg',
    type: 'SPECIAL_ACHIEVEMENT',
    checkCondition: async (userId: number) => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, createdAt: true }
      });
      
      if (!user) return false;
      
      // Count users created before this user
      const usersBefore = await prisma.user.count({
        where: {
          createdAt: { lt: user.createdAt }
        }
      });
      
      return usersBefore < 100; // First 100 users
    }
  },
  
  {
    id: 'competition_starter',
    name: 'Competition Starter',
    description: 'Participated in your first competition',
    iconUrl: '/badges/first-competition.svg',
    type: 'PARTICIPATION',
    requirement: 1,
    checkCondition: async (userId: number) => {
      const participationCount = await prisma.competitionParticipant.count({
        where: { userId }
      });
      return participationCount >= 1;
    }
  },
  
  {
    id: 'competition_enthusiast',
    name: 'Competition Enthusiast',
    description: 'Participated in 5 competitions',
    iconUrl: '/badges/five-competitions.svg',
    type: 'PARTICIPATION',
    requirement: 5,
    checkCondition: async (userId: number) => {
      const participationCount = await prisma.competitionParticipant.count({
        where: { userId }
      });
      return participationCount >= 5;
    }
  },
  
  {
    id: 'competition_veteran',
    name: 'Competition Veteran',
    description: 'Participated in 25 competitions',
    iconUrl: '/badges/veteran.svg',
    type: 'COMPETITION_MILESTONE',
    requirement: 25,
    checkCondition: async (userId: number) => {
      const participationCount = await prisma.competitionParticipant.count({
        where: { userId }
      });
      return participationCount >= 25;
    }
  },
  
  {
    id: 'competition_legend',
    name: 'Competition Legend',
    description: 'Participated in 50 competitions',
    iconUrl: '/badges/legend.svg',
    type: 'COMPETITION_MILESTONE',
    requirement: 50,
    checkCondition: async (userId: number) => {
      const participationCount = await prisma.competitionParticipant.count({
        where: { userId }
      });
      return participationCount >= 50;
    }
  },
  
  {
    id: 'champion',
    name: 'Champion',
    description: 'Won your first competition',
    iconUrl: '/badges/champion.svg',
    type: 'SPECIAL_ACHIEVEMENT',
    checkCondition: async (userId: number) => {
      const championCount = await prisma.competitionParticipant.count({
        where: { 
          userId,
          position: 'CHAMPION'
        }
      });
      return championCount >= 1;
    }
  },
  
  {
    id: 'multiple_champion',
    name: 'Multiple Champion',
    description: 'Won 5 competitions',
    iconUrl: '/badges/multiple-champion.svg',
    type: 'SPECIAL_ACHIEVEMENT',
    requirement: 5,
    checkCondition: async (userId: number) => {
      const championCount = await prisma.competitionParticipant.count({
        where: { 
          userId,
          position: 'CHAMPION'
        }
      });
      return championCount >= 5;
    }
  },
  
  {
    id: 'finder',
    name: 'Event Finder',
    description: 'Submitted your first competition for review',
    iconUrl: '/badges/organizer.svg',
    type: 'SPECIAL_ACHIEVEMENT',
    checkCondition: async (userId: number) => {
      const competitionsSubmitted = await prisma.competition.count({
        where: { submittedById: userId }
      });
      return competitionsSubmitted >= 1;
    }
  },
  
  {
    id: 'verified_cosplayer',
    name: 'Verified Cosplayer',
    description: 'Had your first competition result verified by an admin',
    iconUrl: '/badges/verified.svg',
    type: 'SPECIAL_ACHIEVEMENT',
    checkCondition: async (userId: number) => {
      const verifiedParticipations = await prisma.competitionParticipant.count({
        where: { 
          userId,
          verified: true
        }
      });
      return verifiedParticipations >= 1;
    }
  },
  
  {
    id: 'profile_complete',
    name: 'Profile Master',
    description: 'Completed your cosplay profile with all details',
    iconUrl: '/badges/profile-complete.svg',
    type: 'SPECIAL_ACHIEVEMENT',
    checkCondition: async (userId: number) => {
      const profile = await prisma.profile.findUnique({
        where: { userId },
        select: {
          displayName: true,
          bio: true,
          profilePicture: true,
          cosplayerType: true,
          yearsOfExperience: true,
          specialization: true
        }
      });
      
      if (!profile) return false;
      
      // Check if all key fields are filled
      return !!(
        profile.displayName && 
        profile.bio && 
        profile.profilePicture !== '/images/default-avatar.png' &&
        profile.yearsOfExperience !== null &&
        profile.specialization
      );
    }
  }
];

export async function initializeBadges() {
  console.log('Initializing badges...');
  
  for (const rule of BADGE_RULES) {
    const existingBadge = await prisma.badge.findFirst({
      where: { name: rule.name }
    });
    
    if (!existingBadge) {
      await prisma.badge.create({
        data: {
          name: rule.name,
          description: rule.description,
          iconUrl: rule.iconUrl,
          type: rule.type,
          requirement: rule.requirement || null
        }
      });
      console.log(`✅ Created badge: ${rule.name}`);
    }
  }
}

export async function checkAndAwardBadges(userId: number, triggerEvent?: string) {
  console.log(`Checking badges for user ${userId} (trigger: ${triggerEvent})`);
  
  const newBadges: string[] = [];
  
  for (const rule of BADGE_RULES) {
    // Check if user already has this badge
    const existingUserBadge = await prisma.userBadge.findFirst({
      where: {
        userId,
        badge: { name: rule.name }
      }
    });
    
    if (existingUserBadge) continue; // User already has this badge
    
    // Check if user meets the condition
    try {
      const meetsCondition = await rule.checkCondition(userId);
      
      if (meetsCondition) {
        // Find the badge in database
        const badge = await prisma.badge.findFirst({
          where: { name: rule.name }
        });
        
        if (badge) {
          // Award the badge
          await prisma.userBadge.create({
            data: {
              userId,
              badgeId: badge.id
            }
          });
          
          newBadges.push(rule.name);
          console.log(`🏆 Awarded badge "${rule.name}" to user ${userId}`);
          
          // Create notification for the new badge
          await createBadgeNotification(userId, rule.name, rule.description);
        }
      }
    } catch (error) {
      console.error(`Error checking badge condition for ${rule.name}:`, error);
    }
  }
  
  return newBadges;
}

// Update: src/lib/badges.ts
async function createBadgeNotification(userId: number, badgeName: string, description: string) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type: 'BADGE_AWARDED',
        title: 'New Badge Earned!',
        message: `🏆 You earned the "${badgeName}" badge! ${description}`,
        relatedId: null, // ✅ Use relatedId instead of data
        isRead: false,   // ✅ Use isRead instead of read
      }
    });
  } catch (error) {
    console.error('Error creating badge notification:', error);
  }
}

export async function getUserBadges(userId: number) {
  return await prisma.userBadge.findMany({
    where: { userId },
    include: {
      badge: true
    },
    orderBy: { awardedAt: 'desc' }
  });
}

// Update: src/lib/badges.ts
export async function getBadgeProgress(userId: number) {
  console.log('Getting badge progress for user:', userId);
  
  const progress = [];
  
  for (const rule of BADGE_RULES) {
    try {
      const userBadge = await prisma.userBadge.findFirst({
        where: {
          userId,
          badge: { name: rule.name }
        },
        include: { badge: true }
      });
      
      let currentProgress = 0;
      
      if (rule.requirement) {
        // Calculate current progress for milestone badges
        if (rule.id.includes('competition') && rule.id !== 'multiple_champion') {
          currentProgress = await prisma.competitionParticipant.count({
            where: { userId }
          });
        } else if (rule.id === 'multiple_champion') {
          currentProgress = await prisma.competitionParticipant.count({
            where: { 
              userId,
              position: 'CHAMPION'
            }
          });
        }
      }
      
      progress.push({
        badge: {
          id: userBadge?.badge?.id || 0,
          name: rule.name,
          description: rule.description,
          iconUrl: rule.iconUrl,
          type: rule.type,
          requirement: rule.requirement
        },
        earned: !!userBadge,
        awardedAt: userBadge?.awardedAt ? userBadge.awardedAt.toISOString() : null,
        currentProgress,
        progressPercentage: rule.requirement ? Math.min((currentProgress / rule.requirement) * 100, 100) : (userBadge ? 100 : 0)
      });
    } catch (error) {
      console.error(`Error calculating progress for badge ${rule.name}:`, error);
      
      // Add default progress entry on error
      progress.push({
        badge: {
          id: 0,
          name: rule.name,
          description: rule.description,
          iconUrl: rule.iconUrl,
          type: rule.type,
          requirement: rule.requirement
        },
        earned: false,
        awardedAt: null,
        currentProgress: 0,
        progressPercentage: 0
      });
    }
  }
  
  console.log('Badge progress calculated:', progress.length, 'badges');
  return progress;
}
