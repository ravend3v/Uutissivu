const express = require('express');
const mysql = require('mysql');
const app = express();
const { port, host } = require('./config.json');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'blogit'
});

//Set up CORS to allow us to accept requests from our client
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


//kysely tietokannalle
const query = 'SELECT * FROM blogikirjoitus JOIN blogi ON blogikirjoitus.blogi_id = blogi.blogi_id ORDER BY julkaisuaika DESC';
connection.query(query, (error, results) => {
    if (error) {
        console.log(error);
    } 

    //taulukko JSON muotoon
    const result = results.map(result => {
      return {
        id: result.kirjoitus_id,
        blogi: result.nimi,
        kirjoittaja: result.kirjoittaja,
        otsikko: result.otsikko,
        teksti: result.teksti,
        julkaisuaika: result.julkaisuaika
      };
    });
    const json = JSON.stringify(result);
    
    app.get('/', (req, res) => {
        res.send(json);
    }
    );
});

app.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}`);
});