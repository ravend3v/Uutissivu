//importataan tarvittavat moduulit
const express = require('express');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');
const { DOMParser } = require('xmldom');

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

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true}));


app.get('/', async (req, res) => {
  try {
    const response = await fetch(`http://localhost:8081/saa/21`, {
      headers: {
        'Content-Type': 'application/xml'
      },
      mode: 'cors'
    });
    
    const data = await response.text();
    const doc = new DOMParser().parseFromString(data);

    const saatiedot = doc.getElementsByTagName('saatieto');
    const saatiedotData = Array.from(saatiedot).map(s => {
      return {
        id: s.getElementsByTagName('id')[0].textContent,
        vko: s.getElementsByTagName('vko')[0].textContent,
        pvm: s.getElementsByTagName('pvm')[0].textContent,
        saatila: s.getElementsByTagName('saatila')[0].textContent,
        lampotila: s.getElementsByTagName('lampotila')[0].textContent,
        tuulennopeus: s.getElementsByTagName('tuulennopeus')[0].textContent
      };
    });
    const tarinatData = await fetch('http://localhost:8080/', {
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    }).then(res => res.json()).then(data => {
      return data.map(d => {
        return {
          blogi: d.blogi,
          otsikko: d.otsikko,
          kirjoittaja: d.kirjoittaja
        };
      });
    });

    yhteys.query('SELECT * FROM uutiset', (err, results) => {
      if (err) {
        throw err;
      }
      
      const uutisetData = results.map(r => {
        return {
          id: r.uutinen_id,
          otsikko: r.otsikko,
          julkaisuaika: r.julkaisuaika,
          kirjoittaja: r.kirjoittaja,
          sisalto: r.sisalto
        };
      });
          
      console.log(uutisetData);
      res.render('main', { 
        saatiedotData: saatiedotData,
        tarinatData: tarinatData,
        uutisetData: uutisetData
      });
    });

  } catch (error) {
    console.error(error);
    res.status(500);
  }
});
    
  


  




//Käynnistetään palvelin
app.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}`);
});


