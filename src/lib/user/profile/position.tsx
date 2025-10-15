export interface PositionInfo {
  text: string;
  bgColor: string;
  textColor: string;
  icon: boolean;
}

export function getPositionInfo(position: string): PositionInfo {
  const positionMap: Record<string, PositionInfo> = {
    CHAMPION: {
      text: "Champion",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      icon: true,
    },
    FIRST_PLACE: {
      text: "1st Place",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      icon: true,
    },
    SECOND_PLACE: {
      text: "2nd Place",
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
      icon: true,
    },
    THIRD_PLACE: {
      text: "3rd Place",
      bgColor: "bg-orange-100",
      textColor: "text-orange-800",
      icon: true,
    },
    PARTICIPANT: {
      text: "Participant",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      icon: false,
    },
  };

  return positionMap[position] || positionMap.PARTICIPANT;
}