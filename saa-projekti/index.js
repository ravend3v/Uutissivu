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

//Get the data based on the vko number from the database saa 
app.get('/saa/:vko', (req, res) => {
    const vko = req.params.vko;
    connection.query('SELECT * FROM saa WHERE vko = ?', [vko], (error, results) => {
        if (error) {
            res.status(500).send('Error');
        } else {
            const xmlData = xml({ 
                saatiedot: results.map(result => ( {
                  saatieto: [
                    {id: result.id},
                    //make the pvm toString
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