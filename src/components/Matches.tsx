import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { useParams } from "react-router-dom";

interface Player {
  player_id: number;
  name: string;
  class_name: string;
  kills_player: number;
  kills_bot: number;
  damage_player: number;
  healing_player: number;
  healing_player_self: number;
  deaths: number;
  team_id: number;
  placement: number;
}

interface Match {
  match_id: number;
  duration_secs: number;
}

type MatchesData = [Match[], Player[]];

interface Team {
  team_id: number;
  players: Player[];
}

const Matches: React.FC = () => {
  const { "*": wildcard } = useParams();

  const [matches, setMatches] = useState<MatchesData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [squished, setSquished] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const fetchMatches = async () => {
      try {
        let response = await fetch(
          `http://localhost:7500/api/matches/${wildcard}`
        );
        if (!isMounted) {
          return;
        }
        let temp = await response.json();
        const data: MatchesData = temp;
        setMatches(data);
        setLoading(false);
      } catch (err: any) {
        if (!isMounted) {
          return;
        }
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMatches();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSquish = () => {
    setSquished(!squished);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (matches) {
    const [matchesData, playersData] = matches;

    const teamMap = playersData.reduce((acc: any, player: Player) => {
      (acc[player.team_id] = acc[player.team_id] || []).push(player);
      return acc;
    }, {});

    const teams: Team[] = Object.keys(teamMap)
      .map((team_id) => ({
        team_id: parseInt(team_id),
        players: teamMap[team_id],
      }))
      .sort(
        (a: Team, b: Team) => a.players[0].placement - b.players[0].placement
      );

    const squishedTeams = squished
      ? teams.map((team) => ({
          ...team,
          players:
            team.players.length === 1
              ? team.players
              : [
                  {
                    ...team.players[0],
                    kills_player: team.players.reduce(
                      (sum, player) =>
                        sum + parseInt(player.kills_player.toString()),
                      0
                    ),
                    kills_bot: team.players.reduce(
                      (sum, player) =>
                        sum + parseInt(player.kills_bot.toString()),
                      0
                    ),
                    damage_player: team.players.reduce(
                      (sum, player) =>
                        sum + parseInt(player.damage_player.toString()),
                      0
                    ),
                    healing_player: team.players.reduce(
                      (sum, player) =>
                        sum + parseInt(player.healing_player.toString()),
                      0
                    ),
                    healing_player_self: team.players.reduce(
                      (sum, player) =>
                        sum + parseInt(player.healing_player_self.toString()),
                      0
                    ),
                    deaths: team.players.reduce(
                      (sum, player) => sum + parseInt(player.deaths.toString()),
                      0
                    ),
                    name: team.players.map((player) => player.name[0]).join(""),
                  },
                ],
        }))
      : teams;

    return (
      <div className="match-data">
        {matchesData.map((match) => (
          <div key={match.match_id} className="matches-container">
            <h2>Match ID: {match.match_id}</h2>
            <h5>
              Player Count:{" "}
              {teams.reduce((count, team) => count + team.players.length, 0)}
            </h5>
            <Button onClick={handleSquish}>
              {squished ? "Expand" : "Squish"} Teams
            </Button>

            <TableContainer component={Paper}>
              <Table className="matches-table">
                <TableHead>
                  <TableRow>
                    <TableCell className="table-head table-cell">
                      Placement
                    </TableCell>
                    <TableCell className="table-head table-cell">
                      Name
                    </TableCell>
                    <TableCell className="table-head table-cell">
                      Kills
                    </TableCell>
                    <TableCell className="table-head table-cell">
                      Bot Kills
                    </TableCell>
                    <TableCell className="table-head table-cell">
                      Damage
                    </TableCell>
                    <TableCell className="table-head table-cell">
                      Teammate Healing
                    </TableCell>
                    <TableCell className="table-head table-cell">
                      Self Healing
                    </TableCell>
                    <TableCell className="table-head table-cell">
                      Deaths
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {squishedTeams.map((team) =>
                    team.players.map((player: Player, playerIndex: number) => (
                      <TableRow
                        key={player.player_id}
                        className={
                          playerIndex === 0
                            ? "team-first-row"
                            : playerIndex === team.players.length - 1
                            ? "team-last-row"
                            : ""
                        }
                      >
                        {playerIndex === 0 && (
                          <TableCell
                            className="table-row table-cell"
                            rowSpan={team.players.length}
                          >
                            {player.placement}
                          </TableCell>
                        )}
                        <TableCell className="table-row table-cell">
                          {!squished && (
                            <a href={`/stats/${player.player_id}`}>
                              {player.name}
                            </a>
                          )}
                          {squished && player.name}
                        </TableCell>
                        <TableCell className="table-row table-cell">
                          {player.kills_player}
                        </TableCell>
                        <TableCell className="table-row table-cell">
                          {player.kills_bot}
                        </TableCell>
                        <TableCell className="table-row table-cell">
                          {player.damage_player}
                        </TableCell>
                        <TableCell className="table-row table-cell">
                          {player.healing_player}
                        </TableCell>
                        <TableCell className="table-row table-cell">
                          {player.healing_player_self}
                        </TableCell>
                        <TableCell className="table-row table-cell">
                          {player.deaths}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ))}
      </div>
    );
  }

  return <div>No Matches Found</div>;
};

export default Matches;
