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
  request(contestsURL, { json: true }, async (err, response, body) => {
    if (err) { return console.log(err); }
    const output = {};
    output['games'] = parseContests(response.body.Contests);
    const players = {};
    let counter = 0;
    for (let i=0; i < output.games.length; i++) {
      const gameID = output.games[i].id;
      const microServiceURL = `https://gk361ms.deta.dev/gameid/${gameID}`;
      axios.get(microServiceURL)
      .then(response => {

        players[String(gameID)] = parseMicroServiceResponse(response.data);
        counter = counter + 1;

        if (counter === output.games.length) {
          output['players'] = players;
          res.send(JSON.stringify(output));
        }

      })
      .catch(error => {console.log(error)})
    }
  });
});

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
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// This endpoint returns the unlocked contests for the current week
function parseContests(inputContests) {
  const outputCons = [];
  const uniqueCons = [];
  for (let i=0; i < inputContests.length; i++) {
    const thisCon = inputContests[i];
    if (thisCon['gameType'] !== 'Showdown Captain Mode') {
      continue;
    }
    let friendly = thisCon['n'].split("(");
    if (friendly.length > 2) {
      // Parse out contest names we do not want
      continue;
    }
    friendly = friendly[1]
    friendly = friendly.split(")")[0];
    if (uniqueCons.includes(friendly)) {
      continue;
    }
    uniqueCons.push(friendly)
    outputCons.push({
      id: thisCon['id'],
      fullName: thisCon['n'],
      date: thisCon['sdstring'],
      friendly: friendly
    });
  }
  return outputCons;
}
