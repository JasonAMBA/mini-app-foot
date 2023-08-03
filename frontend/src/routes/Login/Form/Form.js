import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Form() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const Login = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/login", {
        username, password
      });

      if (response.data && response.data.token) {
        window.localStorage.setItem("appToken", response.data.token);
        alert("Connexion réussi !");
        navigate("/");
      }
    } catch (error) {
      console.error("Une erreur s'est produite", error);
    }
  };

  return(
    <div>
      <form onSubmit={Login} className="thirdblue">
        <div className="text-center">
          <h2>Connexion</h2>
        </div>
        <div className="text-center">
          <label> Nom d'utilisateur : </label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
        </div>
        <div className="text-center">
          <label> Mot de passe : </label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <input className="text-center firstblue" type="submit" value="Connexion"/>
      </form>
    </div>
  )
}

export default Form;