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
          verifiedAt: { not: null },
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
          verifiedAt: { not: null },
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
          verifiedAt: { not: null },
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
          verifiedAt: { not: null },
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
          position: "FIRST_PLACE",
          verifiedAt: { not: null },
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
          verifiedAt: { not: null },
        },
      });
      return !!topThree;
    },
  },

  // Special Achievement Badges
  {
    id: 9,
    name: "Early Adopter",
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
    id: 10,
    name: "Community Builder",
    description: "Help verify 5 other users' competition participations",
    iconUrl: "/badges/community-builder.png",
    type: "SPECIAL_ACHIEVEMENT",
    requirement: 5,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    checkFunction: async (_userId: number) => {
      // This would require a verification system
      // For now, return false as placeholder
      return false;
    },
  },
];

// ✅ Function to check and award a single badge
export async function checkAndAwardBadge(
  userId: number,
  badgeDefinition: BadgeDefinition
): Promise<boolean> {
  try {
    // Check if user already has this badge
    const existingBadge = await prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId: badgeDefinition.id,
        },
      },
    });

    if (existingBadge) {
      return false; // User already has this badge
    }

    // Check if user meets the requirements
    const meetsRequirements = await badgeDefinition.checkFunction(userId);

    if (!meetsRequirements) {
      return false;
    }

    // Ensure badge exists in database
    let badge = await prisma.badge.findUnique({
      where: { id: badgeDefinition.id },
    });

    if (!badge) {
      // Create badge if it doesn't exist
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

    // Award the badge
    await prisma.userBadge.create({
      data: {
        userId,
        badgeId: badge.id,
      },
    });

    // Create notification
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

// ✅ Function to check all badges for a user
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

// ✅ Function to initialize all badges in the database
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

// ✅ Function to get user's badges
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

// ✅ Function to get badge progress for a user
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
    });

    let currentProgress = 0;

    // Calculate current progress based on badge type
    if (badgeDefinition.type === "PARTICIPATION") {
      currentProgress = await prisma.competitionParticipant.count({
        where: {
          userId,
          verifiedAt: { not: null },
        },
      });
    }

    progress.push({
      badge: badgeDefinition,
      earned: !!hasBadge,
      progress: currentProgress,
      requirement: badgeDefinition.requirement,
    });
  }

  return progress;
}