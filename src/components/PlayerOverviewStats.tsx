import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tabs,
  Tab,
} from "@mui/material";
import { useParams } from "react-router-dom";

interface PlayerStats {
  [key: string]: string | number;
}

function formatNumber(num: number) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num;
}

const queueIdMapping: { [key: string]: string } = {
  "474": "Solo",
  "482": "Duo's",
  "475": "Trio's",
  "476": "Squads",
  "477": "Realm Wars",
  "10188": "Custom Solo's",
  "10189": "Custom Duo's",
  "10205": "Custom Trio's",
  "10190": "Custom Squad's",
  // Add more mappings as needed...
};

const PlayerStatsComponent: React.FC = () => {
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("daily");
  const { id } = useParams() || null;
  if (isNaN(id)) {
    // Show error or empty state here
    return <p>Invalid input</p>;
  }

  useEffect(() => {
    // Fetch player stats from API for different season IDs
    Promise.all([fetchPlayerStats("86400"), fetchPlayerStats("2630000")])
      .then(([monthlyStats, dailyStats]) => {
        setPlayerStats([...monthlyStats, ...dailyStats]);
      })
      .catch((error) => console.error("Error fetching player stats:", error));
  }, [id]);

  const fetchPlayerStats = async (seasonId: string): Promise<PlayerStats[]> => {
    const playerId = id; // Retrieve the player ID from the URL or other sources

    const apiUrl = `http://localhost:7500/api/player/id/history/aggregate/${playerId}/${seasonId}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    return data.map((stat: PlayerStats) => ({
      ...stat,
      seasonId: seasonId, // Assign the seasonId value to each PlayerStats object
    }));
  };
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  // 2630000 86400
  const getStatsByTab = (): PlayerStats[] => {
    return selectedTab === "monthly"
      ? playerStats.filter((stat) => stat.seasonId === "2630000")
      : playerStats.filter((stat) => stat.seasonId === "86400");
  };

  const getColumnHeading = (key: string): string => {
    // Customize the column headings based on the API key values
    switch (key) {
      case "name_changes":
        return "Name Changes";
      case "times_chickened":
        return "Chick'd";
      case "bot_kills":
        return "Bot Kills";
      case "in_game_time":
        return "Time (secs)";
      case "teammate_healing":
        return "Tmmate healing";
      case "self_healing":
        return "healing";
      case "match_queue_id":
        return "Queue";
      case "damage_taken":
        return "Dmg. Taken";
      // Add more cases for other keys if needed
      default:
        return key;
    }
  };

  const getFormattedValue = (key: string, value: string | number): string => {
    // Customize the output string based on a key's value in a column
    if (key === "kills") {
      return `${value}`;
    }
    if (key === "damage") {
      return `${value}`;
    }
    if (key === "match_queue_id") {
      return `${queueIdMapping[value]}`;
    }
    // Add more custom formatting based on key and value if needed
    return String(value);
  };

  return (
    <div className="player-overview-stats">
      <Tabs
        className="player-overview-stats-tabs"
        value={selectedTab}
        onChange={handleTabChange}
      >
        <Tab
          className="player-overview-stats-tabs-sub"
          label="Daily Stats"
          value="daily"
        />
        <Tab
          className="player-overview-stats-tabs-sub"
          label="Monthly Stats"
          value="monthly"
        />
      </Tabs>

      <div>
        {playerStats.length > 0 ? (
          <div>
            <Table>
              <TableHead>
                <TableRow>
                  {Object.keys(playerStats[0])
                    .filter((key) => key !== "seasonId") // Exclude 'seasonId' from table headers
                    .map((key) => (
                      <TableCell
                        className="player-overview-stats-table-heading"
                        key={key}
                      >
                        {getColumnHeading(key)}
                      </TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {getStatsByTab().map((stat, index) => (
                  <TableRow key={index}>
                    {Object.entries(stat)
                      .filter(([key]) => key !== "seasonId") // Exclude 'seasonId' from table cells
                      .map(([key, value]) => (
                        <TableCell
                          className="player-overview-stats-table-values "
                          key={key}
                        >
                          {getFormattedValue(key, formatNumber(value))}
                        </TableCell>
                      ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p>No Recent Stats</p>
        )}
      </div>
    </div>
  );
};

export default PlayerStatsComponent;
