const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');
const Battle = require('./battle');

const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.get('/location', async (req, res) => {
  const battles = await Battle.find({});
  var result = battles.map((battles) => battles.location);
  res.json(result);
});

app.get('/all', async (req, res) => {
  const battles = await Battle.find({});
  res.json(battles);
});

app.get('/count', async (req, res) => {
  const battles = await Battle.find({});
  var result = battles.map((battles) => battles.battle_number);
  res.json(result.length);
});

app.get('/search', async (req, res) => {
  const searchitem = 'Robb Stark';
  const battles = await Battle.find({
    $or: [{ attacker_king: searchitem }, { defender_king: searchitem }],
  });
  var result = battles.map((battles) => battles.name);
  res.json(result);
});

app.get('/details/:value', async (req, res) => {
  const searchitem = req.params.value;
  const battles = await Battle.find({
    $or: [{ location: searchitem }],
  });
  var result = battles.map((battles) => battles);
  res.json(result);
});

app.get('/searchh', async (req, res) => {
  const s1 = 'Robb Stark';
  const a1 = 'Robb Stark';
  const s2 = 'Riverrun';
  const s3 = 'siege';
  const battles = await Battle.find({
    $and: [
      {
        $or: [{ attacker_king: s1 }, { defender_king: a1 }],
      },
      { location: s2 },
      { battle_type: s3 },
    ],
  });
  res.json(battles);
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
