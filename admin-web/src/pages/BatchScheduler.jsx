import React, { useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Chip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchBatches } from "../redux/slices/batchSlice";

const BatchScheduler = () => {
  const dispatch = useDispatch();
  const { batches, loading, error } = useSelector((state) => state.batches);

  useEffect(() => {
    dispatch(fetchBatches());
  }, [dispatch]);

  // Group batches by dayOfWeek
  const groupedByDay = batches.reduce((acc, batch) => {
    const day = batch.dayOfWeek || "";
    if (!acc[day]) acc[day] = [];
    acc[day].push(batch);
    return acc;
  }, {});

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Weekly Batch Timetable
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : Object.keys(groupedByDay).length === 0 ? (
        <Typography>No batches scheduled</Typography>
      ) : (
        Object.keys(groupedByDay).map((day) => (
          <Card key={day} sx={{ mb: 3, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                {day}
              </Typography>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Room</TableCell>
                    <TableCell>Batch</TableCell>
                    <TableCell>Course</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedByDay[day].map((batch) => (
                    <TableRow key={batch.batchId}>
                      <TableCell>
                        {batch.startTime} - {batch.endTime}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={batch.roomNumber || "N/A"}
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{batch.batchName}</TableCell>
                      <TableCell>{batch.course?.courseName || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default BatchScheduler;