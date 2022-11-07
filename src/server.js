const bodyParser = require('body-parser')
const path = require('path');
const express = require('express');
const axios = require('axios');

// Node Requests
// https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html

// Partners Microservice Documentation
// https://github.com/huangpin-osu/brandon-micro/blob/master/readme.md

const request = require('request');
const app = express();
app.use(express.static(path.join(__dirname,"../build")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// Add a specific game id at end of this url
const microServiceURL = 'https://gk361ms.deta.dev/gameid/';

app.use(express.static('dist'));

app.use(function (req, res, next) {
  const thisHost = req.get('host');
  res.header("Access-Control-Allow-Origin", "http://" + thisHost + "/");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

async function partnerServiceTest(gameID) {
  const fullUrl = microServiceURL + String(gameID);
  const totalPlayers = await axios.get(fullUrl)
  .then(response => {
    return response.data;
  })
  .catch(error => {
    console.log(error)
  })
}

app.get('/api/dkTest', async (req, res) => {
  partnerServiceTest('135731827');
  const contestsURL = 'https://www.draftkings.com/lobby/getcontests?sport=NFL';
  request(contestsURL, { json: true }, (err, response, body) => {
    if (err) { return console.log(err); }
    const output = parseContests(response.body.Contests);
    res.send(JSON.stringify(output));
  });
});

app.get('/', function(req, res) {
  console.log('hi');
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));

// This endpoint returns the unlocked contests for the current week
function parseContests(inputContests) {
  const outputContests = {};
  for (let i=0; i < inputContests.length; i++) {
    const thisContest = inputContests[i];
    if (thisContest['gameType'] === 'Showdown Captain Mode' && thisContest['n'].includes('Casual NFL Showdown $10 Double Up ')) {
      outputContests[thisContest['n']] = thisContest;
    }
  }
  return outputContests;
}
