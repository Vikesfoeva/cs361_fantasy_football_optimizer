import React from 'react';
import { FormControl,InputLabel, Select, MenuItem } from '@mui/material';

export default function GameSelector() {
    const gameOptions = [
        'Saints @ Cardinals', 'Steelers @ Dolphins', 'Bears @ Patriots', 'Buccaneers @ Panthers', 'Falcons @ Bengals', 
        'Giants @ Jaguars', 'Packers @ Commanders', 'Seahawks @ Chargers', 'Chiefs @ 49ers', 'Browns @ Ravens', 'Lions @ Cowboys', 
        'Colts @ Titans', 'Jets @ Broncos', 'Texans @ Raiders'
    ];

    const [game, setAge] = React.useState('');
    const handleGameChange = (event) => {
        setAge(event.target.value);
    };

    return (
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="GameDropdown">NFL Game</InputLabel>
            <Select
                labelId="NFLSelectGame"
                id="nflgameselect"
                label="NFLGame"
                value={game}
                onChange={handleGameChange}
            >
            {gameOptions.map((game) => 
                <MenuItem value={game} key={game}>{game}</MenuItem>
            )}
            </Select>
        </FormControl>
);}