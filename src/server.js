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

// All valid team abbreviations
const teamsArr = [
  'TEN', 'NYG', 'PIT', 'CAR', 'BAL', 'TB', 'IND', 'MIN', 
  'ARI', 'DAL', 'ATL', 'NYJ', 'DEN', 'MIA', 'PHI', 'CHI', 
  'NE', 'WAS', 'GB', 'LAC', 'NO', 'HOU', 'BUF', 'SF', 
  'JAX', 'CLE', 'LV', 'KC', 'LR', 'SEA', 'CIN', 'DET'
];

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
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

      // Calls the microservice
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

// https://openweathermap.org/current#zip
app.get('/api/weather', async function(req, res) {
  const apiKey = '6581904b2f52f9308db23994647241cf';
  const zipCodesArr = [
    37213, 10021, 15202, 28202, 21203, 33607, 46201, 56760, 
    63102, 75203, 30303, 10001, 28037, 33102, 19092, 60602, 
    58647, 20575, 54301, 92103, 70112, 77002, 14202, 94102, 
    32099, 44114, 94502, 66027, 63101, 98102, 45202, 48205
  ];

  const weatherRes = {};
  for (let i=0; i < zipCodesArr.length; i++) {
    const thisZip = zipCodesArr[i];
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?zip=${thisZip}&appid=${apiKey}`
    await axios.get(weatherURL)
    .then(response => {
      weatherRes[teamsArr[i]] = {
        description: response.data.weather[0].description,
        temperature: (response.data.main.temp - 273.15) * 9 / 5 + 32
      };
    })
    .catch(error => {console.log(error)})
  }
  res.send(JSON.stringify(weatherRes));
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
      let thisPoints = 0;
      let thisRank = '';
      const playerVal1 = thisPlayer['draftStatAttributes'][0]['value'];
      const playerVal2 = thisPlayer['draftStatAttributes'][1]['value'];
      const regex = new RegExp("[a-zA-Z]");
      if (regex.test(playerVal1)) {
        thisPoints = 0;
        thisRank = playerVal1;
      } else {
        thisPoints = playerVal1;
        thisRank = playerVal2;
      }

      res[thisKey] = {
        firstName: thisPlayer['firstName'],
        lastName: thisPlayer['lastName'],
        displayName: thisPlayer['displayName'],
        salary: thisPlayer['salary'],
        projectedPoints: thisPoints,
        opponentRank: thisRank,
        quality: thisPlayer['draftStatAttributes'][1]['quality'],
        teamAbbreviation: thisPlayer['teamAbbreviation'],
        position: thisPlayer['position'],
        image: thisPlayer['playerImage160']
      }
    }
  };
  return res;
};

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

    // Check that our game contains a team name
    let teamFound = false;
    for (let j=0; j < teamsArr.length; j++) {
      if (friendly.includes(teamsArr[j])) {
        teamFound = true;
        break;
      }
    }

    if (!teamFound) {
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
