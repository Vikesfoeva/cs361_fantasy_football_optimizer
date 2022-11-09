import React, { Component } from 'react';
import { FormControl,InputLabel, Select, MenuItem } from '@mui/material';

class GameSelector extends Component {
    render() { 
        const gameOptions = this.props.gamesAvail;

        return (
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="GameDropdown">NFL Game</InputLabel>
            <Select
                labelId="NFLSelectGame"
                id="nflgameselect"
                label="NFLGame"
            >
            {gameOptions.map((game) => 
                <MenuItem value={game} key={game}>{game}</MenuItem>
            )}
            </Select>
        </FormControl>
        );
    }

}
 
export default GameSelector;