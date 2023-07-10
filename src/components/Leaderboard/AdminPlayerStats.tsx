import React, { useEffect, useState } from "react";

const getQueueType = (matchQueueId: string): string => {
  const queueTypes: { [key: string]: string } = {
    "474": "Solo's",
    "475": "Trio's",
    "476": "Squad's",
    "477": "Realm Wars",
    "10188": "Custom Solo's",
    "10189": "Custom Duo's",
    "10205": "Custom Trio's",
  };

  return queueTypes[matchQueueId] || "Unknown";
};

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

interface PlayerData {
  total_players: number;
  unique_players: number;
  match_queue_id: string;
}

interface PlayerStatsProps {
  parameter: string;
  lengthOfTime: string;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({
  parameter,
  lengthOfTime,
}) => {
  const [playerData, setPlayerData] = useState<PlayerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPlayerStats = async () => {
      try {
        const response = await fetch(
          `http://localhost:7500/api/aggregate/players/overview/${parameter}`
        );
        if (!isMounted) {
          return;
        }
        const temp = await response.json();
        const data: PlayerData[] = temp;
        setPlayerData(data);
        setLoading(false);
      } catch (err: any) {
        if (!isMounted) {
          return;
        }
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPlayerStats();

    return () => {
      isMounted = false;
    };
  }, [parameter]);

  if (loading) {
    return (
      <div className="container">
        <div className="summary">
          <div>Loading Stats...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!playerData.length) {
    return <div>No Data Found</div>;
  }

  let totalPlayers = 0;
  let totalUniquePlayers = 0;
  playerData.forEach((player) => {
    totalPlayers += parseInt(player.total_players.toString());
    totalUniquePlayers += parseInt(player.unique_players.toString());
  });

  // render player data
  return (
    <div className="container">
      <div className="summary">
        <h1 className="title">{lengthOfTime}</h1>
        <p className="value">Total players: {formatNumber(totalPlayers)}</p>
        <p className="value">
          Unique players: {formatNumber(totalUniquePlayers)}
        </p>
      </div>
      <div className="queue-stats">
        {playerData.map((player, index) => (
          <div key={index} className="queue-stats-item">
            <h5>{getQueueType(player.match_queue_id)}</h5>
            <p className="value">Total: {formatNumber(player.total_players)}</p>
            <p className="value">
              Unique: {formatNumber(player.unique_players)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerStats;
