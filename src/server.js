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

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));

app.use(express.static('dist'));

app.use(function (req, res, next) {
  const thisHost = req.get('host');
  res.header("Access-Control-Allow-Origin", "http://" + thisHost + "/");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/contests', async (req, res) => {
  const contestsURL = 'https://www.draftkings.com/lobby/getcontests?sport=NFL';
  request(contestsURL, { json: true }, (err, response, body) => {
    if (err) { return console.log(err); }
    const output = parseContests(response.body.Contests);
    res.send(JSON.stringify(output));
  });
});

app.get('/api/contests/:constest_id', async (req, res) => {
  // Leverage the partner's microservce to get all the players for a given game
  const thisId = parseInt(req.params.constest_id);
  const allPlayersObject = await partnerMicroService(thisId);
  const usablePlayerObject = parseMicroServiceResponse(allPlayersObject);
  res.send(JSON.stringify(usablePlayerObject));
});

async function partnerMicroService(gameID) {
  // Call the microservice to receive the players in this game
  const microServiceURL = `https://gk361ms.deta.dev/gameid/${String(gameID)}`;
  const totalPlayers = await axios.get(microServiceURL)
  .then(response => {
    return response.data;
  })
  .catch(error => {
    console.log(error)
  })
  return totalPlayers;
}

function parseMicroServiceResponse(allPlayersObject) {
  // Creates a condensed more manageable data object to send back to the client
  const res = {};
  for (let i=0; i < allPlayersObject.length; i++) {
    const thisPlayer = allPlayersObject[i];
    const thisKey = thisPlayer['playerId'];
    if (thisKey in res && res[thisKey]['salary'] > thisPlayer['salary']) {
      res[thisKey]['salary'] = thisPlayer['salary']
    } else {
      res[thisKey] = {
        firstName: thisPlayer['firstName'],
        lastName: thisPlayer['lastName'],
        displayName: thisPlayer['displayName'],
        salary: thisPlayer['salary'],
        projectedPoints: thisPlayer['draftStatAttributes'][0]['value'],
        opponentRank: thisPlayer['draftStatAttributes'][1]['value'],
        quality: thisPlayer['draftStatAttributes'][1]['quality'],
        teamAbbreviation: thisPlayer['teamAbbreviation'],
        position: thisPlayer['position'],
        image: thisPlayer['playerImage160']
      }
    }
  };
  return res;
};

app.get('/', function(req, res) {
  console.log('hi');
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

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
