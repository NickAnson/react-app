import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import TitleBar from "./components/TitleBar";
import Background from "./components/Background";
import Matches from "./components/Matches";
import AdminPlayerStats from "./components/AdminPlayerStats";
import AveragePlayerStats from "./components/AdminAveragePlayerStats";
import AdminPlayerStatsTitleBar from "./components/PlayerStatsTitleBar";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import PlayerOverview from "./components/PlayerOverview";
import PlayerMatchHistory from "./components/PlayerMatchHistory";
import SearchBar from "./components/SearchBar";
import MMR from "./components/MMR";
import HighetsPlayerStats from "./components/HighestPlayerStats";
import HighestMMRStats from "./components/HighestMMRStats";
import ClassWinPercentage from "./components/ClassWinPercentage";
import PlayerOverviewStats from "./components/PlayerOverviewStats";
import CreateTournament from "./components/CreateTournament";
import { useEffect } from "react";

function Stats() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id && isNaN(Number(id))) {
      navigate("/404");
    }
  }, [id, navigate]);

  return (
    <div>
      <SearchBar path={"stats"} findPlayerId={true} />
      <div className="parent">
        <HighetsPlayerStats dynamicVariable="1" />
        <HighetsPlayerStats dynamicVariable="2" />
        <HighetsPlayerStats dynamicVariable="3" />
      </div>

      <PlayerOverview />
      <div className="parent">
        <PlayerOverviewStats />
      </div>

      <PlayerMatchHistory />
    </div>
  );
}

function MMRs() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id && isNaN(Number(id))) {
      navigate("/404");
    }
  }, [id, navigate]);

  return (
    <div>
      <SearchBar path={"mmr"} findPlayerId={true} />
      <div className="parent">
        <HighestMMRStats dynamicVariable="1" />
      </div>
      <div className="parent">
        <PlayerOverview />
      </div>

      <MMR />
    </div>
  );
}

function App() {
  const titleBarItems = [
    { redirect: "/", name: "Home" },
    { redirect: "/mmr", name: "MMR" },
    { redirect: "/stats", name: "Stats" },
    { redirect: "/organize-tourney", name: "Organize Tourney" },
    { redirect: "/leaderboard", name: "Leaderboard" },
    { redirect: "/admin", name: "Admin" },
  ];

  return (
    <div>
      <Router>
        <TitleBar items={titleBarItems} />
        <Background />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/match/*" element={<Matches />} />
          <Route
            path="/admin/*"
            element={
              <div>
                <div className="player-stats-container-titlebar-top-most">
                  <AdminPlayerStatsTitleBar
                    numOfComponents={3}
                    typeOfStats="Player"
                  />
                </div>
                <div className="player-stats-container">
                  <AdminPlayerStats parameter="604800" lengthOfTime="1 week" />
                  <AdminPlayerStats parameter="86400" lengthOfTime="1 day" />
                  <AdminPlayerStats parameter="3600" lengthOfTime="1 hour" />
                </div>
                <div className="player-stats-container-titlebar">
                  <AdminPlayerStatsTitleBar
                    numOfComponents={3}
                    typeOfStats="Avg. Players"
                  />
                </div>
                <div className="player-stats-container">
                  <AveragePlayerStats
                    parameter="604800"
                    lengthOfTime="1 week"
                  />
                  <AveragePlayerStats parameter="86400" lengthOfTime="1 day" />
                  <AveragePlayerStats parameter="3600" lengthOfTime="1 hour" />
                </div>
                <div className="player-stats-container-titlebar">
                  <AdminPlayerStatsTitleBar
                    numOfComponents={3}
                    typeOfStats="Win"
                  />
                </div>
                <div className="player-stats-container">
                  <ClassWinPercentage
                    parameter="604800"
                    lengthOfTime="1 week"
                  />
                  <ClassWinPercentage parameter="86400" lengthOfTime="1 day" />
                  <ClassWinPercentage parameter="3600" lengthOfTime="1 hour" />
                </div>
              </div>
            }
          />
          <Route
            path="/leaderboard/*"
            element={
              <Leaderboard
                formatIds={[
                  { display: "kills", format: "1", duration: "86400" },
                  { display: "kills", format: "1", duration: "604800" },
                  { display: "kills", format: "1", duration: "2630000" },
                  { display: "class stats", format: "2", duration: "86400" },
                  { display: "class stats", format: "2", duration: "604800" },
                  { display: "class stats", format: "2", duration: "2630000" },
                ]}
              />
            }
          />{" "}
          <Route
            path="/stats/"
            element={
              <div>
                <SearchBar path={"stats"} findPlayerId={true} />
                <div className="parent">
                  <HighetsPlayerStats dynamicVariable="1" />
                  <HighetsPlayerStats dynamicVariable="2" />
                  <HighetsPlayerStats dynamicVariable="3" />
                </div>
              </div>
            }
          />
          <Route path="/stats/:id" element={<Stats />} />
          <Route
            path="/mmr/"
            element={
              <div>
                <SearchBar path={"mmr"} findPlayerId={true} />
                <div className="parent">
                  <HighestMMRStats dynamicVariable="1" />
                </div>
              </div>
            }
          />
          <Route path="/mmr/:id" element={<MMRs />} />
          <Route path="/organize-tourney/*" element={<CreateTournament />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

function Home() {
  return <div>{/* Home component content */}</div>;
}

function NotFound() {
  return (
    <div style={{ color: "white" }}>
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}

export default App;
