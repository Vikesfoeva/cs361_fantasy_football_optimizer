import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import UndoIcon from '@mui/icons-material/Undo';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export default function ButtonGrid() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid xs={6}>
            <Button variant="contained" color='error' endIcon={<DeleteIcon />} onClick={deleteLineUpPrompt}>Delete Line Up</Button>
        </Grid>
        <Grid xs={6}>
            <Button variant="contained" color='info' endIcon={<UndoIcon />}>Undo Delete</Button>
        </Grid>
        <Grid xs={6}>
            <Button variant="contained" color='error' endIcon={<DeleteForeverIcon />} onClick={deleteAllLineUpsPrompt}>Reset All Line Ups</Button>
        </Grid>
        <Grid xs={6}>
            <Button variant="contained" color='secondary' endIcon={<DownloadIcon />}>Export Line Ups</Button>
        </Grid>
      </Grid>
    </Box>
  );
}

// https://mui.com/material-ui/react-alert/
function deleteLineUpPrompt() {
    window.alert('You pressed delete - later intend to make this pop up look nicer with material ui');
}

function deleteAllLineUpsPrompt() {
    window.alert('You pressed the delete all line ups button, intend to later make this pop up look nicer with material ui')
}