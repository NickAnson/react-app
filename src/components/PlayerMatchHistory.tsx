import { useState, useEffect, SetStateAction } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";

type PlayerStat = {
  match_id: string;
  player_id: string;
  team_id: number;
  placement: number;
  name: string;
  level: string;
  deaths: string;
  assists: string;
  class_id: string;
  earned_xp: string;
  kills_bot: string;
  class_name: string;
  damage_taken: string;
  kills_player: string;
  damage_player: string;
  duration_secs: string;
  earned_tokens: string;
  healing_player: string;
  damage_mitigated: string;
  dropped_out_flag: string;
  killing_spree_max: string;
  mines_wards_placed: string;
  damage_done_in_hand: string;
  healing_player_self: string | null;
  region: string;
  match_datetime: string;
  match_queue_id: string;
  match_queue_name: string;
};

function getTimeDifference(end: number) {
  const start = Math.floor(Date.now() / 1000); // Current time in seconds since the epoch
  const timeDifference = Math.abs(start - end);

  if (timeDifference < 60) {
    return "just now";
  }

  const intervals = [
    { name: "weeks", seconds: 604800 },
    { name: "days", seconds: 86400 },
    { name: "hours", seconds: 3600 },
    { name: "minutes", seconds: 60 },
    { name: "seconds", seconds: 1 },
  ];

  let remainingTime = timeDifference;

  for (const interval of intervals) {
    if (remainingTime >= interval.seconds) {
      const count = Math.floor(remainingTime / interval.seconds);

      if (interval.name === "seconds") {
        return count + " " + interval.name + " ago";
      }

      const decimalCount =
        count + (remainingTime % interval.seconds) / interval.seconds;
      return decimalCount.toFixed(1) + " " + interval.name + " ago";
    }
  }

  return "just now";
}

function addOrdinalSuffix(number: number) {
  const suffixes: { [key: number]: string } = {
    1: "st",
    2: "nd",
    3: "rd",
  };

  const specialCases = [11, 12, 13];

  const lastDigit = number % 10;
  const isSpecialCase = specialCases.includes(number % 100);

  const suffix = suffixes[lastDigit] || "th";
  return number + (isSpecialCase ? "th" : suffix);
}

const PlayerMatchHistory = () => {
  const { id } = useParams() || null;

  if (isNaN(id)) {
    // Show error or empty state here
    return <p>Invalid input</p>;
  }

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [playerStats, setPlayerStats] = useState<PlayerStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      let response;
      let data;
      response = await fetch(
        `http://localhost:7500/api/player/id/history/${id}`
      );
      data = await response.json();

      setPlayerStats(data);
      setLoading(false);
    };
    fetchData();
  }, [id, page]);

  const handleChangePage = (_event: any, newPage: SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return <div></div>;
  }

  if (!playerStats.length) {
    return <div>No stats available</div>;
  }

  return (
    <div className="player-match-history">
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="table-head table-cell">Place</TableCell>
              <TableCell className="table-head table-cell">Type</TableCell>
              <TableCell className="table-head table-cell">Date</TableCell>{" "}
              <TableCell className="table-head table-cell">Kills</TableCell>{" "}
              <TableCell className="table-head table-cell">Damage</TableCell>
              <TableCell className="table-head table-cell">Match</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {playerStats
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((player, index) => (
                <TableRow key={index} className="table-row">
                  <TableCell className="table-row table-cell">
                    {addOrdinalSuffix(player.placement)}
                  </TableCell>
                  <TableCell className="table-row table-cell">
                    {player.match_queue_id}
                  </TableCell>
                  <TableCell className="table-row table-cell">
                    {getTimeDifference(parseInt(player.match_datetime))}
                  </TableCell>
                  <TableCell className="table-row table-cell">
                    {player.kills_player}
                  </TableCell>{" "}
                  <TableCell className="table-row table-cell">
                    {player.damage_player}
                  </TableCell>
                  <TableCell className="table-row table-cell">
                    <a href={`/match/${player.match_id}`}>Match</a>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[15, 50, 100]}
          component="div"
          count={playerStats.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className="table-pagination"
        />
      </TableContainer>
    </div>
  );
};

export default PlayerMatchHistory;
