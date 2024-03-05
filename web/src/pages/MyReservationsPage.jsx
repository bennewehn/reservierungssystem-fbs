import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const columns = [
  {
    field: "createdOn",
    headerName: "Erstellt am",
    width: 150,
  },
  {
    field: "date",
    headerName: "Datum",
    width: 100,
  },
  {
    field: "hours",
    headerName: "Zeit",
    width: 100,
  },
  {
    field: "count",
    headerName: "Anzahl",
    type: "number",
    width: 80,
  },
];

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [selection, setSelection] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/reservations");

        setReservations(
          response.data.map((r) => {
            return {
              id: r.rId,
              createdOn: dayjs(r.createdOn).format("DD.MM.YYYY HH:mm"),
              date: dayjs(r.startTime).format("DD.MM.YYYY"),
              hours: `${dayjs(r.startTime).format("HH:mm")}-${dayjs(
                r.endTime
              ).format("HH:mm")}`,
              count: r.count,
            };
          })
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async () => {
    let deleted = [];
    await Promise.all(
      selection.map(async (id) => {
        try {
          const response = await axios.delete(`/reservations/${id}`);
          if (response.status === 200) {
            deleted.push(id);
          }
        } catch (e) {
          console.log(e);
        }
      })
    );

    console.log(deleted);
    setReservations(
      reservations.filter((r) => !deleted.some((id) => r.id === id))
    );
    setSelection([]);
  };

  return (
    <Box sx={{ height: 575, width: 500 }}>
      <DataGrid
        rows={reservations}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 9,
            },
          },
        }}
        pageSizeOptions={[9]}
        checkboxSelection
        disableRowSelectionOnClick
        onRowSelectionModelChange={(selectionModel) => {
          setSelection(selectionModel);
        }}
      />
      <Button
        variant="outlined"
        startIcon={<DeleteIcon />}
        sx={{ marginTop: 1 }}
        onClick={handleDelete}
      >
        Löschen
      </Button>
    </Box>
  );
}
