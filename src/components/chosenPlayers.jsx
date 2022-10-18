import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const columns = [
  { id: 'name', label: 'Name', minWidth: 80 },
  {
    id: 'position',
    label: 'Position',
    minWidth: 60,
    align: 'right',
  },
  {
    id: 'team',
    label: 'Team',
    minWidth: 60,
    align: 'right',
  },
  {
    id: 'points',
    label: 'Projected Points',
    minWidth: 60,
    align: 'right',
    format: (value) => value.toFixed(2),
  },
  {
    id: 'salary',
    label: 'Salary',
    minWidth: 60,
    align: 'right',
  },
];

function createData(name, position, team, points, salary) {
  return { name, position, team, points, salary };
}

// Dummy data created with mockarooo
// https://www.mockaroo.com/
const rows = [
    createData('Sherman', 'QB', 'Shuidong', 2.9, 6752),
    createData('Arvie', 'QB', 'Brooklyn', 17.99, 13414),
    createData('Ethelbert', 'QB', 'Tekeli', 2, 11537),
    createData('Boyd', 'QB', 'Port-de-Paix', 5.07, 11649),
    createData('Vernen', 'QB', 'Roi Et', 20.1, 7871),
    createData('Filberte', 'QB', 'Naberera', 4.16, 11665),
];

export default function ChosenPlayers() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);

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
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
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
