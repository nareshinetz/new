import React, { useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CommonAgGrid from "../generic/AgGridTable";
import { fetchBatches, deleteBatch } from "../redux/slices/batchSlice";

const selectBatchData = (state) => state.batches;

const BatchList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { batches, loading, error } = useSelector(selectBatchData);

  useEffect(() => {
    dispatch(fetchBatches());
  }, [dispatch]);

  const handleView = useCallback(
      (id) => navigate(`/batch/view/${id}`),
      [navigate]
    );

  const handleEdit = useCallback(
    (id) => {
      navigate(`/batch/edit/${id}`);
    },
    [navigate]
  );

  const handleDelete = useCallback(
    (id) => {
      if (window.confirm("Are you sure you want to delete this batch?")) {
        dispatch(deleteBatch(id));
      }
    },
    [dispatch]
  );

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Batch ID",
        field: "batchId",
        cellRenderer: (params) => (
          <Link
            component="button"
            underline="none"
            sx={{
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              textDecorationThickness: "1.5px",
              fontWeight: 500,
            }}
            onClick={() => handleView(params.value)}
          >
            {params.value}
          </Link>
        ),
      },
      {
        headerName: "Room",
        field: "roomNumber",
      },
      {
        headerName: "Start Time",
        field: "startTime",
      },
      {
        headerName: "End Time",
        field: "endTime",
      },
      {
        headerName: "Status",
        field: "status",
      },
        {
      headerName: "Students",
      width: 150,
      cellRenderer: (params) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() =>
            navigate(`/batches/${params.data.batchId}/students`)
          }
        >
          View
        </Button>
      ),
    },
      {
        headerName: "Actions",
        width: 140,
        cellRenderer: (params) => (
          <Box display="flex" gap={1}>
            <IconButton
              size="small"
              color="primary"
             onClick={() => handleEdit(params.data.batchId)}
            >
              <EditIcon />
            </IconButton>

            <IconButton
              size="small"
              color="error"
             onClick={() => handleDelete(params.data.batchId)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ),
      },
    ],
    [handleEdit, handleDelete]
  );

  if (loading && batches.length === 0) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && batches.length === 0) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button
              variant="contained"
              onClick={() => navigate("/batch/add")}
            >
              Add Batch
            </Button>
          </Box>

          <CommonAgGrid
            rowData={batches}
            columnDefs={columnDefs}
            loadingMessage="Fetching batches..."
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default BatchList;