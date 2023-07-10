import { useState, useCallback } from 'react';
import { Format, LeaderboardData } from '../types/types';

export const useLeaderboardData = (formatIds: Format[]) => {
  const [data, setData] = useState<Record<string, LeaderboardData[]>>({});

  const fetchData = useCallback(async () => {
    let tempData: Record<string, LeaderboardData[]> = {};
    for (let formatId of formatIds) {
      const result = await fetch(
        `http://localhost:7500/api/leaderboard/gettop/format/${formatId.format}`
      );
      let temp = await result.json();
      tempData[formatId.format] = temp;
    }
    setData(tempData);
  }, [formatIds]);

  return { data, fetchData };
};
