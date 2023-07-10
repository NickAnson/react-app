import React, { useEffect, useState } from "react";

const getQueueType = (matchQueueId: string): string => {
  const queueTypes: { [key: string]: string } = {
    "474": "Solo's",
    "475": "Trio's",
    "476": "Squad's",
    "477": "War's",
    "10188": "Custom Solo's",
    "10189": "Custom Duo's",
    "10205": "Custom Trio's",
  };

  return queueTypes[matchQueueId] || "Unknown";
};

interface PlayerData {
  avg_players: number;
  match_queue_id: string;
  region: string;
}

interface ClassWinPercentage {
  parameter: string;
  lengthOfTime: string;
}

const ClassWinPercentage: React.FC<ClassWinPercentage> = ({
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
          `http://localhost:7500/api/aggregate/class/win/${parameter}`
        );
        if (!isMounted) {
          return;
        }
        const temp = await response.json();
        const data: PlayerData[] = temp.map((item: any) => ({
          avg_players: item.ratio,
          match_queue_id: item.first_place_match_queue_id,
          region: item.class_name,
        }));
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

  // Group player data by match_queue_id
  const groupedData: { [key: string]: PlayerData[] } = {};
  playerData.forEach((player) => {
    if (!groupedData[player.match_queue_id]) {
      groupedData[player.match_queue_id] = [];
    }
    groupedData[player.match_queue_id].push(player);
  });

  // Render player data
  return (
    <div className="container">
      <div className="summary">
        <h1 className="title">{lengthOfTime}</h1>
      </div>
      <div className="queue-stats">
        {Object.keys(groupedData).map((matchQueueId) => (
          <div key={matchQueueId} className="queue-stats-item">
            <h4>{getQueueType(matchQueueId)}</h4>
            {groupedData[matchQueueId].map((player, index) => (
              <div key={index}>
                <p className="value">
                  {player.region}: {(player.avg_players * 100).toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassWinPercentage;
