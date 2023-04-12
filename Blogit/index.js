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

//kysely tietokannalle
const query = 'SELECT * FROM blogikirjoitus ORDER BY julkaisuaika DESC';
connection.query(query, (error, results) => {
    if (error) {
        console.log(error);
    } 

    //taulukko JSON muotoon
    const result = results.map(result => {
      return {
        id: result.kirjoitus_id,
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