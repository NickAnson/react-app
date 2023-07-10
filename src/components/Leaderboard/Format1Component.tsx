import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import { LeaderboardDataFormat1 } from "../../types/types";
import { Link } from "react-router-dom";

type Props = {
  data: LeaderboardDataFormat1[];
};

const Format1Component: React.FC<Props> = ({ data }) => {
  const [selectedQueueIndex, setSelectedQueueIndex] = useState(0);

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

  const queueIds = [
    ...new Set(data?.map((item: any) => item.match_queue_id) || []),
  ];

  const selectedQueueId = queueIds[selectedQueueIndex];

  const filteredData = data.filter(
    (item) => item.match_queue_id === selectedQueueId
  );

  const handleQueueChange = (
    _event: React.ChangeEvent<{}>,
    newValue: number
  ) => {
    setSelectedQueueIndex(newValue);
  };

  // Define your custom order of keys here
  const displayedKeys = ["rank", "name", "match_id", "player_net_kills"];

  return (
    <div>
      <Box
        className="matches-container"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tabs
          value={selectedQueueIndex}
          onChange={handleQueueChange}
          aria-label="Queue ID tabs"
        >
          {queueIds.map((queueId, _index) => (
            <Tab
              className="queue-select"
              key={queueId}
              label={queueIdMapping[queueId] || queueId}
            />
          ))}
        </Tabs>
      </Box>

      <TableContainer component={Paper} className="matches-container">
        <Table className="matches-table" aria-label="simple table">
          <TableHead>
            <TableRow>
              {displayedKeys.map((header) => (
                <TableCell className="table-head table-cell" key={header}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row: any, index) => (
              <TableRow key={index}>
                {displayedKeys.map((header) => (
                  <TableCell className="table-row table-cell" key={header}>
                    {header === "name" ? (
                      <Link to={`/stats/${row["player_id"]}`}>
                        {row[header]}
                      </Link>
                    ) : header === "match_id" ? (
                      <Link to={`/match/${row[header]}`}>{row[header]}</Link>
                    ) : (
                      row[header]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Format1Component;
