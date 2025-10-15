export interface UserSettings {
  id: number;
  userId: number;
  showCompetitionCounter: boolean;
  showBadges: boolean;
  lastDisplayNameChange: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingsData {
  showCompetitionCounter?: boolean;
  showBadges?: boolean;
}