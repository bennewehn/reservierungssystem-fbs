import React, { useState, useEffect, useRef } from "react";
import { IconButton } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EventIcon from "@mui/icons-material/Event";
import { styled } from "@mui/system";
import dayjs from "dayjs";
import "./DateField.css";

export default function DateField({ onChange }) {
  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()));
  const initialRender = useRef(true);


  useEffect(() => {
    if (!initialRender.current) {
      onChange(selectedDate);
    } else {
      initialRender.current = false;
    }
  }, [selectedDate]);

  const handleLastWeek = () => {
    setSelectedDate((prev) => prev.subtract(7, "day"));
  };

  const handleNextWeek = () => {
    setSelectedDate((prev) => prev.add(7, "day"));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const OpenPickerIcon = styled(EventIcon)({
    fontSize: "18px",
  });

  return (
    <div className="d-flex justify-content-center">
      <IconButton className="px-3" onClick={handleLastWeek}>
        <ArrowBackIcon className="icon" />
      </IconButton>
      <DatePicker
        value={selectedDate}
        onChange={handleDateChange}
        slotProps={{ textField: { variant: "outlined" } }}
        className="custom-datepicker"
        slots={{ openPickerIcon: OpenPickerIcon }}
      />
      <IconButton className="px-3" onClick={handleNextWeek}>
        <ArrowForwardIcon className="icon" />
      </IconButton>
    </div>
  );
}
