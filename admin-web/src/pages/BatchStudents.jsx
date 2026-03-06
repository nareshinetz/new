import React, { useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Link,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentsByBatch } from "../redux/slices/batchSlice";
import { useParams, useNavigate } from "react-router-dom";
import AgGridTable from "../generic/AgGridTable";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BatchStudents = () => {
  const { id } = useParams(); // batchId
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { batchStudents, loading } = useSelector((state) => state.batches);

  useEffect(() => {
    dispatch(fetchStudentsByBatch(id));
  }, [dispatch, id]);

  const handleView = (studentId) => {
    navigate(`/students/view/${studentId}`);
  };

  const columns = useMemo(
    () => [
      {
        headerName: "Student ID",
        field: "id",
        cellRenderer: (params) => (
          <Link
            component="button"
            underline="none"
            sx={{
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              fontWeight: 500,
            }}
            onClick={() => handleView(params.value)}
          >
            {params.value}
          </Link>
        ),
      },

      {
        headerName: "Name",
        field: "studentName",
        sortable: true,
        filter: true,
      },

      {
        headerName: "Email",
        field: "emailId",
        filter: true,
      },

      {
        headerName: "Phone",
        field: "phoneNumber",
      },

      {
        headerName: "Program",
        field: "programType",
        filter: true,
      },

      {
        headerName: "Total Fees",
        field: "studentFees.totalFees",
      },

      {
        headerName: "Paid Fees",
        field: "studentFees.paidAmount",
      },

      {
        headerName: "Status",
        field: "studentFees.status",
      },
    ],
    []
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>

        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>

          <Typography variant="h5" fontWeight="bold">
            Batch Students
          </Typography>
        </Box>

        <AgGridTable
          rowData={batchStudents || []}
          columnDefs={columns}
          loadingMessage="Fetching batch students..."
        />

        {batchStudents?.length === 0 && (
          <Typography align="center" mt={3} color="text.secondary">
            No students allocated to this batch
          </Typography>
        )}

      </CardContent>
    </Card>
  );
};

export default BatchStudents;