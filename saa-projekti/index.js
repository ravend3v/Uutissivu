const express = require('express');
const mysql = require('mysql');
const app = express();
const xml = require('xml');

const { port, host } = require('./config.json');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'saatiedot'
});

//Set up CORS to allow us to accept fetch requests from our client
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

//Get the data based on the vko number from the database saa 
app.get('/saa/:vko', (req, res) => {
    const vko = req.params.vko;
    connection.query('SELECT * FROM saa WHERE vko = ?', [vko], (error, results) => {
        if (error) {
            res.status(500);
        } else {
            const xmlData = xml({ 
                saatiedot: results.map(result => ( {
                  saatieto: [
                    {id: result.id},
                    {vko: result.vko},
                    {pvm: result.pvm.toString()},
                    {saatila: result.saatila},
                    {lampotila: result.lampotila},
                    {tuulennopeus: result.tuulennopeus},
                  ]
                }))
            });
            res.type('application/xml');
            res.send(xmlData);
          }
    });
});

app.listen(port, host, () => {
    console.log(`Server is running on port ${port}`);
});