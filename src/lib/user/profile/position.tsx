import { TrophyIcon } from "@heroicons/react/16/solid";

export interface PositionInfo {
  text: string;
  bgColor: string;
  textColor: string;
  icon: React.ReactElement | null;
}

export function getPositionInfo(position: string): PositionInfo {
  switch (position) {
    case "CHAMPION":
      return {
        text: "Champion",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        icon: <TrophyIcon className="w-3 h-3" />,
      };
    case "FIRST_PLACE":
      return {
        text: "1st Place",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-700",
        icon: <TrophyIcon className="w-3 h-3" />,
      };
    case "SECOND_PLACE":
      return {
        text: "2nd Place",
        bgColor: "bg-gray-100",
        textColor: "text-gray-700",
        icon: <TrophyIcon className="w-3 h-3" />,
      };
    case "THIRD_PLACE":
      return {
        text: "3rd Place",
        bgColor: "bg-orange-100",
        textColor: "text-orange-700",
        icon: <TrophyIcon className="w-3 h-3" />,
      };
    default:
      return {
        text: "Participant",
        bgColor: "bg-blue-100",
        textColor: "text-blue-700",
        icon: null,
      };
  }
}