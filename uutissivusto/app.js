//importataan tarvittavat moduulit
const express = require('express');
const mysql = require('mysql');
const path = require('path');

//Luodaan express sovellus
const app = express();

//Haetaan portti ja hosti config.json tiedostosta sekä database tiedot dbconfig.json tiedostosta
const { port, host } = require('./config.json');
const dbconfig = require('./dbconfig.json');


//Luodaan yhteys tietokantaan tiedoilla jotka on annettu dbconfig.json tiedostossa
const yhteys = mysql.createConnection({
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database
});


//Haetaan kaikki uutiset tietokannasta
app.get('/news', (req, res) => {
    yhteys.query('SELECT * FROM uutiset ORDER BY julkaisuaika DESC', (err, vastaus) => {
        if (err) {
          console.error(err);
          res.status(500);
        } else {
          res.json(vastaus);
        }
      });
});

//määritellään staattisten tiedostojen hakemisto
app.use(express.static(path.join(__dirname, 'public')));

//lähetetään index.html tiedosto kun käyttäjä menee osoitteeseen http://localhost:8082/
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

//Käynnistetään palvelin
app.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}`);
});


