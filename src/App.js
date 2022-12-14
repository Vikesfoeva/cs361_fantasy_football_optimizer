import React, { Component } from 'react';
import { Typography } from '@mui/material';
import GameSelector from './components/gameSelect';
import AllPlayersTable from './components/playersInGame';
import Grid from '@mui/material/Unstable_Grid2';
import ButtonGrid from './components/buttonGrid';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import BasicTabs from './components/tabbedLineUps';
import LoadingButton from '@mui/lab/LoadingButton';
import KeyModal from './components/keyModal';
import LearnMoreModal from './components/learnMoreModal';

const blankPlayer = {
  name: "", 
  points: "", 
  position: "", 
  salary: "", 
  team: "", 
  display: "none", 
  locked: false, 
  bannedFromLineup: false, 
  isCaptain: false
};

const blankRow = [
  blankPlayer, 
  blankPlayer, 
  blankPlayer, 
  blankPlayer, 
  blankPlayer, 
  blankPlayer
];

const salaryCap = 50000

const baseChosenPlayers = {
  "0" :
  {rows: JSON.parse(JSON.stringify(blankRow)),
    hidden: false,
    index: 0,
    capRemaining: salaryCap,
    totalProjected: 0
  }
}

class App extends Component {

  state = { 
    games: [],
    allGamesWeather: {},
    selectedGame: 0,
    playersBank: {},
    playersTable: {
      page: 0,
      rowsPerPage: 25,
      rowsPerPageOptions: [25, 50, 100],
      rows: []
    },
    chosenPlayersTable: JSON.parse(JSON.stringify(baseChosenPlayers)),
    activePlayersTable: 0,
    activeSalaryRemaining: 50000,
    activeProjectedPoints: 0,
    justDeleted: null,
    addLineUpEnabled: false,
    lineUpOptimizerLoading: false,
    weatherDesc: '',
    temperature: ''
  } 

  async componentDidMount() {
    this.handleFetchWeather();
    const fetchContestResponse = await this.handleFetchContests();
    this.handleGatherAllPlayers(fetchContestResponse);
    await this.promisedSetState({ games: fetchContestResponse.games})
  }

  render() { 
    return (
      <React.Fragment>
        <React.Fragment>
          <Typography variant='h2'>Fantasy Football Roster Optimization Tool</Typography>
          
          {/* Information Grid - Game Picker, Help, Optimizer */}
          <Grid container spacing={1}>
            <Grid xs={1.5}>
              <GameSelector 
                gamesAvail={this.state.games}
                updateGameSelection={this.handleUpdateGame}
               />
            </Grid>
            <Grid xs={1.5}>
              <LearnMoreModal />
            </Grid>
            <Grid xs={1.5}>
              <KeyModal />
            </Grid>
            <Grid xs={1.5}>
              <LoadingButton 
                variant="contained" 
                size="small" 
                color='success' 
                endIcon={<AutoModeIcon />} 
                onClick={this.handleOptimizationAlgorithim}
                loading={this.state.lineUpOptimizerLoading}
                loadingIndicator="Loading???">
                  Optimize
                </LoadingButton>
            </Grid>
            <Grid xs={1.5}>
              <Typography>{this.state.weatherDesc}</Typography>
              <Typography>{this.state.temperature}</Typography>
            </Grid>
            <Grid xs={1.5}>
              <Typography variant='subtitle1' align='left'>
                {"Salary Remaining $" + String(this.state.activeSalaryRemaining)} 
              </Typography>
            </Grid>
            <Grid xs={1.5}>
              <Typography variant='subtitle1' align='left'>
                {"Projected Points: " + String(this.state.activeProjectedPoints)} 
              </Typography>
            </Grid>
          </Grid>

          {/* Player Grids */}
          <Grid container spacing={2}>
            <Grid xs={6}>
              <AllPlayersTable 
                playersTable = {this.state.playersTable}
                weather = {this.state.allGamesWeather}
                changeRowsPerPage = {this.handleRowsPerPage}
                changePage = {this.handlePageChange}
                addPlayerToLineup = {this.handleAddPlayerToLineup}
                lockInPlayer = {this.handleLockingPlayer}
                unlockPlayer = {this.handleUnlockingPlayer}
                banFromLineup = {this.handleLineUpBan}
              />
            </Grid>

            <Grid xs={5.5}>
              <BasicTabs 
                chosenPlayersTable={this.state.chosenPlayersTable}
                activePlayersTable = {this.state.activePlayersTable}
                addLineUpEnabled = {this.state.addLineUpEnabled}
                addNewTab={this.handleAddNewPage}
                changePage={this.handleChangeLineUpPage}
                removeFromLineup={this.handleRemovePlayerLineup}
              />
              <ButtonGrid
                resetAllLineUps = {this.handleResetAllLineUps}
                deleteOneLineup = {this.handleDeleteOneLineup}
                undoDelete = {this.handleUndoDelete}
                downloadButton = {this.handleDownloadCSV}
              />
            </Grid>
          </Grid>
        </React.Fragment>
      </React.Fragment>
    );
  }
  // Idea source on asyncronous state setting
  // https://stackoverflow.com/questions/51968714/is-it-correct-to-use-await-setstate
  promisedSetState = (newState) => new Promise(resolve => this.setState( newState, resolve ));
  
  // On Load, Get All Games
  handleFetchContests = async () => {
    const url = window.location.href + "api/Contests";
    const outGames = await fetch(url).then(res => res.json());
    return outGames;
  }; 

  // On Load, Fetch All Weather
  handleFetchWeather = async () => {
    const url = window.location.href + "api/weather";
    const allGamesWeather = await fetch(url).then(res => res.json());
    this.setState({ allGamesWeather })
  }

  // Set the proper state of add new page button
  handleDisableAddNewLineup = async () => {
    let addLineUpEnabled = false;
    const lineupKeys = Object.keys(this.state.chosenPlayersTable).length;
    if (lineupKeys > 2) {
      addLineUpEnabled = true;
    }
    this.setState({ addLineUpEnabled });
  }

  // Receive the ID from the game selector dropdown and update State
  handleUpdateGame = (inputChosenId) => {
    const selectedGame = inputChosenId;
    let thisGame = '';
    for (let i=0; i < this.state.games.length; i++) {
      if(this.state.games[i].id === inputChosenId) {
        thisGame = this.state.games[i];
      }
    }

    thisGame = thisGame.friendly.split(' ')[2];

    const weatherDesc = this.state.allGamesWeather[thisGame].description;
    const temperature = this.state.allGamesWeather[thisGame].temperature.toFixed(0) + " F";

    this.handleFetchPlayers(inputChosenId);
    this.setState({ selectedGame });
    this.setState({ weatherDesc });
    this.setState({ temperature });
  }

  // Based on the newly chosen game, update the players
  handleFetchPlayers = async (chosenGameID) => {
    const playersTable = this.state.playersTable;
    const newRows = this.state.playersBank[chosenGameID];
    playersTable.rows = newRows;
    this.setState({ playersTable });
  };

  // Handle Gather Players
  handleGatherAllPlayers = (totalContests) => {
    const playersBank = {}
    for (let i=0; i < totalContests.games.length; i++) {
      const thisId = totalContests.games[i].id;
      playersBank[thisId] = this.handlePopulateRows(totalContests.players[thisId]);
    }
    this.setState({ playersBank });
  }

  // Populate table with players
  handlePopulateRows = (playerData) => {
    const newRows = [];

    const playerKeys = Object.keys(playerData);
    const playerCount = playerKeys.length;

    for (let i=0; i < playerCount; i++) {
      const thisID = playerKeys[i];
      const thisData = this.handleCreateData(
        playerData[thisID]['displayName'],
        playerData[thisID]['position'],
        playerData[thisID]['teamAbbreviation'],
        playerData[thisID]['projectedPoints'],
        playerData[thisID]['salary']
      );
      thisData['display'] = 1;
      thisData['locked'] = false;
      thisData['bannedFromLineup'] = false;
      thisData['isCaptain'] = false;
      newRows.push(thisData);
    }
    newRows.sort((ele1, ele2) => {return ele2.salary - ele1.salary});
    return newRows;
  }

  // Adjust num rows per page
  handleRowsPerPage = (count) => {
    const playersTable = this.state.playersTable;
    playersTable.rowsPerPage = count;
    this.setState({ playersTable });
  }

  // Toggle between Pages
  handlePageChange = (event) => {
    const playersTable = this.state.playersTable;
    if (event === "KeyboardArrowRightIcon") {
      playersTable.page = playersTable.page + 1;
    } else {
      playersTable.page = playersTable.page - 1;
    }
    
    this.setState({ playersTable });
  }

  // Chosen lineups table
  handleAddNewPage = async () => {
    const curChosenPlayersTable = this.state.chosenPlayersTable;
    const newPage = Object.keys(curChosenPlayersTable).length;
    if (newPage > 2) {
      window.alert('The maximum number of allowed lineupes is 3.');
      return;
    }
    curChosenPlayersTable[String(newPage)] = {
      rows: JSON.parse(JSON.stringify(blankRow)),
      hidden: true,
      index: newPage,
      capRemaining: salaryCap
    }
    this.handleChangeLineUpPage(newPage);
    await this.promisedSetState({ chosenPlayersTable: curChosenPlayersTable })
    this.handleDisableAddNewLineup();
  }

  // Change the line up page by choosing which lineup and Sal remaining we are showing.
  handleChangeLineUpPage = (inputKey) => {
    const chosenPlayersTable = this.state.chosenPlayersTable;
    const pageKeys = Object.keys(chosenPlayersTable); 
    for (let i=0; i < pageKeys.length; i++) {
      const thisPage = pageKeys[i];    
      if (i === inputKey) {
        const activePlayersTable = inputKey;
        this.setState({ activePlayersTable })
        chosenPlayersTable[thisPage].hidden = false;
      } else {
        chosenPlayersTable[thisPage].hidden = true;
      }
    }
    const activeSalaryRemaining = chosenPlayersTable[inputKey].capRemaining;
    this.setState({ activeSalaryRemaining })
    this.setState({ chosenPlayersTable });
  }

  // Adding a player to a lineup
  handleAddPlayerToLineup = (inputPlayer) => {
    const curPage = this.state.activePlayersTable;
    const chosenPlayersTable = JSON.parse(JSON.stringify(this.state.chosenPlayersTable));
    let activeSalaryRemaining = this.state.activeSalaryRemaining;
    let isRostered = false;
    let isTheCaptain = false;
    let firstOpen = -1;

    for (let i=0; i < chosenPlayersTable[curPage].rows.length; i++) {
      if (chosenPlayersTable[curPage]['rows'][i]['name'] === inputPlayer['name']) {
        isRostered = true;
        break;
      } else if (chosenPlayersTable[curPage]['rows'][i]['name'] === '' && firstOpen === -1) {
        firstOpen = i;
        if (firstOpen === 0) {
          isTheCaptain = true;
        }
      }
    }
    // Ensure we are not double rostering, we have a space, and that we have salary.  Additionally check if they are the captain
    let thisSal = inputPlayer['salary'];
    if (isTheCaptain) {
      thisSal = thisSal * 1.5;
    }

    if (!isRostered && firstOpen > -1 && firstOpen < 6 && activeSalaryRemaining >= thisSal) {
      
      chosenPlayersTable[curPage]['rows'][firstOpen] = JSON.parse(JSON.stringify(inputPlayer));
      chosenPlayersTable[curPage]['rows'][firstOpen]['isCaptain'] = isTheCaptain;
      chosenPlayersTable[curPage]['capRemaining'] = activeSalaryRemaining - thisSal;
      chosenPlayersTable[curPage]['rows'][firstOpen]['salary'] = thisSal;

      if (isTheCaptain) {
        chosenPlayersTable[curPage]['rows'][firstOpen]['points'] = chosenPlayersTable[curPage]['rows'][firstOpen]['points'] * 1.5;
      }

      activeSalaryRemaining = activeSalaryRemaining - thisSal;
      let activeProjectedPoints = this.state.activeProjectedPoints + chosenPlayersTable[curPage]['rows'][firstOpen]['points'];
      chosenPlayersTable[curPage].totalProjected = activeProjectedPoints;

      this.setState({ activeProjectedPoints });
      this.setState({ activeSalaryRemaining });
      this.setState({ chosenPlayersTable });
    }

  }

  // Handle banning a player from a lineup
  handleLineUpBan = (inputPlayer) => {
    const playersTable = this.state.playersTable;
    for (let i=0; i < playersTable.rows.length; i++) {
      if (playersTable.rows[i]['name'] === inputPlayer['name']) {
        const curState = playersTable.rows[i]['bannedFromLineup'];
        playersTable.rows[i]['bannedFromLineup'] = !curState;
        break;
      }
    }
    this.setState({ playersTable })
  }

  // Check How Many Players Locked
  handleIsMaxPlayersLocked = () => {
    let count = 0;
    for (let i=0; i < this.state.playersTable.rows.length; i++) {
      const thisPlayer = this.state.playersTable.rows[i];
      if (thisPlayer.locked) {
        count++;
      }

      if (count === 5) {
        return true;
      }
    }
    return false;
  }

  // Handle locking a player into an optimized lineup
  handleLockingPlayer = (inputPlayer) => {
    if (this.handleIsMaxPlayersLocked()) {
      window.alert("You've already locked 5 players, you can't lock any more.  You are unable to lock in a captain.")
      return;
    }
    const playersTable = this.handleLockingLogic(inputPlayer, true);
    this.setState({ playersTable })
  }

  // Handle unlocking a player from optimized lineups
  handleUnlockingPlayer = (inputPlayer) => {
    const playersTable = this.handleLockingLogic(inputPlayer, false);
    this.setState({ playersTable })
  }

  // Handle shared locking logic
  handleLockingLogic = (inputPlayer, newState) => {
    const thisTable = this.state.playersTable;
    for (let i=0; i < thisTable.rows.length; i++) {
      if (thisTable.rows[i]['name'] === inputPlayer['name']) {
        thisTable.rows[i]['locked'] = newState;
        break;
      }
    }
    return thisTable;
  }

  // Remove a player from the lineup
  handleRemovePlayerLineup = (inputPlayer) => {
    const curPage = this.state.activePlayersTable;
    const chosenPlayersTable = this.state.chosenPlayersTable;

    for (let i=0; i < chosenPlayersTable[curPage].rows.length; i++) {
      if (chosenPlayersTable[curPage]['rows'][i]['name'] === inputPlayer['name']) {
        chosenPlayersTable[curPage]['rows'][i] = JSON.parse(JSON.stringify(blankPlayer));
        break;
      }
    }
    let thisSal = inputPlayer['salary'];
    chosenPlayersTable[curPage].capRemaining = chosenPlayersTable[curPage].capRemaining + thisSal;
    let activeSalaryRemaining = this.state.activeSalaryRemaining + thisSal;

    let activeProjectedPoints = this.state.activeProjectedPoints - inputPlayer['points'];
    chosenPlayersTable[curPage].totalProjected = activeProjectedPoints;

    this.setState({ activeProjectedPoints });

    this.setState({ activeSalaryRemaining });
    this.setState({ chosenPlayersTable });
  }

  // https://mui.com/material-ui/react-alert/
  // Handle Resetting all lineueps
  handleResetAllLineUps = async () => {
    const cleanedTable = JSON.parse(JSON.stringify(baseChosenPlayers));
    const activePlayersTable = 0;
    const justDeleted = this.state.chosenPlayersTable;
    const activeSalaryRemaining = salaryCap;
    const activeProjectedPoints = 0;
    this.setState({ activeProjectedPoints });
    this.setState({ activeSalaryRemaining });
    this.setState({ justDeleted });
    await this.promisedSetState({ chosenPlayersTable: cleanedTable });
    this.setState({ activePlayersTable });
    this.handleDisableAddNewLineup();
  }

  // Handle Deleting 1 Lineup
  handleDeleteOneLineup = async () => {
    let activePlayersTable = this.state.activePlayersTable;
    const curChosenTable = this.state.chosenPlayersTable;
    const countLineUps = Object.keys(curChosenTable).length;
    if (countLineUps < 2) {
      window.alert('Cannot delete your last lineup.');
      return;
    }

    const updatedPlayersTable = {};
    let pointer = 0;
    for (let i=0; i < countLineUps; i++) {

      if (i === activePlayersTable) {
        const justDeleted = this.state.chosenPlayersTable;
        this.setState({ justDeleted })
        continue;
      } else {
        updatedPlayersTable[String(pointer)] = {
          rows: JSON.parse(JSON.stringify(curChosenTable[String(i)]['rows'])),
          hidden: true,
          index: pointer,
          capRemaining: curChosenTable[String(i)].capRemaining
        }
      pointer = pointer + 1;
      }
    }

    activePlayersTable = activePlayersTable - 1;
    if (activePlayersTable < 0) {
      activePlayersTable = 0;
    }

    updatedPlayersTable[String(activePlayersTable)]['hidden'] = false;
    const activeSalaryRemaining = updatedPlayersTable[activePlayersTable].capRemaining;
    let activeProjectedPoints = updatedPlayersTable[activePlayersTable].totalProjected;

    this.setState({ activeProjectedPoints });
    this.setState({ activeSalaryRemaining })
    this.setState({ activePlayersTable });
    await this.promisedSetState({ chosenPlayersTable: updatedPlayersTable });
    this.handleDisableAddNewLineup();
  }

  // Handle Undo 1 Most Recent Delete
  handleUndoDelete = async () => {
    const restoredTable = this.state.justDeleted;
    if (restoredTable === null) {
      window.alert('Nothing to restore, only the single most recent deletion is stored.');
      return;
    }

    let activePlayersTable = 0;
    for (let i=0; i < Object.keys(restoredTable).length; i++) {
      if (restoredTable[i]['hidden'] === false) {
        activePlayersTable = i;
        break;
      }
    }

    const activeSalaryRemaining = restoredTable[activePlayersTable].capRemaining;
    this.setState({ activeSalaryRemaining })
    this.setState({ activePlayersTable });
    await this.promisedSetState({ chosenPlayersTable: restoredTable });
    await this.promisedSetState({ justDeleted: null });
    this.handleDisableAddNewLineup();
  }

  // Handle Download CSV File
  // Idea source on how to handle this problem
  // https://www.geeksforgeeks.org/how-to-create-and-download-csv-file-in-javascript/
  handleDownloadCSV = () => {
    const data = [];
    const lineUpKeys = Object.keys(this.state.chosenPlayersTable);
    for (let i=0; i < lineUpKeys.length; i++) {
      for (let j=0; j < 6; j++) {
        const thisPlayer = this.state.chosenPlayersTable[String(i)].rows[j];
        let thisName = thisPlayer['name'];
        if (thisName === '') {
          thisName = "Not Chosen";
        }
        data.push({
          lineupNumber: '"' + String(i + 1) + '"',
          name: '"' + thisName + '"', 
          points: '"' + thisPlayer['points'] + '"', 
          position: '"' + thisPlayer['position'] + '"', 
          salary: '"' + thisPlayer['salary'] + '"', 
          team: '"' + thisPlayer['team'] + '"', 
          locked: '"' + thisPlayer['locked'] + '"', 
          bannedFromLineup: '"' + thisPlayer['bannedFromLineup'] + '"',
          isCaptain: thisPlayer['isCaptain']
        })
      }
    }
    const csvdata = this.handleCSVmaker(data);
    this.handleDownload(csvdata);
  }

  handleDownload = function (data) { 
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', 'download.csv');
    a.click()
  }

  handleCSVmaker = function (data) {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    for (let i=0; i < data.length; i++) {
      csvRows.push('\n' + Object.values(data[i]).join(','));
    }
    return csvRows;
}

  // Create proper data structure for rows
  handleCreateData = (name, position, team, points, salary) => {
    return { name, position, team, points, salary };
  }

  handleOptimizationAlgorithim = async () => {
    if (Object.keys(this.state.playersBank).length === 0) {
      console.log('No Game Picked');
      return;
    }
    await this.promisedSetState({ lineUpOptimizerLoading: true });
    const availPlayers = JSON.parse(JSON.stringify(this.state.playersTable.rows));
    const availCaptains = [];

    // Build captains array
    for (let i=0; i < availPlayers.length; i++) {
      const thisCaptain = JSON.parse(JSON.stringify(availPlayers[i]));
      thisCaptain['salary'] = thisCaptain['salary'] * 1.5;
      thisCaptain['points'] = thisCaptain['points'] * 1.5;
      thisCaptain['isCaptain'] = true;
      availCaptains.push(thisCaptain);
    };

    // Capture locked players
    const initRoster = [];
    for (let i=0; i < this.state.playersTable.rows.length; i++) {
      const thisPlayer = this.state.playersTable.rows[i];
      if (thisPlayer.locked) {
        initRoster.push(thisPlayer);
      }
    }

    // Setup array to capture and begin iteration
    const rosterOptions = [{rows:[], projection: 0}];
    for (let i=0; i < availCaptains.length; i++) {
      const thisCap = availCaptains[i];
      const copyRoster = JSON.parse(JSON.stringify(initRoster));
      copyRoster.push(thisCap);
      if (thisCap.bannedFromLineup) {
        continue;
      }

      knapSack(salaryCap - thisCap.salary, availPlayers, availPlayers.length, copyRoster, thisCap, thisCap.points, rosterOptions)
    }
    
    const chosenPlayersTable = this.state.chosenPlayersTable;
    const curPage = this.state.activePlayersTable;
    const activeSalaryRemaining = rosterOptions[0].capRemaining;
    chosenPlayersTable[curPage] = {
      rows: rosterOptions[0].rows,
      index: curPage,
      capRemaining: activeSalaryRemaining,
      totalProjected: rosterOptions[0].projection
    }

    let activeProjectedPoints = chosenPlayersTable[curPage].totalProjected;

    this.setState({ activeProjectedPoints });
    this.setState({ activeSalaryRemaining });
    this.setState({ chosenPlayersTable });
    await this.promisedSetState({ lineUpOptimizerLoading: false });
  };
};

// Source that spurred optimization algorithim approach
// The problem is really just the 0-1 knapsack problem
// https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/
function max(total1, total2){
  return (total1 > total2) ? total1 : total2;
};

function knapSack(salRemain, availPlayers, ptr, thisRoster, thisCap, total, rosterOptions){

  if (ptr === 0 || salRemain <= 0 || thisRoster.length === 6) { 
    if (thisRoster.length === 6) {
      if (rosterOptions.length > 0 && rosterOptions[0].projection < total) {
        rosterOptions.shift();
        rosterOptions.push({
          rows: thisRoster,
          projection: total,
          capRemaining: salRemain
        })
      }
    }
    return 0;
  }

  const thisPlayer = availPlayers[ptr-1]
  const thisSal = thisPlayer.salary;
  const thisPoint = parseFloat(thisPlayer.points);

  // Regex exists here to test the data since
  // the draftkings api seems to change format between different contests calls some times
  const regex = new RegExp("[a-zA-Z]");

  if (thisSal > salRemain || thisSal < 1000 || 
    thisPoint < 1 || thisCap.name === thisPlayer.name ||
    regex.test(thisPlayer.points) ||
    thisPlayer.bannedFromLineup === true
    ) {
    return knapSack(salRemain, availPlayers, ptr - 1, thisRoster, thisCap, parseFloat(total), rosterOptions);

  } else {
    const newRoster = JSON.parse(JSON.stringify(thisRoster));
    newRoster.push(thisPlayer);
    return max(
      thisPoint + knapSack(salRemain - thisSal, availPlayers, ptr - 1, newRoster, thisCap, total + thisPoint, rosterOptions),
      knapSack(salRemain, availPlayers, ptr - 1, thisRoster, thisCap, total, rosterOptions)
    );
  }
};

export default App;
