import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ChosenPlayers from './chosenPlayers';
import AddIcon from '@mui/icons-material/Add';

class BasicTabs extends Component {
  render() { 
    const chosenPages = this.props.chosenPlayersTable;
    const pageKeys = Object.keys(chosenPages);
    return (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs aria-label="basic tabs example">
              {
                pageKeys.map(thisKey => {
                  return (
                    <Tab 
                      label={"Lineup " + (chosenPages[thisKey].index + 1)}
                      onClick={() => this.props.changePage(chosenPages[thisKey].index)}
                    />
                  )
                })
              }
              <Tab label={<AddIcon />} onClick={() => this.props.addNewTab()} />
            </Tabs>
          </Box>
          {
            pageKeys.map(thisKey => {
              return (
                <Box index={pageKeys.indexOf(thisKey)} hidden={chosenPages[thisKey].hidden}>
                  <Typography>
                    <ChosenPlayers 
                      thisPlayerTable = {chosenPages[thisKey].rows}
                    />
                  </Typography>
                </Box>
              )})
          }
        </Box>
    );
  }
}
 
export default BasicTabs;
