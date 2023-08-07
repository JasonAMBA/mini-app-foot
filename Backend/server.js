require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'mini-app-foot'
})

db.connect((err) => {
  if (err) {
    console.error('Erreur lors de la connexion à la base de données', err);
    return;
  }
  console.log('Connexion à la base de données réussi !');
});

app.post('/signup', (req, res) => {
  const {username, password} = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error(err);
      res.status(500).json({error: "Erreur lors de l'inscription"});
    } else {
      db.query('INSERT INTO user (username, password) VALUES (?, ?)', [username, hashedPassword], (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({error: "Erreur lors de l'inscription"});
        } else {
          res.status(201).json({message: 'Inscription réussie'});
        }
      });
    }
  });
});

app.post('/login', (req, res) => {
  const {username, password} = req.body;

  db.query('SELECT * FROM user where username = ?', [username], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({error: 'Erreur lors de la connexion'});
    } else if (results.length === 0) {
      res.status(401).json({error: "Nom d'utilisateur incorrect"});
    } else {
      const user = results[0];

      bcrypt.compare(password, user.password, (err, match) => {
        if (err) {
          console.error(err);
          res.status(500).json({error: 'Erreur lors de la connexion'});
        } else if (!match) {
          res.status(401).json({error: 'Mot de passe incorrect'});
        } else {
          const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn: '1h'});

          res.status(200).json({token});
        }
      });
    }
  });
});

app.get('/national-teams', (req, res) => {
  const token = req.headers.authorization;
  

  if (!token) {
    res.status(401).json({error: "Authorization header missing"});
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error(err);
        res.status(401).json({error: "Invalid Token"});
      } else {
        const query = "SELECT * FROM national_team";

        db.query(query, (err, results) => {
          if (err) {
            console.error("Erreur lors de l'éxécution de la requête", err);
            res.status(500).send('Erreur lors de la récupération des équipes nationaux');
            return;
          }
          res.send(results);
        });
      }
    });
  }
});

app.get('/national-team/:id', (req, res) => {
  const token = req.headers.authorization;
  const {id} = req.params;

  if (!token) {
    res.status(401).json({error: "Authorization header missing"});
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error(err);
        res.status(401).json({error: "Invalid Token"});
      } else {
        const query = "SELECT * FROM national_team WHERE id = ?"

        db.query(query, [id], (err, results) => {
          if (err) {
            throw err;
          }
          res.send(results);
        })
      }
    })
  }
})

app.post('/national-team', (req, res) => {
  const token = req.headers.authorization;
  const {name, nickname, picture} = req.body;

  if (!token) {
    res.status(401).json({error: "Authorization header missing"});
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error(err);
        res.status(401).json({error: "Invalid token"});
      } else {
        db.query("INSERT INTO national_team (name, nickname, picture) VALUES (?, ?, ?)", [name, nickname, picture], (error, results) => {
          if (error) {
            console.error(error);
          } else {
            res.status(201).json({message: "Equipe nationale ajouté avec succès !"});
          }
        })
      }
    })
  }
})

app.delete('/national-team/:id', (req, res) => {
  const token = req.headers.authorization;
  const {id} = req.params;

  if (!token) {
    res.status(401).json({error: "Authorization header missing"});
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error(err);
        res.status(401).json({error: "Invalid token"});
      } else {
        const query = "DELETE FROM national_team WHERE id = ?";
        db.query(query, [id], (err, results) => {
          if (err) {
            throw err;
          } 
        })
        res.send({message: "Equipe nationale supprimé avec succès !"})
      }
    })
  }
})

app.get('/clubs', (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({error: "Authorization header missing"});
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error(err);
        res.status(401).json({error: "Invalid token"});
      } else {
        const query = "SELECT * FROM club";

        db.query(query, (err, results) => {
          if (err) {
            console.error("Erreur lors de l'éxécution de la requête", err);
            res.status(500).send('Erreur lors de la récupération des clubs');
          }
          res.send(results);
        });
      }
    });
  }
});

app.get('/club/:id', (req, res) => {
  const token = req.headers.authorization
  const {id} = req.params

  if (!token) {
    res.status(401).json({error: "Authorization header missing"});
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error(err);
        res.status(401).json({error: "Invalid token"})
      } else {
        const query = "SELECT * FROM club WHERE id = ?";

        db.query(query, [id], (err, results) => {
          if (err) {
            throw err;
          }
          res.send(results);
        })
      }
    })
  }
})

app.post('/clubs', (req, res) => {
  const token = req.headers.authorization;
  const {name, picture} = req.body;

  if (!token) {
    res.status(401).json({error: "Authorization header missing"});
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error(err);
        res.status(401).json({error: "Invalid token"});
      } else {
        db.query("INSERT INTO club (name, picture) VALUES (?, ?)", [name, picture], (error, results) => {
          if (error) {
            console.error(error);
          } else {
            res.status(201).json({message: 'Club ajouté avec succès'});
          }
        })
      }
    })
  }
})

app.delete('/club/:id', (req, res) => {
  const token = req.headers.authorization;
  const {id} = req.params;

  if (!token) {
    res.status(401).json({error: "Authorization header missing"});
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error(err);
        res.status(401).json({error: "Invalid token"});
      } else {
        const query = "DELETE FROM Club WHERE id = ?";
        db.query(query, [id], (err, result) => {
          if (err) {
            throw err;
          }
        })
        res.send("Club supprimé avec succès !");
      }
    })
  }
})

app.get('/players', (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({error: "Authorization header missing"});
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error(err);
        res.status(401).json({error: "Invalid token"});
      } else {
        const query = "SELECT player.firstname, player.lastname, player.position, player.strong_foot, player.photo, club.name AS club, national_team.name AS national_team FROM player INNER JOIN club ON player.club_id = club.id INNER JOIN national_team ON player.national_team_id = national_team.id";

        db.query(query, (err, results) => {
          if (err) {
            console.error("Erreur lors de l'éxécution de la requête", err);
            res.status(500).send('Erreur lors de la récupération du joueur');
          }
          res.send(results);
        });
      }
    });
  }
});

app.get('/players/:id', (req, res) => {
  const token = req.headers.authorization;
  const {id} = req.params;

  if (!token) {
    res.status(401).json({error: "Authorization header missing"});
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error(err);
        res.status(401).json({error: "Invalid token"});
      } else {
        const query = "SELECT player.firstname, player.lastname, player.position, player.strong_foot, player.photo, club.name AS club, national_team.name AS national_team FROM player INNER JOIN club ON player.club_id = club.id INNER JOIN national_team ON player.national_team_id = national_team.id WHERE national_team_id = ?;";

        db.query(query, [id], (err, results) => {
          if (err) {
            console.error("Erreur lors de l'éxécution de la requête", err);
            res.status(500).send('Erreur lors de la récupération du joueur');
          }
          res.send(results);
        });
      }
    });
  }
});

app.get('/player/:id', (req, res) => {
  const token = req.headers.authorization;
  const {id} = req.params;

  if (!token) {
    res.status(401).json({error: "Authorization header missing"});
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error(err);
        res.status(401).json({error: "Invalid token"});
      } else {
        const query = "SELECT player.firstname, player.lastname, player.position, player.strong_foot, player.photo, club.name AS club, national_team.name AS national_team FROM player INNER JOIN club ON player.club_id = club.id INNER JOIN national_team ON player.national_team_id = national_team_id WHERE player.id = ?";

        db.query(query, [id], (err, result) => {
          if (err) {
            console.error("Erreur lors de l'éxécution de la requête", err);
            res.status(500).send('Erreur lors de la récupération des détails du joueur');
            return;
          }
          res.send(result[0]);
        });
      }
    });
  }
});


app.post('/player', (req, res) => {
  const token = req.headers.authorization;
  const {firstname, lastname, position, strong_foot, photo, club_id, national_team_id} = req.body;

  if (!token) {
    res.status(401).json({error: "Authorization header missing"});
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error(err);
      } else {
        const query = "INSERT INTO player (firstname, lastname, position, strong_foot, photo, club_id, national_team_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
        db.query(query, [firstname, lastname, position, strong_foot, photo, club_id, national_team_id], (error, results) => {
          if (error) {
            throw error;
          } else {
            res.status(201).json({message: 'Joueur ajouté avec succès !'});
          }
        })
      }
    })
  }
})

app.delete('/player/:id', (req, res) => {
  const token = req.headers.authorization;
  const {id} = req.params;

  if (!token) {
    res.status(401).json({error: "Authorization header missing"});
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error(err);
        res.status(401).json({error: "Invalid token"});
      } else {
        const query = "DELETE FROM player WHERE id = ?";
        db.query(query, [id], (err, result) => {
          if (err) {
            throw err;
          }
        })
        res.send("Joueur supprimé avec succès !");
      }
    })
  }
})

app.listen(process.env.PORT, () => {
  console.log(`Serveur actif sur le port : ${process.env.PORT}`);
})