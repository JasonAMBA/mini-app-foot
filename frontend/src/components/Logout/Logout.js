import React from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();
  const handleSubmit = () => {
    window.localStorage.removeItem("appToken");
    alert("Déconnexion réussi !");
    navigate("/login");
  }

  return(
    <>
      <button onClick={handleSubmit} className="secondblue"><h5 className="text-white">Déconnexion</h5></button>
    </>
  )
}

export default Logout;