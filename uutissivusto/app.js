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

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'sivupohjat'));

app.get('/', (req, res) => {
    res.render('main')
});

app.get('/saa/:id', async (req, res) => {
  try {
    const response = await fetch(`http://localhost:8081/saa/${req.params.id}`, {
      headers: {
        'Content-Type': 'application/xml'
      },
      mode: 'cors'
    });

    const data = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, 'text/xml');

    const vko = xmlDoc.getElementsByTagName('vko')[0].childNodes[0].nodeValue;
    const pvm = new Date(xmlDoc.getElementsByTagName('pvm')[0].childNodes[0].nodeValue).toLocaleDateString('fi-FI');
    const lampotila = xmlDoc.getElementsByTagName('lampotila')[0].childNodes[0].nodeValue;
    const tuuli = xmlDoc.getElementsByTagName('tuulennopeus')[0].childNodes[0].nodeValue;
    const saatila = xmlDoc.getElementsByTagName('saatila')[0].childNodes[0].nodeValue;

    const saaData = {
      pvm: pvm,
      lampotila: lampotila,
      saatila: saatila,
      tuuli: tuuli
    };

    const vkoData = {
      vko: vko 
    };

    var results = [];

    //add the data to the results array
    results.push(saaData);
    results.push(vkoData);

    res.render('saa', { 
      data: results
    });
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

app.get('/blogit', async (req, res) => {
  try {
    const response = await fetch('http://localhost:8080/', {
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    });

    const data = await response.json();
    const tarinatData = data.map(d => {
      return {
        blogi:d.blogi,
        otsikko:d.otsikko,
        kirjoittaja:d.kirjoittaja
      };
    });
      
    res.render('blogit', { tarinatData });
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

//määritellään staattisten tiedostojen hakemisto
app.use(express.static(path.join(__dirname, 'public')));


//Käynnistetään palvelin
app.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}`);
});


