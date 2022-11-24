import React, { Component } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import ClearIcon from '@mui/icons-material/Clear';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '@mui/material';

class AllPlayersTable extends Component {
  
  render() { 

    const page = this.props.playersTable.page;
    const rowsPerPage = this.props.playersTable.rowsPerPage;
    const rows = this.props.playersTable.rows;
    const addPlayerToLineup = this.props.addPlayerToLineup;

    const columns = [
      { id: 'name', label: 'Name', minWidth: 80 },
      { id: 'position', label: 'Position', minWidth: 60, align: 'center' },
      { id: 'team', label: 'Team', minWidth: 60, align: 'center' },
      { id: 'points', label: 'Projected Points', minWidth: 60, align: 'center', format: (value) => value.toFixed(2) },
      { id: 'salary', label: 'Salary', minWidth: 60, align: 'center' },
      { id: 'actions', label: 'Actions', minWidth: 80, algin: 'center'}
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
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        if (column.id === 'actions') {
                          // https://smartdevpreneur.com/guide-to-material-ui-iconbutton-onclick-and-hover/#Material-UI_IconButton_ToolTip_on_Hover
                          return (
                            <TableCell key={column.id} align={column.align}>

                              <IconButton sx={{ "&:hover": { color: "green" }}}>
                                  <AddIcon onClick={() => addPlayerToLineup(row)}/>
                                </IconButton>

                              <IconButton sx={{ "&:hover": { color: "red" }}}>
                                <ClearIcon />
                              </IconButton>
                            
                              <IconButton sx={{ "&:hover": { color: "blue" }}}>
                                <LockIcon sx={{ display: { xs: 'none'} }}/>
                                <LockOpenIcon sx={{ display: { xs: 1} }}/>
                              </IconButton> 
                            </TableCell>
                        )} 
                        else {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
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
        <TablePagination
          rowsPerPageOptions={this.props.playersTable.rowsPerPageOptions}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event) => this.props.changePage(event.target.dataset.testid)}
          onRowsPerPageChange={(event) => this.props.changeRowsPerPage(event.target.value)}
        />
      </Paper>
    );
  }
}
 
export default AllPlayersTable;
