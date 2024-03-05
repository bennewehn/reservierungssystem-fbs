import "./Calendar.css";
import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import DateField from "./DateField";
import dayjs from "dayjs";

export default function Calendar({ cellMatrix, maxReservations, onDateChange, onCellClick }) {
  const [currentDay, setCurrentDay] = useState(dayjs(Date()));

  const days = ["Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."];

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

  const setCurrentWeek = (day) => {
    setCurrentDay(day.startOf("week").add(1, "day"));
    if (onDateChange) onDateChange(day);
  };

  const getCellColor = (count) => {
    if (count === 0) return "full-cell";
    else if (count <= 0.4 * maxReservations) return "middle2-cell";
    else if (count <= 0.7 * maxReservations) return "middle-cell";
    return "free-cell";
  };

  return (
    <div>
      <Paper elevation={6} className="p-3">
        <DateField onChange={(day) => setCurrentWeek(day)} />
        <div className="mt-2 main">
          <table className="centered-table mycalendar prevent-highlight">
            <thead>
              <tr className="header">
                <th colSpan={1}>Time</th>
                {days.map((day, idx) => {
                  const date = new Date(currentDay);
                  date.setDate(date.getDate() + idx);
                  const formattedDate = `${String(date.getDate()).padStart(
                    2,
                    "0"
                  )}.${String(date.getMonth() + 1).padStart(2, "0")}`;

                  return (
                    <th key={idx}>
                      {day} <span className="th-date">{formattedDate}</span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {hours
                ?.map((hour) => hour.split("-"))
                ?.map((hour, idx) => (
                  <tr key={hour}>
                    <td className="hour-cell">
                      <div className="hour-text">{hour[0]}</div>
                      <div className="lesson-count">{idx}</div>
                      <div className="hour-text">{hour[1]}</div>
                    </td>

                    {cellMatrix[idx]?.map((data, idx) => (
                      <td key={idx} className={getCellColor(data)} onClick={() => onCellClick(data, {hour, idx})}>
                        {data}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Paper>
    </div>
  );
}
