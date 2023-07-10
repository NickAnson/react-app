import { Tab, Tabs, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { LeaderboardData } from "../../types/types";

import Format1Component from "./Format1Component";
import Format2Component from "./Format2Component";

const formatComponents: Record<string, React.FC<any>> = {
  "1": Format1Component,
  "2": Format2Component,
  // Add more mappings here as necessary
};

const formatMapping: { [key: string]: string } = {
  "1": "Kills",
  "2": "Class Stats",

  // Add more mappings as needed...
};

const durationMapping: { [key: string]: string } = {
  "86400": "1 Day",
  "604800": "1 Week",
  "2630000": "1 Month",
  "15780000": "6 Months",
  // Add more mappings as needed...
};

type LeaderboardProps = {
  formatIds: { format: string; display: string; duration: string }[];
};

const Leaderboard: React.FC<LeaderboardProps> = ({ formatIds }) => {
  const [selectedFormatIndex, setSelectedFormatIndex] = useState(0);
  const [selectedDurationIndex, setSelectedDurationIndex] = useState(0);
  const [data, setData] = useState<
    Record<string, Record<string, LeaderboardData[]>>
  >({});

  // Group formatIds by format, with an array of durations
  const formatGroups = formatIds.reduce((acc, curr) => {
    if (!acc[curr.format]) acc[curr.format] = [];
    if (!acc[curr.format].includes(curr.duration)) {
      acc[curr.format].push(curr.duration);
    }
    return acc;
  }, {} as Record<string, string[]>);

  const formats = Object.keys(formatGroups);
  const selectedFormat = formats[selectedFormatIndex];
  const durations = formatGroups[selectedFormat];
  const selectedDuration = durations[selectedDurationIndex];

  useEffect(() => {
    const fetchData = () => {
      formatIds.forEach(async (formatId) => {
        try {
          const result = await fetch(
            `http://localhost:7500/api/leaderboard/gettop/format/${formatId.format}/${formatId.duration}`
          );
          const temp = await result.json();

          setData((prevData) => ({
            ...prevData,
            [formatId.format]: {
              ...(prevData[formatId.format] || {}),
              [formatId.duration]: temp,
            },
          }));
        } catch (error) {
          // Handle the error, if necessary
          console.error(error);
        }
      });
    };

    fetchData();
  }, [formatIds]);

  const SpecificComponent = formatComponents[selectedFormat];

  const handleFormatChange = (
    _event: React.ChangeEvent<{}>,
    newValue: number
  ) => {
    setSelectedFormatIndex(newValue);
    setSelectedDurationIndex(0); // Reset the duration index when the format changes
  };

  const handleDurationChange = (
    _event: React.ChangeEvent<{}>,
    newValue: number
  ) => {
    setSelectedDurationIndex(newValue);
  };

  return (
    <Box>
      <div className="matches-container">
        <Box>
          <Tabs
            value={selectedFormatIndex}
            onChange={handleFormatChange}
            aria-label="Format tabs"
            className="custom-tab"
          >
            {formats.map((format, _index) => (
              <Tab key={format} label={formatMapping[format]} />
            ))}
          </Tabs>
        </Box>
        <Box>
          <Tabs
            value={selectedDurationIndex}
            onChange={handleDurationChange}
            aria-label="Duration tabs"
            className="custom-tab-sub"
          >
            {durations.map((duration, _index) => (
              <Tab key={duration} label={durationMapping[duration]} />
            ))}
          </Tabs>
        </Box>
      </div>
      {SpecificComponent && (
        <SpecificComponent
          data={
            data[selectedFormat] && data[selectedFormat][selectedDuration]
              ? data[selectedFormat][selectedDuration]
              : []
          }
        />
      )}
    </Box>
  );
};

export default Leaderboard;
