const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();
const { port, host } = require('./config.json');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'uutissivusto'
});

//serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

app.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}`);
});


