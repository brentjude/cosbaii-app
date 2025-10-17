import prisma from "@/lib/prisma";

type BadgeType = 
  | "PROFILE_COMPLETION" 
  | "PARTICIPATION" 
  | "COMPETITION_MILESTONE" 
  | "SPECIAL_ACHIEVEMENT";

interface Badge {
  id: number;
  name: string;
  description: string;
  iconUrl: string;
  type: BadgeType;
  requirement: number | null;
}

interface BadgeCheckFunction {
  (userId: number): Promise<boolean>;
}

interface BadgeDefinition extends Badge {
  checkFunction: BadgeCheckFunction;
}

// ✅ Badge definitions with check functions
export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // Profile Completion Badges
  {
    id: 1,
    name: "Profile Complete",
    description: "Complete your profile with all basic information",
    iconUrl: "/badges/profile-complete.png",
    type: "PROFILE_COMPLETION",
    requirement: null,
    checkFunction: async (userId: number) => {
      const profile = await prisma.profile.findUnique({
        where: { userId },
      });
      
      return !!(
        profile &&
        profile.displayName &&
        profile.bio &&
        profile.profilePicture !== "/images/default-avatar.png"
      );
    },
  },
  {
    id: 2,
    name: "Social Butterfly",
    description: "Link at least 3 social media accounts",
    iconUrl: "/badges/social-butterfly.png",
    type: "PROFILE_COMPLETION",
    requirement: 3,
    checkFunction: async (userId: number) => {
      const profile = await prisma.profile.findUnique({
        where: { userId },
      });
      
      if (!profile) return false;
      
      const linkedAccounts = [
        profile.facebookUrl,
        profile.instagramUrl,
        profile.twitterUrl,
        profile.tiktokUrl,
        profile.youtubeUrl,
      ].filter(Boolean).length;
      
      return linkedAccounts >= 3;
    },
  },

  // Participation Badges
  {
    id: 3,
    name: "First Steps",
    description: "Participate in your first competition",
    iconUrl: "/badges/first-steps.png",
    type: "PARTICIPATION",
    requirement: 1,
    checkFunction: async (userId: number) => {
      const count = await prisma.competitionParticipant.count({
        where: {
          userId,
          status: { not: "REJECTED" },
        },
      });
      return count >= 1;
    },
  },
  {
    id: 4,
    name: "Rising Star",
    description: "Participate in 5 competitions",
    iconUrl: "/badges/rising-star.png",
    type: "PARTICIPATION",
    requirement: 5,
    checkFunction: async (userId: number) => {
      const count = await prisma.competitionParticipant.count({
        where: {
          userId,
          status: { not: "REJECTED" },
        },
      });
      return count >= 5;
    },
  },
  {
    id: 5,
    name: "Veteran Cosplayer",
    description: "Participate in 10 competitions",
    iconUrl: "/badges/veteran.png",
    type: "PARTICIPATION",
    requirement: 10,
    checkFunction: async (userId: number) => {
      const count = await prisma.competitionParticipant.count({
        where: {
          userId,
          status: { not: "REJECTED" },
        },
      });
      return count >= 10;
    },
  },
  {
    id: 6,
    name: "Competition Legend",
    description: "Participate in 25 competitions",
    iconUrl: "/badges/legend.png",
    type: "PARTICIPATION",
    requirement: 25,
    checkFunction: async (userId: number) => {
      const count = await prisma.competitionParticipant.count({
        where: {
          userId,
          status: { not: "REJECTED" },
        },
      });
      return count >= 25;
    },
  },

  // Competition Milestone Badges
  {
    id: 7,
    name: "Champion",
    description: "Win first place in a competition",
    iconUrl: "/badges/champion.png",
    type: "COMPETITION_MILESTONE",
    requirement: null,
    checkFunction: async (userId: number) => {
      const firstPlace = await prisma.competitionParticipant.findFirst({
        where: {
          userId,
          position: "CHAMPION",
          status: "APPROVED",
        },
      });
      return !!firstPlace;
    },
  },
  {
    id: 8,
    name: "Top Performer",
    description: "Place in the top 3 in any competition",
    iconUrl: "/badges/top-performer.png",
    type: "COMPETITION_MILESTONE",
    requirement: null,
    checkFunction: async (userId: number) => {
      const topThree = await prisma.competitionParticipant.findFirst({
        where: {
          userId,
          position: {
            in: ["CHAMPION", "FIRST_PLACE", "SECOND_PLACE"],
          },
          status: "APPROVED",
        },
      });
      return !!topThree;
    },
  },

  // Special Achievement Badges
  {
    id: 9,
    name: "Cosbaii Founding Member",
    description: "One of the first 100 users to join",
    iconUrl: "/badges/early-adopter.png",
    type: "SPECIAL_ACHIEVEMENT",
    requirement: null,
    checkFunction: async (userId: number) => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, createdAt: true },
      });
      
      if (!user) return false;
      
      const earlyUsers = await prisma.user.count({
        where: {
          createdAt: {
            lte: user.createdAt,
          },
        },
      });
      
      return earlyUsers <= 100;
    },
  },

  {
  id: 12,
  name: "Featured Showcase",
  description: "Complete 3 featured items on your profile",
  iconUrl: "/badges/showcase.png",
  type: "PROFILE_COMPLETION",
  requirement: 3,
  checkFunction: async (userId: number) => {
    // ✅ Check if user has 3 featured items (any type)
    const featuredCount = await prisma.featuredItem.count({
      where: { userId },
    });
    
    return featuredCount >= 3;
  },
},
{
  id: 13,
  name: "Competition Spotlight",
  description: "Feature 3 competition credentials on your profile",
  iconUrl: "/badges/spotlight.png",
  type: "PROFILE_COMPLETION",
  requirement: 3,
  checkFunction: async (userId: number) => {
    // ✅ Check if user has 3 featured items where type is "competition"
    const competitionFeaturedCount = await prisma.featuredItem.count({
      where: {
        userId,
        type: "competition", // ✅ Only count competition-type featured items
      },
    });
    
    return competitionFeaturedCount >= 3;
  },
},
  {
    id: 14,
    name: "Champion Elite",
    description: "Champion in 5 competitions",
    iconUrl: "/badges/champion-elite.png",
    type: "COMPETITION_MILESTONE",
    requirement: 5,
    checkFunction: async (userId: number) => {
      const count = await prisma.competitionParticipant.count({
        where: {
          userId,
          position: "CHAMPION",
          status: "APPROVED",
        },
      });
      return count >= 5;
    },
  },
  {
    id: 15,
    name: "Champion Master",
    description: "Champion in 10 competitions",
    iconUrl: "/badges/champion-master.png",
    type: "COMPETITION_MILESTONE",
    requirement: 10,
    checkFunction: async (userId: number) => {
      const count = await prisma.competitionParticipant.count({
        where: {
          userId,
          position: "CHAMPION",
          status: "APPROVED",
        },
      });
      return count >= 10;
    },
  },
  {
    id: 16,
    name: "Champion Legend",
    description: "Champion in 20 competitions",
    iconUrl: "/badges/champion-legend.png",
    type: "COMPETITION_MILESTONE",
    requirement: 20,
    checkFunction: async (userId: number) => {
      const count = await prisma.competitionParticipant.count({
        where: {
          userId,
          position: "CHAMPION",
          status: "APPROVED",
        },
      });
      return count >= 20;
    },
  },
  {
    id: 17,
    name: "Centurion Winner",
    description: "Win 100 competitions (any placement)",
    iconUrl: "/badges/centurion.png",
    type: "COMPETITION_MILESTONE",
    requirement: 100,
    checkFunction: async (userId: number) => {
      const count = await prisma.competitionParticipant.count({
        where: {
          userId,
          position: { not: null },
          status: "APPROVED",
        },
      });
      return count >= 100;
    },
  },
];

// ✅ Function to check and award a single badge
export async function checkAndAwardBadge(
  userId: number,
  badgeDefinition: BadgeDefinition
): Promise<boolean> {
  try {
    const existingBadge = await prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId: badgeDefinition.id,
        },
      },
    });

    if (existingBadge) {
      return false;
    }

    const meetsRequirements = await badgeDefinition.checkFunction(userId);

    if (!meetsRequirements) {
      return false;
    }

    let badge = await prisma.badge.findUnique({
      where: { id: badgeDefinition.id },
    });

    if (!badge) {
      badge = await prisma.badge.create({
        data: {
          id: badgeDefinition.id,
          name: badgeDefinition.name,
          description: badgeDefinition.description,
          iconUrl: badgeDefinition.iconUrl,
          type: badgeDefinition.type,
          requirement: badgeDefinition.requirement,
        },
      });
    }

    await prisma.userBadge.create({
      data: {
        userId,
        badgeId: badge.id,
      },
    });

    await prisma.notification.create({
      data: {
        userId,
        type: "BADGE_EARNED",
        title: "New Badge Earned!",
        message: `You've earned the "${badge.name}" badge! ${badge.description}`,
        relatedId: badge.id,
      },
    });

    return true;
  } catch (error) {
    console.error(`Error checking/awarding badge ${badgeDefinition.name}:`, error);
    return false;
  }
}

export async function checkAllBadges(userId: number): Promise<number> {
  let newBadgesCount = 0;

  for (const badgeDefinition of BADGE_DEFINITIONS) {
    const awarded = await checkAndAwardBadge(userId, badgeDefinition);
    if (awarded) {
      newBadgesCount++;
    }
  }

  return newBadgesCount;
}

export async function initializeBadges(): Promise<void> {
  for (const badge of BADGE_DEFINITIONS) {
    await prisma.badge.upsert({
      where: { id: badge.id },
      update: {
        name: badge.name,
        description: badge.description,
        iconUrl: badge.iconUrl,
        type: badge.type,
        requirement: badge.requirement,
      },
      create: {
        id: badge.id,
        name: badge.name,
        description: badge.description,
        iconUrl: badge.iconUrl,
        type: badge.type,
        requirement: badge.requirement,
      },
    });
  }
}

export async function getUserBadges(userId: number) {
  return await prisma.userBadge.findMany({
    where: { userId },
    include: {
      badge: true,
    },
    orderBy: {
      awardedAt: "desc",
    },
  });
}

export async function getBadgeProgress(userId: number) {
  const progress = [];

  for (const badgeDefinition of BADGE_DEFINITIONS) {
    const hasBadge = await prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId: badgeDefinition.id,
        },
      },
      select: {
        awardedAt: true,
      },
    });

    let currentProgress = 0;

    // Calculate current progress based on badge type
    if (badgeDefinition.type === "PARTICIPATION") {
      currentProgress = await prisma.competitionParticipant.count({
        where: {
          userId,
          status: { not: "REJECTED" },
        },
      });
    } else if (badgeDefinition.type === "COMPETITION_MILESTONE") {
      if (badgeDefinition.id === 7 || badgeDefinition.id === 8) {
        // Champion or Top Performer
        currentProgress = await prisma.competitionParticipant.count({
          where: {
            userId,
            position: { not: null },
            status: "APPROVED",
          },
        });
      } else if (badgeDefinition.id >= 14 && badgeDefinition.id <= 16) {
        // Champion Elite, Master, Legend
        currentProgress = await prisma.competitionParticipant.count({
          where: {
            userId,
            position: "FIRST_PLACE",
            status: "APPROVED",
          },
        });
      } else if (badgeDefinition.id === 17) {
        // Centurion Winner
        currentProgress = await prisma.competitionParticipant.count({
          where: {
            userId,
            position: { not: null },
            status: "APPROVED",
          },
        });
      }
    }

    const requirement = badgeDefinition.requirement || 1;
    const progressPercentage = Math.min((currentProgress / requirement) * 100, 100);

    progress.push({
      badge: badgeDefinition,
      earned: !!hasBadge,
      awardedAt: hasBadge?.awardedAt || null,
      currentProgress,
      progressPercentage: Math.round(progressPercentage),
    });
  }

  return progress;
}