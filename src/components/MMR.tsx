import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  XAxis,
} from "recharts";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

interface MmrProps {}

function getTickValues(data: any[], numTicks: number) {
  if (data.length <= numTicks) {
    return data.map((entry) => entry.secondssinceepoch);
  }

  const step = Math.floor(data.length / numTicks);
  const tickValues = data
    .filter((entry, index) => index % step === 0)
    .map((entry) => entry.secondssinceepoch);

  return tickValues;
}

interface MmrState {
  data: Record<string, any[]>;
  loading: boolean;
}

const Mmr: React.FC<MmrProps> = () => {
  const { id } = useParams() || null;

  if (isNaN(id)) {
    return <p>Invalid inpu1t</p>;
  }

  const [state, setState] = useState<MmrState>({
    data: {},
    loading: false,
  });
  const [value, setValue] = React.useState("474"); // Set initial value as "474"

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  var containsOnlyDigits = function containsOnlyDigits(value: string) {
    return /^\d+$/.test(value);
  };
  useEffect(() => {
    const fetchData = async () => {
      setState((prevState) => ({ ...prevState, loading: true }));

      try {
        let res;
        let data;

        if (id && containsOnlyDigits(id)) {
          res = await fetch(
            `http://localhost:7500/api/player/id/mmr/history/${id}`
          );
          data = await res.json();
        }

        const dataByQueue = data.reduce(
          (acc: Record<string, any[]>, item: any) => {
            if (!acc[item.queueid]) acc[item.queueid] = [];
            acc[item.queueid].push({
              ...item,
              secondssinceepoch: new Date(
                Number(item.secondssinceepoch) * 1000
              ).toLocaleDateString(),
              newrankingnumber: Number(item.newrankingnumber),
            });
            return acc;
          },
          {}
        );

        setState({
          data: dataByQueue,
          loading: false,
        });
      } catch (err) {
        console.error(err);
        setState((prevState) => ({ ...prevState, loading: false }));
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const renderChart = (data: any[]) => (
    <LineChart
      width={900}
      height={500}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 20,
      }}
    >
      <CartesianGrid strokeDasharray="0 0  " />
      <Tooltip
        formatter={(value) => [`MMR: ${value}`]}
        labelFormatter={(label) => `Date: ${label}`} // Customize the label format for the tooltip
      />
      <XAxis
        dataKey="secondssinceepoch"
        ticks={data.length > 1000 ? getTickValues(data, 1000) : undefined}
        interval={Math.floor(data.length / 10)} // Set the interval to evenly space the ticks
      />
      <YAxis
        allowDataOverflow={true}
        tick={{ fill: "#fff" }} // Set y-axis tick color to white
      />
      <Legend content={() => null} />{" "}
      {/* Render empty content for the legend */}
      <Line
        type="monotone"
        dataKey="newrankingnumber"
        stroke="#8884d8"
        strokeWidth={3} // Increased line thickness
        dot={{ r: 1 }} // Decreased point size
      />
      <Brush dataKey="secondssinceepoch" height={40} stroke="#8884d8" y={460} />
      {/* Specify height and y position for Brush component */}
    </LineChart>
  );

  const queueIds = Object.keys(state.data);

  const queueLabels: Record<string, string> = {
    "474": "Solo", // Map "474" to "Solo"
    "475": "Trio's", // Map "475" to "Duo"
    "477": "Realm War's", // Map "476" to "Trio"
    "476": "Squads", // Map "476" to "Trio"
  };

  return state.loading ? (
    <div></div>
  ) : (
    <>
      {Object.keys(state.data).length > 0 ? (
        <Box
          className="mmr-container"
          sx={{ bgcolor: "#f5f5f5", borderRadius: "20px", p: 3 }}
        >
          <Box>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              {queueIds.map((queueid, i) => (
                <Tab
                  className="mmr-tabs"
                  label={queueLabels[queueid]}
                  value={queueid}
                  key={i}
                /> // Display the mapped label for each tab
              ))}
            </Tabs>
          </Box>
          {queueIds.map((queueid, i) => (
            <TabPanel value={value} index={queueid} key={i}>
              {renderChart(state.data[queueid])}
            </TabPanel>
          ))}
        </Box>
      ) : (
        <div></div>
      )}
    </>
  );
};

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default Mmr;
