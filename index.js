const express = require('express');
const db = require('./data/db.js');

// create an instance of express
const server = express();

// use middleware to parse request body
server.use(express.json());

// initialize the server
const port = 5000;
const host = 'localhost';

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});

// define endpoints
// this first one just to verify we're running
server.get('/', (req, res) => {
  console.log("GET '/'");
  res.json({ message: `Server running at http://${host}:${port}` });
});

// get a list of users
server.get('/api/users', (req, res) => {
  console.log("GET '/api/users'");
  db.find()
    .then(users => {
      if (users) {
        res.json(users);
      } else {
        res
          .status(500)
          .json({ error: 'User info could not be retrieved at this time' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(err.code).json({ error: err.message });
    });
});

// get a single user
server.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  console.log(`GET '/api/users/${id}'`);
  db.findById(Number.parseInt(id))
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res
          .status(500)
          .json({ error: `User ${id} could not be retrieved at this time` });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(err.code).json({ error: err.message });
    });
});

// delete a user
server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  console.log(`DELETE '/api/users/${id}'`);
  db.remove(Number.parseInt(id))
    .then(count => {
      if (count) {
        res.json(`User ${id} removed from database`);
      } else {
        res
          .status(500)
          .json({ error: `User ${id} could not be removed from the database` });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(err.code).json({ error: err.message });
    });
});

// add a user
server.post('/api/users', (req, res) => {
  console.log(`POST '/api/users'`);

  if (typeof req !== 'object' || !req.body || !req.body.name || !req.body.bio) {
    return res
      .status(400)
      .json({ error: 'Please provide a name and bio for the user.' });
  }

  db.insert(req.body)
    .then(obj => {
      if (typeof obj === 'object' && obj.id) {
        res.json(`User ${obj.id} added to the database`);
      } else {
        res
          .status(500)
          .json({ error: 'The user could not be added to the database' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(err.code).json({ error: err.message });
    });
});

// update a user
server.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  console.log(`PUT '/api/users/${id}'`);

  if (typeof req !== 'object' || !req.body || !req.body.name || !req.body.bio) {
    return res
      .status(400)
      .json({ error: 'Please provide a name and bio for the user.' });
  }

  db.update(Number.parseInt(id), req.body)
    .then(count => {
      if (count) {
        res.json(`User ${id} updated`);
      } else {
        res.status(500).json({ error: `The user ${id} could not be updated` });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(err.code).json({ error: err.message });
    });
});
