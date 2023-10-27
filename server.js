/**
 * name: Vinh Pham
 * nsid: tip434
 * number: 11290849
 * course: CMPT-353
 */
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 8080;
// Parse JSON bodies for this app
app.use(bodyParser.json());

// Initializing the database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'vinh',
  password: '1234',
});

//connect to postdb database, if fail, show error in console.
connection.connect((err) => {
  if (err) {
    console.error('Error! Cannot connect to the database:', err);
    return;
  }
  console.log('Connected to the database.');
});

//Direct to the posting.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'posting.html'));
});

// GET method for '/init'
app.get('/init', (req, res) => {
  //initiating the mysql database.
  const sql = `
    CREATE DATABASE IF NOT EXISTS postdb;
    USE postdb;
    CREATE TABLE IF NOT EXISTS posts (
      id unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
      topic VARCHAR(255),
      data TEXT,
      timestamp DATETIME
    );`;

  connection.query(sql, (error, result) => {
    if (error) {
      console.error('Error initializing the database:', error);
      res.status(500).send('Error');
    } else {
      res.send('Database initialized.');
    }
  }); 
});

// POST method for '/addPost'
app.post('/addPost', (req, res) => {
  const { topic, data } = req.body;

  // formating the timestamp
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const post = { topic, data, timestamp };
  const sql = 'INSERT INTO postdb.posts SET ?';

  connection.query(sql, post, (error, result) => {
    if (error) {
      console.error('Error on adding:', error);
      res.status(500).send('Error!');
    } else {
      res.send('Post added.');
    }
  });
});

// GET method for '/getPosts'
app.get('/getPosts', (req, res) => {
  //choose all section the posts database from postdb
  const sql = 'SELECT * FROM postdb.posts';

  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Error on getting:', error);
      res.status(500).send('Error!');
    } else {
      res.json(results);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Hosting server at http://localhost:${port}`);
});
