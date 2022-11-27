import React, { Component } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ClearIcon from '@mui/icons-material/Clear';
import { IconButton } from '@mui/material';

class ChosenPlayers extends Component {
  render() { 
    const page = 0;
    const rowsPerPage = 6;
    const rows = this.props.thisPlayerTable;
    const columns = [
      { id: 'type', label: 'Type', minWidth: 40, align: 'right'},
      { id: 'name', label: 'Name', minWidth: 40 },
      { id: 'position', label: 'Position', minWidth: 40, align: 'right'},
      { id: 'team', label: 'Team', minWidth: 40, align: 'right'},
      { id: 'points', label: 'Projected Points', minWidth: 40, align: 'right', format: (value) => value.toFixed(2)},
      { id: 'salary', label: 'Salary', minWidth: 40, align: 'right'},
      { id: 'actions', label: 'Actions', minWidth: 40, algin: 'center'}
    ];

    return (
      <Paper sx={{ minWidth: '50%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 800 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        if (column.id === 'actions' && row['display'] !== 'none') {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <IconButton sx={{ "&:hover": { color: "red" }}}>
                                <ClearIcon 
                                  onClick={() => this.props.removeFromLineup(row)}
                                  sx={{ display: { xs: row['display']} }}
                                />
                              </IconButton>
                            </TableCell>
                        )} else if (column.id === 'actions') {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <ClearIcon sx={{ display: { xs: 'none'} }}/>
                            </TableCell>
                          )
                        } else if (column.id === 'type' && index === 0) {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              Captain (1.5x)
                            </TableCell>
                          )
                        } else if (column.id === 'type' && index > 0) {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              Regular (1x)
                            </TableCell>
                          )
                        }
                        else {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === 'number'
                                ? column.format(value) : value}
                            </TableCell>
                          );
                        }
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }
}
 
export default ChosenPlayers;
