import React, { Component } from 'react';
import { FormControl,InputLabel, Select, MenuItem } from '@mui/material';

class GameSelector extends Component {
    render() { 
        return (
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="GameDropdown">NFL Game</InputLabel>
            <Select
                name='gameName' 
                labelId="NFLSelectGame"
                id="nflgameselect"
                label="NFLGame"
                onChange={(event) => this.props.updateGameSelection(event.target.value)}
            >
            {this.props.gamesAvail.map((game) => 
                <MenuItem value={game.id} key={game.id}>
                    {game.friendlyName}
                </MenuItem>
            )}
            </Select>
        </FormControl>
        );
    }
}
export default GameSelector;