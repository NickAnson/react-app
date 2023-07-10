import React from "react";

interface PlayerStatsTitleBarProps {
  numOfComponents: number;
  typeOfStats: string;
}

const PlayerStatsTitleBar: React.FC<PlayerStatsTitleBarProps> = ({
  numOfComponents,
  typeOfStats,
}) => {
  const widthPercentage = numOfComponents * 14;
  return (
    <div
      className="player-stats-title-bar"
      style={{ width: `${widthPercentage}%`, minWidth: "400px" }}
    >
      <h1> {typeOfStats} Stats</h1>
    </div>
  );
};

export default PlayerStatsTitleBar;
