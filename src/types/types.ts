export type LeaderboardDataFormat1 = {
    rank: string;
    player_id: string;
    match_id: string;
    match_queue_id: string;
    player_net_kills: string;
    player_bot_kills: string;
  };
  
  export type LeaderboardDataFormat2 = {
    classname: string;
    totaldamage: string;
    damagetaken: string;
    totalkills: string;
    totaltime: string;
    totalmatches: string;
    totaldeaths: string;
  };
  
  export type LeaderboardData = LeaderboardDataFormat1 | LeaderboardDataFormat2;
  
  export type Format = {
    display: string;
    format: string;
  };
  