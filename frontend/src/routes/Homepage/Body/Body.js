import React from "react";
import NationalTeams from "../../../components/National_teams/National_teams";

function Body() {
  const token = localStorage.getItem('appToken');

  return (
    <div className="fourthblue min-h-[85vh]">
      <h3 className="text-center">Equipes nationaux</h3>
      {token ? (
        <NationalTeams/>
      ) : (
        <>
          <p>Veuillez vous connecter pour voir les différentes équipes nationaux</p>
        </>
      )}
    </div>
  );
}

export default Body;