import React, { useState } from "react";
import { Button, TextField, FormControlLabel, Checkbox } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

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

const CreateTournament = () => {
  const [tournamentData, setTournamentData] = useState({
    name: "",
    specialConfigurations: [] as string[],
    pointsPerGame: [],
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setTournamentData({ ...tournamentData, [name]: value });
  };

  const handleAddPlacement = () => {
    const updatedPointsPerGame = [...tournamentData.pointsPerGame, ""];
    setTournamentData({
      ...tournamentData,
      pointsPerGame: updatedPointsPerGame,
    });
  };

  const handleRemovePlacement = (index: number) => {
    const updatedPointsPerGame = [...tournamentData.pointsPerGame];
    updatedPointsPerGame.splice(index, 1);
    setTournamentData({
      ...tournamentData,
      pointsPerGame: updatedPointsPerGame,
    });
  };

  const handlePlacementPointsChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    position: number
  ) => {
    const { value } = event.target;
    const updatedPointsPerGame = [...tournamentData.pointsPerGame];
    updatedPointsPerGame[position] = value;

    setTournamentData({
      ...tournamentData,
      pointsPerGame: updatedPointsPerGame,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log(tournamentData);
  };

  const renderPlacementPointsInputs = () => {
    return tournamentData.pointsPerGame.map((points, index) => (
      <div key={index} style={{ display: "flex", alignItems: "center" }}>
        <TextField
          label={`${addOrdinalSuffix(index + 1)}`}
          value={points}
          onChange={(event) => handlePlacementPointsChange(event, index)}
          variant="outlined"
          type="number"
          style={{ marginRight: "8px" }}
          InputLabelProps={{ style: { color: "white" } }}
          inputProps={{ style: { color: "white" } }}
        />
        {index === tournamentData.pointsPerGame.length - 1 && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<RemoveIcon />}
            onClick={() => handleRemovePlacement(index)}
            style={{ marginLeft: "8px" }}
          >
            Remove
          </Button>
        )}
      </div>
    ));
  };

  return (
    <div className="create-tourney">
      <h1>Create Tournament</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Tournament Name"
          name="name"
          value={tournamentData.name}
          onChange={handleInputChange}
          variant="outlined"
          fullWidth
          style={{ marginBottom: "16px" }}
          InputLabelProps={{ style: { color: "white" } }}
          inputProps={{ style: { color: "white" } }}
        />

        <FormControlLabel
          control={<Checkbox name="specialConfigurations" />}
          label="Special Configurations"
          style={{ marginBottom: "16px" }}
        />
        <br />
        <label>Points Per Kill:</label>
        <br />
        <TextField
          label=""
          name="pointsPerKill"
          value={tournamentData.pointsPerKill}
          onChange={handleInputChange}
          variant="outlined"
          type="number"
          style={{ marginBottom: "16px" }}
          InputLabelProps={{ style: { color: "white" } }}
          inputProps={{ style: { color: "white" } }}
        />
        <br />
        <label>Placement Points:</label>
        <br />
        {renderPlacementPointsInputs()}

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddPlacement}
        >
          Add Placement
        </Button>

        <br />
        <br />
        <br />

        <Button type="submit" variant="contained" color="primary">
          Create Tournament
        </Button>
      </form>
    </div>
  );
};

export default CreateTournament;
