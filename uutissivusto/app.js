const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();
const { port, host } = require('./config.json');



const connection2 = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'saatiedot'
});


//get the weather 
app.get('/weather', (req, res) => {
    connection2.query('SELECT * FROM saa WHERE vko = 21 ', (err, results) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error');
        } else {
          res.json(results);
        }
      });
});

//serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

app.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}`);
});


