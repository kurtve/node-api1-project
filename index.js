const express = require('express');
const db = require('./data/db.js');

// create an instance of express
const app = express();

// use middleware to parse request body
app.use(express.json());

app.get('/', (req, res) => {
  console.log("GET '/'");

  res.json({ message: 'Welcome to our API' });
});

const port = 5000;
const host = '127.0.0.1';

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
