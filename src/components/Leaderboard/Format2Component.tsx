import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
} from "@mui/material";
import { LeaderboardDataFormat2 } from "../../types/types";
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

type Props = {
  data: LeaderboardDataFormat2[];
};

const Format2Component: React.FC<Props> = ({ data }) => {
  const formattedData = data.map((item) => ({
    Class: item.classname,

    Damage: formatNumber(Number(item.totaldamage)),
    "Damage Taken": formatNumber(Number(item.damagetaken)),
    Kills: formatNumber(Number(item.totalkills)),
    Time: formatNumber(Number(item.totaltime)),
    Matches: formatNumber(Number(item.totalmatches)),
    Deaths: formatNumber(Number(item.totaldeaths)),
  }));

  return (
    <TableContainer component={Paper} className="matches-container">
      <Table className="matches-table" aria-label="simple table">
        <TableHead>
          <TableRow className="table-head table-cell">
            {formattedData.length > 0 &&
              Object.keys(formattedData[0]).map((header) => (
                <TableCell className="table-head table-cell" key={header}>
                  {header}
                </TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {formattedData.map((row: any, index) => (
            <TableRow key={index}>
              {Object.keys(row).map((header) => (
                <TableCell className="table-row table-cell" key={header}>
                  {row[header]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Format2Component;
