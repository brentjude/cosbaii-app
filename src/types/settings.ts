// Create/Update: src/types/settings.ts
export interface UserSettings {
  id: number;
  userId: number;
  showCompetitionCounter: boolean;
  showBadges: boolean;
  lastDisplayNameChange: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SettingsFormData {
  showCompetitionCounter: boolean;
  showBadges: boolean;
  receiveEmailUpdates?: boolean;
}

export interface UpdateSettingsData {
  showCompetitionCounter?: boolean;
  showBadges?: boolean;
}