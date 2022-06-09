'use strict';

const cors = require('cors');
const express = require('express');
const fs = require('fs');

const PORT = 8080;
const STATE_PATH = 'stateData.json';

const state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf-8'));

const app = express();
app.use(cors());

app.get('/state', (req, res) => {
  res.send(state);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
