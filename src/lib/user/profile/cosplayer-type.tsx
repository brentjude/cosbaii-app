export interface CosplayerTypeInfo {
  text: string;
  class: string;
  description: string;
}

export function getCosplayerTypeInfo(type: string | null | undefined): CosplayerTypeInfo {
  const typeMap: Record<string, CosplayerTypeInfo> = {
    HOBBY: {
      text: "Hobby Cosplayer",
      class: "badge-secondary",
      description: "Cosplays for fun and personal enjoyment",
    },
    COMPETITIVE: {
      text: "Competitive Cosplayer",
      class: "badge-primary",
      description: "Participates in competitions and contests",
    },
    PROFESSIONAL: {
      text: "Professional Cosplayer",
      class: "badge-accent",
      description: "Professional cosplay work and commissions",
    },
  };

  return typeMap[type || 'HOBBY'] || typeMap.HOBBY;
}

// ✅ Add this export for backward compatibility
export const getCosplayerTypeDisplay = getCosplayerTypeInfo;