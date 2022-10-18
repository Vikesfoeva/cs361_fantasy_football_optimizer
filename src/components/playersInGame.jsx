import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
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
    createData('Sylas', 'QB', 'Treinta y Tres', 19.86, 5135),
    createData('Amitie', 'QB', 'Lebedyn', 19.6, 10571),
    createData('Jake', 'QB', 'Sambong', 5.83, 11955),
    createData('Theo', 'QB', 'Baihe', 10.4, 9555),
    createData('Reinold', 'QB', 'Chanika', 10.25, 14147),
    createData('Vally', 'QB', 'Emiliano Zapata', 23.08, 13790),
    createData('Isabeau', 'QB', 'Tocoa', 5.15, 6575),
    createData('Doreen', 'QB', 'Changqing', 12, 8117),
    createData('Lyndy', 'QB', 'Caazapá', 15.65, 12714),
    createData('Alain', 'QB', 'Pul-e Khumrī', 6.57, 7746),
    createData('Giraud', 'QB', 'Kopidlno', 19.38, 10341),
    createData('Wendell', 'QB', 'Kota Kinabalu', 22.29, 5898),
    createData('Hammad', 'QB', 'Eskilstuna', 16.4, 8234),
    createData('Darb', 'QB', 'Požarevac', 24.22, 8471),
    createData('Alica', 'QB', 'Klana', 12.81, 7534),
    createData('Editha', 'QB', 'Sumberwaru', 4.08, 9435),
    createData('Hillyer', 'QB', 'Gorzyczki', 14.51, 14808),
    createData('Anthiathia', 'QB', 'Fratar', 24.02, 8048),
    createData('Harri', 'QB', 'Parbatipur', 5, 6794),
    createData('Van', 'QB', 'Blackfalds', 2.28, 14129),
    createData('Hermon', 'QB', 'Dongla', 20.92, 9633),
    createData('Christian', 'QB', 'Pásion', 21.53, 11170),
    createData('Raphaela', 'QB', 'Mỹ Thọ', 3.73, 8285),
    createData('Daisie', 'QB', 'Burns Lake', 21.41, 6416),
    createData('Phillip', 'QB', 'Ipoh', 23.66, 6347),
    createData('Maridel', 'QB', 'Stara Kornica', 18.86, 5501),
    createData('Torrie', 'QB', 'Jiajiaying', 10.1, 9591),
    createData('Ange', 'QB', 'Kommunisticheskiy', 8.54, 6555),
    createData('Mora', 'QB', 'Matou', 6.68, 10486),
    createData('Berk', 'QB', 'Montemor-o-Velho', 17.71, 10648),
    createData('Nani', 'QB', 'Taraban Timur', 21.77, 7373),
    createData('Lucia', 'QB', 'La Purisima', 6.21, 10626),
    createData('Parsifal', 'QB', 'Fujishiro', 23.35, 10857),
    createData('Louie', 'QB', 'Trinity', 12.12, 7554),
    createData('Edlin', 'QB', 'Talovyy', 4.59, 8794),
    createData('Emyle', 'QB', 'Sukasada', 19.93, 5644),
    createData('Evangelina', 'QB', 'Penhascoso', 18.78, 9492),
    createData('Nadia', 'QB', 'Vilarelho', 10.9, 10186),
    createData('Eliot', 'QB', 'Dois Vizinhos', 5.81, 13044),
    createData('Delcina', 'QB', 'Denver', 14.46, 9426),
    createData('Brennen', 'QB', 'Kinel’-Cherkassy', 17.75, 9686),
    createData('Leola', 'QB', 'Anabar', 13.05, 13109),
    createData('Maryanne', 'QB', 'Jiucaigou', 21.38, 8079),
    createData('Dolf', 'QB', 'Piedras', 11.98, 9830)
];

export default function AllPlayersTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
