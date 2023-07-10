import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  path: string;
  findPlayerId: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ path, findPlayerId }) => {
  const [inputValue, setInputValue] = useState("");
  const history = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (findPlayerId) {
      const searchTerm = inputValue.trim();

      fetch(`http://localhost:7500/api/player/findid/${searchTerm}`)
        .then((response) => response.json())
        .then((data) => {
          const playerId = data.player_id;
          history(`/${path}/${playerId}`);
        })
        .catch((error) => {
          console.error("Error fetching player ID:", error);
        });
    } else {
      history(`/${path}/${inputValue}`);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="player-overview-container-search">
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          className="search-input"
          placeholder="Enter player name..."
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
