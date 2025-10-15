import { checkAllBadges } from './badges'; // ✅ Changed from checkAndAwardBadges

/**
 * Trigger badge checks after profile updates
 */
export async function triggerProfileBadges(userId: number): Promise<void> {
  try {
    await checkAllBadges(userId);
  } catch (error) {
    console.error('Error triggering profile badges:', error);
  }
}

/**
 * Trigger badge checks after competition participation
 */
export async function triggerParticipationBadges(userId: number): Promise<void> {
  try {
    await checkAllBadges(userId);
  } catch (error) {
    console.error('Error triggering participation badges:', error);
  }
}

/**
 * Trigger badge checks after competition win/placement
 */
export async function triggerMilestoneBadges(userId: number): Promise<void> {
  try {
    await checkAllBadges(userId);
  } catch (error) {
    console.error('Error triggering milestone badges:', error);
  }
}

/**
 * Trigger all badge checks for a user
 */
export async function triggerAllBadgeChecks(userId: number): Promise<void> {
  try {
    await checkAllBadges(userId);
  } catch (error) {
    console.error('Error triggering all badge checks:', error);
  }
}