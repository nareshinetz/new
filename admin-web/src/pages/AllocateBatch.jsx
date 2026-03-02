import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Select,
  MenuItem,
  Button,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents } from "../redux/slices/studentSlice";
import { fetchBatches, allocateStudentToBatch } from "../redux/slices/batchSlice";

const AllocateBatch = () => {
  const dispatch = useDispatch();

  const { students } = useSelector((state) => state.students);
  const { batches, loading, error } = useSelector((state) => state.batches);

  const [selectedBatch, setSelectedBatch] = useState({});
  const [success, setSuccess] = useState("");

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchBatches());
  }, [dispatch]);

  const handleAllocate = async (studentId) => {
    const batchId = selectedBatch[studentId];

    if (!batchId) {
      alert("Please select batch");
      return;
    }

    const result = await dispatch(
      allocateStudentToBatch({ studentId, batchId })
    );

    if (allocateStudentToBatch.fulfilled.match(result)) {
      setSuccess("Student allocated successfully");
    }
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Allocate Batch
      </Typography>

      {success && <Alert severity="success">{success}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ p: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Select Batch</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {students?.map((student) => (
              <TableRow key={student.studentId}>
                <TableCell>{student.studentName}</TableCell>
                <TableCell>{student.email}</TableCell>

                <TableCell>
                  <Select
                    fullWidth
                    value={selectedBatch[student.studentId] || ""}
                    onChange={(e) =>
                      setSelectedBatch((prev) => ({
                        ...prev,
                        [student.studentId]: e.target.value,
                      }))
                    }
                  >
                    {batches.map((batch) => (
                      <MenuItem
                        key={batch.batchId}
                        value={batch.batchId}
                      >
                        {batch.batchName}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>

                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() =>
                      handleAllocate(student.studentId)
                    }
                  >
                    Allocate
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default AllocateBatch;