// Create: src/lib/badgeTriggers.ts
import { checkAndAwardBadges } from './badges';

export class BadgeTriggers {
  
  // Trigger when user registers
  static async onUserRegistration(userId: number) {
    await checkAndAwardBadges(userId, 'USER_REGISTRATION');
  }
  
  // Trigger when user completes profile
  static async onProfileUpdate(userId: number) {
    await checkAndAwardBadges(userId, 'PROFILE_UPDATE');
  }
  
  // Trigger when user joins a competition
  static async onCompetitionJoin(userId: number) {
    await checkAndAwardBadges(userId, 'COMPETITION_JOIN');
  }
  
  // Trigger when user wins a competition
  static async onCompetitionWin(userId: number) {
    await checkAndAwardBadges(userId, 'COMPETITION_WIN');
  }
  
  // Trigger when user submits a competition
  static async onCompetitionSubmission(userId: number) {
    await checkAndAwardBadges(userId, 'COMPETITION_SUBMISSION');
  }
  
  // Trigger when user gets verified
  static async onVerification(userId: number) {
    await checkAndAwardBadges(userId, 'VERIFICATION');
  }
}