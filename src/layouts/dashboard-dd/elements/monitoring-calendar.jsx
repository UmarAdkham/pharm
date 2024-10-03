import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "style/customCalendar.css"; // Adjust this file for styling
import PropTypes from "prop-types";

const CustomCalendar = ({ loginData, onMonthChange }) => {
  const [loginDates, setLoginDates] = useState([]);

  useEffect(() => {
    const constructDates = () => {
      const dates = loginData
        .filter((entry) => entry.login_date)
        .map((entry) => new Date(entry.login_date).toDateString());
      setLoginDates(dates);
    };

    if (loginData) {
      constructDates();
    }
  }, [loginData]);

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const today = new Date();
      const dayString = date.toDateString();

      if (date > today) {
        return "gray-day";
      }

      if (loginDates.includes(dayString)) {
        return "green-day";
      }

      return "red-day";
    }
    return null;
  };

  // Detect when the active month changes
  const handleMonthChange = ({ activeStartDate }) => {
    const newMonth = activeStartDate.getMonth() + 1; // Get the new month (1-12)
    onMonthChange(newMonth); // Trigger the parent component's callback
  };

  return (
    <div>
      <Calendar
        locale="ru-RU" // Set calendar locale to Russian
        tileClassName={tileClassName}
        onActiveStartDateChange={handleMonthChange}
      />
    </div>
  );
};

CustomCalendar.propTypes = {
  loginData: PropTypes.arrayOf(
    PropTypes.shape({
      login_date: PropTypes.string,
      logout_date: PropTypes.string,
      location: PropTypes.string,
      latitude: PropTypes.string,
      longitude: PropTypes.string,
      durstion: PropTypes.string,
      user_id: PropTypes.number,
      user_full_name: PropTypes.string,
      user_status: PropTypes.string,
    })
  ).isRequired,
  onMonthChange: PropTypes.func.isRequired, // Add PropType for the onMonthChange function
};

export default CustomCalendar;
