import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { StyledTableCell } from "../components/StyledTable";

export default function MyReservationsPage() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="my reservations table">
        <TableHead>
          <TableRow>
            <StyledTableCell style={{ fontWeight: "bold" }}>
            </StyledTableCell>
            <StyledTableCell style={{ fontWeight: "bold" }} align="right">
              Anzahl
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
            <TableCell component="th" scope="row">
              {}
            </TableCell>
            <TableCell align="right">{}</TableCell>
            <TableCell align="right">{}</TableCell>
            <TableCell align="right">{}</TableCell>
            <TableCell align="right">{}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
