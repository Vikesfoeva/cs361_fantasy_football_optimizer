import React, { Component } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import UndoIcon from '@mui/icons-material/Undo';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

class ButtonGrid extends Component {
  render() { 
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid xs={6}>
              <Button 
                variant = "contained" 
                color = 'error' 
                endIcon = {<DeleteIcon />} 
                onClick = {() => this.props.deleteOneLineup()}
              >
                Delete Line Up
              </Button>
          </Grid>
          <Grid xs={6}>
              <Button 
                variant="contained" 
                color='info' 
                endIcon={<UndoIcon />}
                onClick = {() => this.props.undoDelete()}
              >
                Undo Delete
              </Button>
          </Grid>
          <Grid xs={6}>
              <Button 
                variant="contained" 
                color='error' 
                endIcon={<DeleteForeverIcon />} 
                onClick={this.props.resetAllLineUps}
                >
                  Reset All Line Ups
                </Button>
          </Grid>
          <Grid xs={6}>
              <Button variant="contained" color='secondary' endIcon={<DownloadIcon />}>Export Line Ups</Button>
          </Grid>
        </Grid>
      </Box>
    );
  }
}
 
export default ButtonGrid;
