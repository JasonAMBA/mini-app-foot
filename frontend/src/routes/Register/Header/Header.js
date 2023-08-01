import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="firstblue text-center p-3">
      <Link to="/"><button className="secondblue"><h5 className="text-white">Accueil</h5></button></Link>
    </div>
  );
}

export default Header;