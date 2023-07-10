import React, { useEffect, useState } from "react";

interface Profile {
  player_id: string;
  name: string;
  real_kills?: string;
  total_damage?: string;
  total_games?: string;
}

interface Props {
  dynamicVariable: string;
}

const HighestPlayerStats: React.FC<Props> = ({ dynamicVariable }) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:7500/api/leaderboard/gethighestcombined/format/${dynamicVariable}/86400`
        );
        let temp = await response.json();

        if (temp.length > 0) {
          setProfile(temp[0]);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [dynamicVariable]);

  return (
    <div className="top-stats-profile-overview">
      {profile ? (
        <div>
          <h2>
            Daily
            {profile.real_kills && " Kills"}
            {profile.total_damage && " Damage"}
            {profile.total_games && " Games"}
          </h2>
          <p>
            <a href={`/stats/${profile.player_id}`}>{profile.name}</a>
          </p>
          {profile.real_kills && <p>Human Kills: {profile.real_kills}</p>}
          {profile.total_damage && <p>Damage: {profile.total_damage}</p>}
          {profile.total_games && <p>Games: {profile.total_games}</p>}
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default HighestPlayerStats;
