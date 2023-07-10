import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";

interface PlayerDetails {
  playerid: string;
  portal_id: number;
  platform: string;
  region: string;
  steam_id: string;
  created_datetime: string;
  name: string;
}

const PlayerOverview = () => {
  const { id } = useParams() || null;
  if (isNaN(id)) {
    // Show error or empty state here
    return <p>Invalid input</p>;
  }

  const [playerDetails, setPlayerDetails] = useState<PlayerDetails | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      let response;
      let data;

      response = await fetch(
        `http://localhost:7500/api/player/id/overview/${id}`
      );
      data = await response.json();

      setPlayerDetails(data[0]);
    };
    fetchData();
  }, [id]);

  return (
    <div className="player-overview-container">
      {playerDetails && (
        <>
          <div className="player-details">
            <Box className="player-box">
              {" "}
              {/* Add class name here */}
              <div className="upper-part">
                {" "}
                {/* Add class name here */}
                <Typography variant="caption">
                  Platform: {playerDetails.platform}
                </Typography>
                <Typography variant="caption">
                  Player ID: {playerDetails.playerid}
                </Typography>
              </div>
              <Typography variant="h4" component="div" className="player-name">
                {playerDetails.name}
              </Typography>
              <Typography variant="caption">
                Account Creation Date:{" "}
                {new Date(
                  parseInt(playerDetails.created_datetime) * 1000
                ).toLocaleDateString()}
              </Typography>
            </Box>
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerOverview;
