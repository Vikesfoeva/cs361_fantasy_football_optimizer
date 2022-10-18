import React from 'react'
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

const baseUrl = window.location.href;
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
function App() {
  return (
    <React.Fragment>
      <React.Fragment>
        <Typography variant='h2'>Fantasy Football Roster Optimization Tool</Typography>
        <WeekSelector />
        <GameSelector />

        <Grid container spacing={2}>
          <Grid xs={4.5}>
            <AllPlayersTable />
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
        <Button variant='contained' coloor='success' onClick={fetchDataTest}>Server Connection Test - View Network</Button>
      </React.Fragment>
    </React.Fragment>
  );
}

const fetchDataTest = async () => {
  const url = baseUrl + "api/dkTest";
  fetch(url)
  .then(res => res.json())
  .then((out) => {
    console.log(out);
  });
};

export default App;
