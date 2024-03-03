import { useEffect, useState } from "react";
import Calendar from "../components/Calendar";
import axios from "axios";
import dayjs from "dayjs";

export default function ReservePage() {
  const createEmptyArray = (rows, cols) => {
    return Array(rows)
      .fill()
      .map(() => Array(cols).fill(0));
  };

  const [data, setData] = useState(createEmptyArray(8, 6));
  const [maxReservations, setMaxReservations] = useState(0);

  const setDataValue = (rowIndex, colIndex, value) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex][colIndex] = value;
      return newData;
    });
  };

  const hours = [
    "08:00-09:30",
    "09:45-11:35",
    "11:30-13:00",
    "13:00-15:00",
    "15:15-16:45",
    "16:45-18:15",
    "18:15-20:00",
    "20:00-21:30",
  ];

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

  const fetchReservations = async (day) => {
    // clear matrix
    setData(createEmptyArray(8, 6));

    const startDay = day.startOf("week").add(1, "day");

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

      res.forEach((r) => {
        const start = dayjs(r.startTime).format("HH:mm");
        const end = dayjs(r.endTime).format("HH:mm");
        const row = hours.findIndex((h) => h === `${start}-${end}`);

        if (row !== -1) {
          const col = dayjs(r.startTime).date() - startDay.date();
          setDataValue(row, col, r.count);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDateChange = (date) => {
    fetchReservations(date);
  };

  return <Calendar cellMatrix={data} onDateChange={handleDateChange} />;
}
