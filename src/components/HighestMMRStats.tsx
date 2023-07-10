import React, { useEffect, useState } from "react";

interface PlayerProfile {
  playerid: string;
  queuetypeid: number;
  mmrrankingnumber: string;
}

interface Props {
  dynamicVariable: string;
}

let queueTranslate = {
  474: "Solo",
  475: "Duo",
};

const HighestMMRStats: React.FC<Props> = ({ dynamicVariable }) => {
  const [profiles, setProfiles] = useState<PlayerProfile[]>([]);
  const whitelist = [474, 475]; // You can update this array to include all queuetypeid you want to whitelist

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch(
          `http://localhost:7500/api/leaderboard/gettop/format/${dynamicVariable}`
        );
        const data: PlayerProfile[] = await response.json();

        const whitelistedProfiles = data.filter((profile) =>
          whitelist.includes(profile.queuetypeid)
        );

        setProfiles(whitelistedProfiles);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
  }, [dynamicVariable]);

  return (
    <div className="top-stats-profile-overview-mmr">
      {profiles.length > 0 ? (
        profiles.map((profile, index) => (
          <div key={index} className="profile-box">
            <h2>Top {queueTranslate[profile.queuetypeid]} MMR</h2>
            <p></p>
            <p>MMR: {profile.mmrrankingnumber}</p>
            <a href={`/stats/${profile.playerid}`}>
              Player ID: {profile.playerid}
            </a>
          </div>
        ))
      ) : (
        <p>Loading profiles...</p>
      )}
    </div>
  );
};

export default HighestMMRStats;
