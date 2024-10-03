import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "style/customCalendar.css";
import PropTypes from "prop-types"; // Import PropTypes

const CustomCalendar = ({ loginData }) => {
  const [loginDates, setLoginDates] = useState([]);

  useEffect(() => {
    // Fetch the login data from the API
    const constructDates = () => {
      // Extract the login dates
      const dates = loginData
        .filter((entry) => entry.login_date)
        .map((entry) => new Date(entry.login_date).toDateString());
      setLoginDates(dates);
    };

    if (loginData) {
      constructDates();
    }
  }, [loginData]);

  // Function to determine the color of a day
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const today = new Date();
      const dayString = date.toDateString();

      // If it's a future date, return gray
      if (date > today) {
        return "gray-day";
      }

      // If the user logged in on this day, return green
      // console.log(loginDates);
      // console.log(dayString);
      if (loginDates.includes(dayString)) {
        return "green-day";
      }

      // Otherwise, it's a day they didn't log in, so return red
      return "red-day";
    }
    return null;
  };

  return (
    <div>
      <Calendar tileClassName={tileClassName} />
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
};

export default CustomCalendar;
