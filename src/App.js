import React, { Component } from 'react';
import WeekSelector from './components/weekSelect';
import { Icon, Typography } from '@mui/material';
import GameSelector from './components/gameSelect';
import AllPlayersTable from './components/playersInGame';
import ChosenPlayers from './components/chosenPlayers';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { styled } from '@mui/material/styles';
import ButtonGrid from './components/buttonGrid';
import Button from '@mui/material/Button';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import ClearIcon from '@mui/icons-material/Clear';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import BasicTabs from './components/tabbedLineUps';
import HelpIcon from '@mui/icons-material/Help';

class App extends Component {
  state = { 
    games: [],
    selectedGame: 0,
    playersBank: {},
    playersTable: {
      page: 0,
      rowsPerPage: 25,
      rowsPerPageOptions: [25, 50, 100],
      rows: []
    }
  } 
  constructor() {
    super();
  }

  async componentDidMount() {
    const totalGames = await this.handleFetchContests();
    console.log(totalGames);
    const gameKeys = [];
    for (let i=0;  i < totalGames.length; i++) {
      gameKeys.push(totalGames[i]['id']);
    }
    await this.handleGatherAllPlayers(gameKeys);
    await this.promisedSetState({ games: totalGames})
  }

  render() { 
    return (
      <React.Fragment>
        <React.Fragment>
          <Typography variant='h2'>Fantasy Football Roster Optimization Tool</Typography>
          
          <WeekSelector />
          <GameSelector 
            gamesAvail={this.state.games}
            updateGameSelection={this.handleUpdateGame}
          />
          <Button variant='contained' color='success' onClick={this.handleLearnMore}>Learn More <HelpIcon /></Button>
  
          <Grid container spacing={2}>
            <Grid xs={4.5}>
              <AllPlayersTable 
                playersAvail={this.state.players}
                playersTable={this.state.playersTable}
                changeRowsPerPage={this.handleRowsPerPage}
                changePage={this.handlePageChange}
              />
            </Grid>
            <Grid xs={1.5}>
              <Button variant="contained" color='success' endIcon={<AutoModeIcon />}>Generate Line Ups</Button>
              <Grid container spacing={2}>
                <Grid xs={5}>
                  <ClearIcon />
                </Grid>
                <Grid xs={5}>
                  <Typography>Remove</Typography>
                </Grid>
  
                <Grid xs={5}>
                  <LockIcon />
                </Grid>
                <Grid xs={5}>
                  <Typography>Locked</Typography>
                </Grid>
  
                <Grid xs={5}>
                  <LockOpenIcon />
                </Grid>
                <Grid xs={5}>
                  <Typography>Unlocked</Typography>
                </Grid>
              </Grid>           
            </Grid>
            <Grid xs={4.5}>
              <BasicTabs />
              <ButtonGrid />
            </Grid>
          </Grid>
          <Button variant='contained' color='success' onClick={this.handleTestMicro} disabled={false} key="networkButton">Get Single Contest Data</Button>
        </React.Fragment>
      </React.Fragment>
    );
  }
  // https://stackoverflow.com/questions/51968714/is-it-correct-to-use-await-setstate
  promisedSetState = (newState) => new Promise(resolve => this.setState( newState, resolve ));
  
  // On Load, Get All Games
  handleFetchContests = async () => {
    const url = window.location.href + "api/Contests";
    const outGames = await fetch(url).then(res => res.json());
    // await this.promisedSetState({ games: outGames})
    return outGames;
  }; 

  handleTestMicro = () => {
    const testId = 136053129;
    const url = baseUrl + "api/Contests/" + String(testId);
    fetch(url)
    .then(res => res.json())
    .then((out) => {
      console.log(out);
    });
  }

  // Receive the ID from the game slector dropdown and update State
  handleUpdateGame = (inputChosenId) => {
    const selectedGame = inputChosenId;
    this.handleFetchPlayers(inputChosenId);
    this.setState({ selectedGame });
  }

  // Based on the newly chosen game, update the players
  handleFetchPlayers = async (chosenGameID) => {
    const playersTable = this.state.playersTable;
    const newRows = this.state.playersBank[chosenGameID];
    playersTable.rows = newRows;
    this.setState({ playersTable });
  };

  // Learn more button
   handleLearnMore = () => {
    alert('This website allows a user to optimize their fantasy football line ups by aggregating ' + 
    'data, helping to run optimizations, and letting them visualize different outcomes.\n\n' + 
    'The user can select which week of games they want to choose from, which game that week ' + 
    'and then use the optimization, and visualization tools on the right to help them arrive at the' + 
    'right decisions.\n\n' + 
    'Users will be able be able to flexibly, change, undo, and export their lineups.');
  };

  // Handle Gather Players
  handleGatherAllPlayers = async (gameIds) => {
    const thisBank = {}
    for (let i=0; i < gameIds.length; i++) {
      const thisID = gameIds[i];
      const url = baseUrl + "api/Contests/" + String(thisID);
      await fetch(url)
      .then(res => res.json())
      .then((out) => {
        thisBank[thisID] = this.handlePopulateRows(out);
      });
    };
    await this.promisedSetState({ playersBank: thisBank})
  }

  // Populate table with players
  handlePopulateRows = (playerData) => {
    const playersTable = this.state.playersTable;
    const newRows = [];

    const playerKeys = Object.keys(playerData);
    const playerCount = playerKeys.length;

    for (let i=0; i < playerCount; i++) {
      const thisID = playerKeys[i];
      const thisData = createData(
        playerData[thisID]['displayName'],
        playerData[thisID]['position'],
        playerData[thisID]['teamAbbreviation'],
        playerData[thisID]['projectedPoints'],
        playerData[thisID]['salary']
      );
      newRows.push(thisData);
    }
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
}

function createData(name, position, team, points, salary) {
  return { name, position, team, points, salary };
}

const baseUrl = window.location.href;
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
 
export default App;
