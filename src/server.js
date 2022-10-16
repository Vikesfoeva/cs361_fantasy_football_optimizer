const bodyParser = require('body-parser')
const path = require('path');
const express = require('express');

// Node Requests
// https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html

const request = require('request');
const app = express();
app.use(express.static(path.join(__dirname,"../build")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(express.static('dist'));

app.use(function (req, res, next) {
  const thisHost = req.get('host');
  res.header("Access-Control-Allow-Origin", "http://" + thisHost + "/");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/dkTest', async (req, res) => {
  const contestsURL = 'https://www.draftkings.com/lobby/getcontests?sport=NFL';
  request(contestsURL, { json: true }, (err, response, body) => {
    if (err) { return console.log(err); }
    const output = parseContests(response.body.Contests);
    res.send(JSON.stringify(output));
  });
});

app.get('/*', function(req, res) {
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
