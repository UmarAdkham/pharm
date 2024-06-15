import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import DataTable from "examples/Tables/DataTable";

const PharmacyDoctorsListTable = ({ pharmacyId }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pharmacyId) {
      setLoading(true);
      axios
        .get(`https://it-club.uz/mr/get-pharmacy-doctors-list/${pharmacyId}`)
        .then((response) => {
          setDoctors(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch doctors list:", error);
          setLoading(false);
        });
    }
  }, [pharmacyId]);

  const columns = [
    { Header: "Full Name", accessor: "full_name", align: "center" },
    { Header: "Specialty", accessor: "speciality.name", align: "center" },
    { Header: "Medical Organization", accessor: "medical_organization.name", align: "center" },
    { Header: "Category", accessor: "category.name", align: "center" },
  ];

  const data = doctors.map((doctor) => ({
    ...doctor,
    full_name: doctor.full_name,
    "speciality.name": doctor.speciality.name,
    "medical_organization.name": doctor.medical_organization.name,
    "category.name": doctor.category.name,
  }));

  return loading ? (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <CircularProgress />
    </Box>
  ) : doctors.length === 0 ? (
    <Typography variant="body1">Лист пуст</Typography>
  ) : (
    <DataTable
      table={{ columns, rows: data }}
      isSorted={false}
      entriesPerPage={false}
      showTotalEntries={false}
      noEndBorder
    />
  );
};

PharmacyDoctorsListTable.propTypes = {
  pharmacyId: PropTypes.number.isRequired,
};

export default PharmacyDoctorsListTable;
