import React from 'react'
import WeekSelector from './components/weekSelect';
import { Typography } from '@mui/material';

const baseUrl = window.location.href;

function App() {
  return (
    <React.Fragment>
      <React.Fragment>
        <Typography variant='h1'>Fantasy Football Roster Optimization Tool</Typography>
        <WeekSelector />
        <button onClick={fetchDataTest}>DK Test</button>
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
