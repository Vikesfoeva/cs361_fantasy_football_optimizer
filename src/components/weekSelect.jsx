import React from 'react';
import { FormControl,InputLabel, Select, MenuItem } from '@mui/material';

export default function WeekSelector() {
    const weekOptions = [];
    for (let i=1; i < 19; i++) {
    weekOptions.push(i);
    };

    const [age, setAge] = React.useState('');
    const handleChange = (event) => {
        setAge(event.target.value);
    };

    return (
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="NFL-Select-Week">NFL Week</InputLabel>
            <Select
                labelId="NFL-Select-Week"
                id="nfl-simple-select"
                label="NFLWeek"
                value={age}
                onChange={handleChange}
            >
            {weekOptions.map((week) => 
                <MenuItem value={week} key={week}>{'Week' + week}</MenuItem>
            )}
            </Select>
        </FormControl>
);}