import { useCallback, useEffect, useState } from "react";
import Calendar from "../components/Calendar";
import axios from "axios";
import dayjs from "dayjs";
import {
  Box,
  Button,
  Container,
  Divider,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  tableCellClasses,
} from "@mui/material";
import styled from "@emotion/styled";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const createEmptyArray = (rows, cols, value) => {
  return Array(rows)
    .fill()
    .map(() => Array(cols).fill(value));
};

const hours = [
  "08:00-09:30",
  "09:45-11:15",
  "11:30-13:00",
  "13:30-15:00",
  "15:15-16:45",
  "16:45-18:15",
  "18:15-20:00",
  "20:00-21:30",
];

export default function ReservePage() {
  const [maxReservations, setMaxReservations] = useState(null);
  const [calendarMatrix, setCalendarMatrix] = useState(
    createEmptyArray(8, 6, maxReservations)
  );
  const [date, setDate] = useState(dayjs());
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [resCount, setResCount] = useState(0);
  const [resCountError, setResCountError] = useState();
  const [cellResCount, setCellResCount] = useState();
  const [calendarSelectedStartTime, setCalendarSelectedStartTime] = useState(
    dayjs()
  );
  const [calendarSelectedEndTime, setCalendarSelectedEndTime] = useState(
    dayjs()
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/reservations/max");
        setMaxReservations(response.data.maxReservations);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleResCountNumberInput = (event) => {
    const regex = /^[0-9]*$/;
    const newValue = event.target.value;

    if (regex.test(newValue) || newValue === "") {
      setResCount(newValue);
    }
  };

  useEffect(() => {
    setResCountError("");
    if (parseInt(resCount) > cellResCount) {
      setResCountError("Max. " + cellResCount);
    }
  }, [resCount, cellResCount]);

  const fetchReservationsForWeek = useCallback(async () => {
    // clear matrix
    setCalendarMatrix(createEmptyArray(8, 6, maxReservations));

    const startDay = date.startOf("week").add(1, "day");

    const params = {
      startTime: startDay.toISOString(),
      endTime: startDay.add(7, "days").toISOString(),
    };

    try {
      const res = (
        await axios.get("/reservations/time-period", {
          params: params,
        })
      ).data;

      const buff = createEmptyArray(8, 6, maxReservations);
      res.forEach((r) => {
        const start = dayjs(r.startTime).format("HH:mm");
        const end = dayjs(r.endTime).format("HH:mm");
        const row = hours.findIndex((h) => h === `${start}-${end}`);

        if (row !== -1) {
          const col = dayjs(r.startTime).date() - startDay.date();
          buff[row][col] -= r.count;
        }
      });

      setCalendarMatrix(buff);
    } catch (error) {
      console.log(error);
    }
  }, [maxReservations, date]);

  useEffect(() => {
    setCalendarMatrix(createEmptyArray(8, 6, maxReservations));
    fetchReservationsForWeek();
  }, [date, maxReservations, fetchReservationsForWeek]);

  const handleDateChange = (date) => {
    setDate(date);
  };

  const loadReservationsForHour = useCallback(async () => {
    const params = {
      startTime: calendarSelectedStartTime.toISOString(),
      endTime: calendarSelectedEndTime.toISOString(),
    };

    try {
      const res = (
        await axios.get("/reservations/time-period", {
          params: params,
        })
      ).data;

      const myRows = res.map((r) => {
        return { name: `${r.lastName}, ${r.firstName}`, count: r.count };
      });

      setRows(myRows.length > 0 ? myRows : [{ name: "---", count: 0 }]);
    } catch (error) {
      console.log(error);
    }
  }, [calendarSelectedEndTime, calendarSelectedStartTime]);

  useEffect(() => {
    loadReservationsForHour();
  }, [
    calendarSelectedStartTime,
    calendarSelectedEndTime,
    loadReservationsForHour,
  ]);

  const handleCellClick = (data, index) => {
    setOpen(true);
    const { hour, idx } = index;
    setCellResCount(data);

    const parsedStartTime = dayjs(hour[0], "HH:mm");
    const parsedEndTime = dayjs(hour[1], "HH:mm");

    const startDay = date.startOf("week").add(idx + 1, "day");
    setCalendarSelectedStartTime(
      startDay.hour(parsedStartTime.hour()).minute(parsedStartTime.minute())
    );
    setCalendarSelectedEndTime(
      startDay.hour(parsedEndTime.hour()).minute(parsedEndTime.minute())
    );
  };

  const handleClose = () => {
    setOpen(false);
  };

  const createReservation = () => {
    const body = {
      data: {
        startTime: calendarSelectedStartTime,
        endTime: calendarSelectedEndTime,
        count: resCount,
      },
    };

    axios
      .post("/reservations/", body)
      .then((response) => {
        loadReservationsForHour();
        fetchReservationsForWeek();
        setCellResCount(cellResCount - resCount);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Container>
      <Modal
        open={open}
        onClose={handleClose}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper style={{ padding: 15 }}>
          <Typography variant="h6" fontWeight="bold" marginBottom={1}>
            Reservierungen
          </Typography>
          <TableContainer component={Paper} sx={{maxHeight: 300}}>
            <Table sx={{ minWidth: 300 }} aria-label="reservation table">
              <TableHead>
                <TableRow>
                  <StyledTableCell style={{ fontWeight: "bold" }}>
                    Name
                  </StyledTableCell>
                  <StyledTableCell style={{ fontWeight: "bold" }} align="right">
                    Anzahl
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, idx) => (
                  <StyledTableRow
                    key={idx}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <StyledTableCell component="th" scope="row">
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.count}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Divider style={{ marginTop: 15 }} />

          <Box display="flex" alignItems="start" style={{ marginTop: 15 }}>
            <TextField
              label="Anzahl"
              value={resCount}
              helperText={resCountError}
              error={resCountError?.length > 0}
              onChange={handleResCountNumberInput}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              style={{ maxWidth: 150 }}
              size="small"
            />
            <Button
              disabled={resCountError?.length > 0}
              variant="contained"
              style={{ marginLeft: 10 }}
              onClick={createReservation}
            >
              Reservieren
            </Button>
          </Box>
        </Paper>
      </Modal>

      <Calendar
        cellMatrix={calendarMatrix}
        maxReservations={maxReservations}
        onDateChange={handleDateChange}
        onCellClick={handleCellClick}
      />
    </Container>
  );
}
