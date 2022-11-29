const bodyParser = require('body-parser')
const path = require('path');
const express = require('express');
const axios = require('axios');
const { fabClasses } = require('@mui/material');

// Partners Microservice Documentation
// https://github.com/huangpin-osu/brandon-micro/blob/master/readme.md

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

// Zip Codes of NFL Stadiums November 2022
const zipCodesArr = [
  37213, 10021, 15202, 28202, 21203, 33607, 46201, 56760, 
  63102, 75203, 30303, 10001, 28037, 33102, 19092, 60602, 
  58647, 20575, 54301, 92103, 70112, 77002, 14202, 94102, 
  32099, 44114, 94502, 66027, 63101, 98102, 45202, 48205
];

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// https://openweathermap.org/current#zip
app.get('/api/weather', async function(req, res) {
  const apiKey = '6581904b2f52f9308db23994647241cf';
  const weatherRes = {};
  const games = await getContests();

  for (let i=0; i < games.games.length; i++) {
    const thisTeam = games.games[i].friendly.split(' ')[2];
    const thisZip = zipCodesArr[teamsArr.indexOf(thisTeam)];
    const thisURL = `https://api.openweathermap.org/data/2.5/weather?zip=${thisZip}&appid=${apiKey}`;
    await axios.get(thisURL)
    .then(response => {
      weatherRes[thisTeam] = {
        description: response.data.weather[0].description,
        temperature: (response.data.main.temp - 273.15) * 9 / 5 + 32
      };
    })
    .catch(error => {console.log(error)})
  }
  res.send(JSON.stringify(weatherRes));
});

async function getContests() {
  const output = await axios.get('https://www.draftkings.com/lobby/getcontests?sport=NFL')
  .then(async (response) => {
    const out = {};
    out['games'] = parseContests(response.data.Contests);
    return out;
  }).catch(error => {console.log(error)})
  return output
}

app.get('/api/contests', async (req, res) => {
  const output = await getContests();
  output['players'] = await callPartnersMicroservice(output);
  res.send(JSON.stringify(output));
});

async function callPartnersMicroservice(gamesObj) {
  const players = {};
  for (let i=0; i < gamesObj.games.length; i++) {
    const gameID = gamesObj.games[i].id;
    // Calls the microservice
    await axios.get(`https://gk361ms.deta.dev/gameid/${gameID}`)
    .then(response => {
      players[String(gameID)] = parseMicroServiceResponse(response.data);
    }).catch(error => {console.log(error)})
  }
  return players;
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
      res[thisKey] = buildPlayerObjectForClient(thisPlayer)
    }
  };
  return res;
};

function buildPlayerObjectForClient(thisPlayer) {
  let thisPoints = thisPlayer['draftStatAttributes'][0]['value'];
  let thisRank = thisPlayer['draftStatAttributes'][1]['value'];
  const regex = new RegExp("[a-zA-Z]");
  // Test if DK flipped the values for a non-pointing player
  if (regex.test(thisPoints)) {
    thisPoints = 0;
    thisRank = thisPoints;
  } 
  return {
    firstName: thisPlayer['firstName'],
    lastName: thisPlayer['lastName'],
    displayName: thisPlayer['displayName'],
    salary: thisPlayer['salary'],
    projectedPoints: thisPoints,
    opponentRank: thisRank,
    quality: thisPlayer['draftStatAttributes'][1]['quality'],
    teamAbbreviation: thisPlayer['teamAbbreviation'],
    position: thisPlayer['position']
  }
}

// This function returns the unlocked contests for the current week
function parseContests(inputContests) {
  const outputCons = [];
  const uniqueCons = [];

  for (let i=0; i < inputContests.length; i++) {
    const thisCon = inputContests[i];
    if (thisCon['gameType'] !== 'Showdown Captain Mode') {
      continue;
    }

    // Draftking games we do not want tend to have multiple () sets
    const friendlyPart1 = thisCon['n'].split("(");
    const friendlyPart2 = friendlyPart1[1].split(")")[0];
    if (!beginParsingForFriendlyName(friendlyPart1, uniqueCons) || !checkFriendlyHasTeamName(friendlyPart2)) {
      continue;
    }
 
    uniqueCons.push(friendlyPart2)
    outputCons.push({
      id: thisCon['id'],
      fullName: thisCon['n'],
      date: thisCon['sdstring'],
      friendly: friendlyPart2
    });
  }
  return outputCons;
}

function beginParsingForFriendlyName(thisFriendly, uniqueCons) {
  // Check2 assumes the name we want is at the spot we want, check if we have it
  const check2 = thisFriendly[1].split(")")[0]
  if (thisFriendly.length > 2 || uniqueCons.includes(check2)) {
    return false;
  }
  return true;
}

function checkFriendlyHasTeamName(thisFriendly) {
  for (let j=0; j < teamsArr.length; j++) {
    if (thisFriendly.includes(teamsArr[j])) {
      return true;
    }
  }
  return false;
}