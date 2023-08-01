import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Form() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/signup", {
        username, password
      });

      console.log(response.data);
      alert("inscription réussi !");
      navigate("/login");
    } catch (error) {
      console.error("Une erreur s'est produite", error);
    }

    
  };

  return (
    <div>
      <form className="thirdblue" onSubmit={handleSubmit}>
        <div className="text-center">
          <h2>Inscription</h2>
        </div>
        <div className="text-center">
          <label> Nom d'utilisateur : </label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
        </div>
        <div className="text-center">
          <label> Mot de passe : </label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <input className="text-center firstblue" type="submit" value="S'inscrire" />
      </form>
    </div>
  );
}

export default Form;