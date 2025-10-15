import { TrophyIcon, PaintBrushIcon, BriefcaseIcon } from "@heroicons/react/16/solid";
import { CosplayerType } from "@/types/profile";

export interface CosplayerTypeInfo {
  text: React.ReactElement;
  class: string;
}

export function getCosplayerTypeDisplay(cosplayerType?: CosplayerType | null): CosplayerTypeInfo {
  switch (cosplayerType) {
    case "COMPETITIVE":
      return {
        text: (
          <>
            <TrophyIcon className="w-4 h-4" />
            <span>Competitive Cosplayer</span>
          </>
        ),
        class: "badge-primary",
      };
    case "HOBBY":
      return {
        text: (
          <>
            <PaintBrushIcon className="w-4 h-4" />
            <span>Hobby Cosplayer</span>
          </>
        ),
        class: "badge-secondary",
      };
    case "PROFESSIONAL":
      return {
        text: (
          <>
            <BriefcaseIcon className="w-4 h-4" />
            <span>Pro Cosplayer</span>
          </>
        ),
        class: "badge-accent",
      };
    default:
      return {
        text: <span>Cosplayer</span>,
        class: "badge-outline",
      };
  }
}