import React, { useEffect, useState } from "react";
import {
  Box, Card, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Chip, TextField, Button, Stack, Skeleton, Alert,
  IconButton, Tooltip, Divider, Paper,
} from "@mui/material";
import {
  CalendarToday, FilterAlt, RefreshRounded, AccessTime,
  MeetingRoom, EventNote, ChevronRight,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchBatches, fetchBatchesByDate } from "../redux/slices/batchSlice";

const DAY_ORDER = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday","Other"];

const DAY_COLORS = {
  Monday:    { bg: "#EEF2FF", accent: "#4F46E5", text: "#3730A3" },
  Tuesday:   { bg: "#F0FDF4", accent: "#16A34A", text: "#15803D" },
  Wednesday: { bg: "#FFF7ED", accent: "#EA580C", text: "#C2410C" },
  Thursday:  { bg: "#FDF4FF", accent: "#9333EA", text: "#7E22CE" },
  Friday:    { bg: "#FFF1F2", accent: "#E11D48", text: "#BE123C" },
  Saturday:  { bg: "#F0F9FF", accent: "#0284C7", text: "#0369A1" },
  Sunday:    { bg: "#FFFBEB", accent: "#D97706", text: "#B45309" },
  Other:     { bg: "#F8FAFC", accent: "#64748B", text: "#475569" },
};

const SkeletonTable = () => (
  <Card elevation={0} sx={{ mb: 3, border: "1px solid", borderColor: "grey.100", borderRadius: "16px", overflow: "hidden" }}>
    <Box sx={{ px: 3, py: 2.5, display: "flex", alignItems: "center", gap: 1.5 }}>
      <Skeleton variant="circular" width={10} height={10} />
      <Skeleton variant="text" width={120} height={24} />
    </Box>
    <Divider />
    {[1, 2, 3].map((i) => (
      <Box key={i} sx={{ px: 3, py: 2, display: "flex", gap: 4, borderBottom: i < 3 ? "1px solid" : "none", borderColor: "grey.100" }}>
        <Skeleton variant="text" width={180} />
        <Skeleton variant="rounded" width={60} height={24} />
        <Skeleton variant="text" width={120} />
      </Box>
    ))}
  </Card>
);

const BatchScheduler = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { batches, loading, error } = useSelector((state) => state.batches);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => { dispatch(fetchBatches()); }, [dispatch]);

  const groupedByDay = batches.reduce((acc, batch) => {
    const day = batch.dayOfWeek || "Other";
    if (!acc[day]) acc[day] = [];
    acc[day].push(batch);
    return acc;
  }, {});

  const sortedDays = DAY_ORDER.filter((d) => groupedByDay[d]);
  const totalBatches = batches.length;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F8FAFC" }}>
      <Box sx={{ maxWidth: 980, mx: "auto", px: { xs: 2, sm: 4 }, py: { xs: 3, sm: 5 } }}>

        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4, flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: "#1E293B", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <EventNote sx={{ color: "#fff", fontSize: 18 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#0F172A", letterSpacing: "-0.5px", fontSize: "1.45rem" }}>
                Weekly Batch Timetable
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#94A3B8", ml: "52px" }}>
              {totalBatches > 0
                ? `${totalBatches} batch${totalBatches !== 1 ? "es" : ""} across ${sortedDays.length} day${sortedDays.length !== 1 ? "s" : ""}`
                : "No batches loaded"}
            </Typography>
          </Box>
          {sortedDays.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {sortedDays.map((day) => {
                const c = DAY_COLORS[day] || DAY_COLORS["Other"];
                return (
                  <Chip key={day} label={`${day.slice(0,3)} · ${groupedByDay[day].length}`} size="small"
                    sx={{ bgcolor: c.bg, color: c.text, fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.3px", border: "none", height: 26 }} />
                );
              })}
            </Stack>
          )}
        </Box>

        {/* Filter Bar */}
        <Paper elevation={0} sx={{ display: "flex", alignItems: "center", gap: 2, px: 2.5, py: 2, mb: 4, border: "1px solid", borderColor: "grey.200", borderRadius: "14px", bgcolor: "#fff", flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#64748B" }}>
            <CalendarToday sx={{ fontSize: 16 }} />
            <Typography variant="body2" fontWeight={500} sx={{ color: "#64748B" }}>Filter by date</Typography>
          </Box>
          <TextField type="date" size="small" InputLabelProps={{ shrink: true }} value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: "0.875rem", bgcolor: "#F8FAFC",
              "& fieldset": { borderColor: "#E2E8F0" }, "&:hover fieldset": { borderColor: "#94A3B8" },
              "&.Mui-focused fieldset": { borderColor: "#1E293B", borderWidth: 1.5 } } }} />
          <Button variant="contained" size="small" startIcon={<FilterAlt sx={{ fontSize: 15 }} />}
            onClick={() => dispatch(fetchBatchesByDate(selectedDate))} disabled={!selectedDate}
            sx={{ bgcolor: "#1E293B", color: "#fff", borderRadius: "10px", textTransform: "none", fontWeight: 600, fontSize: "0.82rem",
              px: 2.5, boxShadow: "none", "&:hover": { bgcolor: "#0F172A", boxShadow: "none" }, "&.Mui-disabled": { bgcolor: "#E2E8F0", color: "#94A3B8" } }}>
            Apply Filter
          </Button>
          <Tooltip title="Reset to all batches">
            <IconButton size="small" onClick={() => { setSelectedDate(""); dispatch(fetchBatches()); }}
              sx={{ border: "1px solid #E2E8F0", borderRadius: "10px", color: "#64748B", "&:hover": { bgcolor: "#F1F5F9", color: "#1E293B" } }}>
              <RefreshRounded sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>
        </Paper>

        {loading && <><SkeletonTable /><SkeletonTable /></>}

        {error && <Alert severity="error" sx={{ borderRadius: "12px", mb: 3, fontSize: "0.875rem" }}>{error}</Alert>}

        {!loading && !error && sortedDays.length === 0 && (
          <Box sx={{ textAlign: "center", py: 10, px: 4, border: "1.5px dashed", borderColor: "grey.200", borderRadius: "16px", bgcolor: "#fff" }}>
            <EventNote sx={{ fontSize: 44, color: "#CBD5E1", mb: 2 }} />
            <Typography variant="h6" fontWeight={600} color="#475569" gutterBottom>No batches scheduled</Typography>
            <Typography variant="body2" color="#94A3B8">There are no batches for the selected period. Try resetting the filter.</Typography>
          </Box>
        )}

        {!loading && !error && sortedDays.map((day) => {
          const c = DAY_COLORS[day] || DAY_COLORS["Other"];
          const dayBatches = groupedByDay[day];
          return (
            <Card key={day} elevation={0} sx={{ mb: 3, border: "1px solid", borderColor: "grey.100", borderRadius: "16px", overflow: "hidden", transition: "box-shadow 0.2s ease", "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.06)" } }}>
              {/* Day Header */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, py: 2, bgcolor: c.bg, borderBottom: "1px solid", borderColor: "grey.100" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: c.accent }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: c.text, letterSpacing: "-0.2px", fontSize: "0.95rem" }}>{day}</Typography>
                </Box>
                <Chip label={`${dayBatches.length} batch${dayBatches.length !== 1 ? "es" : ""}`} size="small"
                  sx={{ bgcolor: "rgba(255,255,255,0.7)", color: c.text, fontWeight: 600, fontSize: "0.7rem", height: 22, border: `1px solid ${c.accent}33` }} />
              </Box>

              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#FAFAFA" }}>
                    {[
                      { icon: <EventNote sx={{ fontSize: 13 }} />, label: "Batch Name" },
                      { icon: <MeetingRoom sx={{ fontSize: 13 }} />, label: "Room" },
                      { icon: <AccessTime sx={{ fontSize: 13 }} />, label: "Time Slot" },
                      { label: "" },
                    ].map(({ icon, label }, i) => (
                      <TableCell key={i} sx={{ py: 1.2, px: 3, borderBottom: "1px solid #F1F5F9", color: "#94A3B8", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px" }}>
                        {label && <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>{icon}{label}</Box>}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dayBatches.map((batch) => (
                    <TableRow key={batch.batchId} onClick={() => navigate(`/batch/view/${batch.batchId}`)}
                      sx={{ cursor: "pointer", "&:last-child td": { borderBottom: "none" }, "&:hover": { bgcolor: "#F8FAFC" }, transition: "background 0.15s" }}>
                      <TableCell sx={{ px: 3, py: 2, borderColor: "#F1F5F9" }}>
                        <Typography sx={{ fontWeight: 600, color: "#1E293B", fontSize: "0.875rem" }}>{batch.batchName}</Typography>
                      </TableCell>
                      <TableCell sx={{ px: 3, py: 2, borderColor: "#F1F5F9" }}>
                        <Chip label={batch.roomNumber || "N/A"} size="small"
                          sx={{ bgcolor: batch.roomNumber ? "#EFF6FF" : "#F8FAFC", color: batch.roomNumber ? "#1D4ED8" : "#94A3B8",
                            fontWeight: 600, fontSize: "0.75rem", height: 24, border: batch.roomNumber ? "1px solid #BFDBFE" : "1px solid #E2E8F0", borderRadius: "8px" }} />
                      </TableCell>
                      <TableCell sx={{ px: 3, py: 2, borderColor: "#F1F5F9" }}>
                        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.6, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "8px", px: 1.2, py: 0.4 }}>
                          <AccessTime sx={{ fontSize: 12, color: "#94A3B8" }} />
                          <Typography sx={{ fontSize: "0.8rem", fontWeight: 500, color: "#475569", fontVariantNumeric: "tabular-nums" }}>
                            {batch.startTime} – {batch.endTime}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ px: 2.5, py: 2, borderColor: "#F1F5F9", width: 40 }}>
                        <ChevronRight sx={{ fontSize: 18, color: "#CBD5E1" }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default BatchScheduler;