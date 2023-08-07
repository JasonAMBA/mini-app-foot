import React, { useEffect, useState } from "react";
import axios from "axios";

function NationalTeams() {
  
  const [nationalTeams, setNationalTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamID] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchNationalTeams = async () => {
      try {
        const token = localStorage.getItem('appToken');
        const response = await axios.get("http://localhost:3000/national-teams", {
          headers: {
            'Authorization': `${token}`
          }
        });
        setNationalTeams(response.data)
      } catch (error) {
        console.error("Une erreur s'est produite", error);
      }
    };

    fetchNationalTeams();
  }, []);

  useEffect(() => {
    if (selectedTeamId) {
      const fetchPlayers = async () => {
        const token = localStorage.getItem('appToken');
        try {
          const response = await axios.get(`http://localhost:3000/players/${selectedTeamId}`, {
            headers: {
              'Authorization': `${token}`
            },
          });
          setPlayers(response.data);
        } catch (error) {
          console.error("Une erreur s'est produite", error);
        }
      };

      fetchPlayers();
    }
  }, [selectedTeamId]);

  const handleTeamClick = (id) => {
    setSelectedTeamID(id);
  }

  return(
    <>
      <div className="flex pad">
        {nationalTeams.map((nationalTeam) => (
          <h3 key={nationalTeam.id} onClick={() => handleTeamClick(nationalTeam.id)} className={selectedTeamId === nationalTeam.id ? "selected-team" : "not-selected-team"}>{nationalTeam.name}</h3>
        ))}
      </div>
      <div className="top"></div>
      {selectedTeamId && (
        <div className="grid container">
          {players.map((player) => (
            <div key={player.id} className="text-center player">
              <h2>{player.lastname}</h2>
              <img src={player.photo} alt="" />
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default NationalTeams;