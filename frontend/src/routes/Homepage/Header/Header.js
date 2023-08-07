import React from "react";
import { Link } from "react-router-dom";
import Logout from "../../../components/Logout/Logout";

function Header() {
  const token = localStorage.getItem("appToken");

  return (
    <div className="firstblue flex justify-evenly p-3">
      {token ? (
        <Logout/>
      ) : (
        <>
          <Link to="/signup"><button className="fifthblue"><h5 className="text-white">Inscription</h5></button></Link>
          <Link to="/login"><button className="secondblue"><h5 className="text-white">Connexion</h5></button></Link>
        </>
      )}
    </div>
  );
}

export default Header;