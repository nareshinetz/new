import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createBatch,
  updateBatch,
  fetchBatchById,
  clearSelectedBatch,
} from "../redux/slices/batchSlice";
import { fetchStaff } from "../redux/slices/staffSlice";

const AddBatch = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams(); // ✅ for edit

  const { selectedBatch, loading, error } = useSelector(
    (state) => state.batches
  );

  const { staff, loading: staffLoading } = useSelector(
    (state) => state.staff
  );

  const [formData, setFormData] = useState({
    batchName: "",
    roomNumber: "",
    startDate: "",
    endDate : "",
    startTime: "",
    endTime: "",
    status: "ACTIVE",
    staffIds: [],
  });

  const [localError, setLocalError] = useState("");

  /* ==========================================
     FETCH STAFF + FETCH BATCH (IF EDIT)
  ========================================== */

  useEffect(() => {
    dispatch(fetchStaff());

    if (id) {
      dispatch(fetchBatchById(id));
    }

    return () => {
      dispatch(clearSelectedBatch());
    };
  }, [dispatch, id]);

  /* ==========================================
     AUTO FILL FORM WHEN EDIT
  ========================================== */

  useEffect(() => {
    if (id && selectedBatch) {
      setFormData({
        batchName: selectedBatch.batchName || "",
        roomNumber: selectedBatch.roomNumber || "",
        startDate: selectedBatch.startDate || "",
        endDate: selectedBatch.endDate || "",    
        startTime: selectedBatch.startTime?.slice(0, 5) || "",
        endTime: selectedBatch.endTime?.slice(0, 5) || "",
        status: selectedBatch.status || "ACTIVE",
        staffIds:
          selectedBatch.staffs?.map((s) => Number(s.id)) || [],
      });
    }
  }, [selectedBatch, id]);

  /* ==========================================
     HANDLE CHANGE
  ========================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ==========================================
     SUBMIT
  ========================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.batchName ||
      !formData.roomNumber ||
      !formData.startTime ||
      !formData.endTime
    ) {
      setLocalError("All fields are required");
      return;
    }

    let result;

    if (id) {
      result = await dispatch(
        updateBatch({ id, data: formData })
      );
    } else {
      result = await dispatch(createBatch(formData));
    }

    if (
      createBatch.fulfilled.match(result) ||
      updateBatch.fulfilled.match(result)
    ) {
      navigate("/batch/list");
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} mb={3}>
        {id ? "Edit Batch" : "Add New Batch"}
      </Typography>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3} >
              
              {/* Batch Name */}
              <Grid item xs={12} md={4} sx={{ width: '30%' }}> 
                <TextField
                  label="Batch Name"
                  name="batchName"
                  fullWidth
                  value={formData.batchName}
                  onChange={handleChange}
                />
              </Grid>

              {/* Room Number */}
              <Grid item xs={12} md={4} sx={{ width: '30%' }}>
                <TextField
                  label="Room Number"
                  name="roomNumber"
                  fullWidth
                  value={formData.roomNumber}
                  onChange={handleChange}
                />
              </Grid>

              {/* Start Date */}
              <Grid item xs={12} md={4} sx={{ width: '30%' }}>
                <TextField
                  type="date"
                  label="Start Date"
                  name="startDate"
                  fullWidth
                  value={formData.startDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* End Date */}
              <Grid item xs={12} md={4} sx={{ width: '30%' }}>
                <TextField
                  type="date"
                  label="endDate"
                  name="endDate"
                  fullWidth
                  value={formData.endDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Start Time */}
              <Grid item xs={12} md={4} sx={{ width: '30%' }}>
                <TextField
                  type="time"
                  label="Start Time"
                  name="startTime"
                  fullWidth
                  value={formData.startTime}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* End Time */}
              <Grid item xs={12} md={4} sx={{ width: '30%' }}>
                <TextField
                  type="time"
                  label="End Time"
                  name="endTime"
                  fullWidth
                  value={formData.endTime}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Status */}
              <Grid item xs={12} md={4} sx={{ width: '30%' }}>
                <TextField
                  select
                  label="Status"
                  name="status"
                  fullWidth
                  value={formData.status}
                  onChange={handleChange}
                >
                  <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                  <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                </TextField>
              </Grid>

              {/* Staff */}
              <Grid item xs={12} md={4} sx={{ width: '30%' }}>
                <TextField
                  select
                  label="Assign Staff"
                  fullWidth
                  value={formData.staffIds}
                  SelectProps={{
                    multiple: true,
                    renderValue: (selected) =>
                      staff
                        ?.filter((s) =>
                          selected.includes(s.id)
                        )
                        .map((s) => s.staffName)
                        .join(", "),
                  }}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      staffIds: e.target.value.map(Number),
                    }))
                  }
                >
                  {staffLoading ? (
                    <MenuItem disabled>
                      Loading...
                    </MenuItem>
                  ) : (
                    staff?.map((s) => (
                      <MenuItem
                        key={s.id}
                        value={s.id}
                      >
                        {s.staffName}
                      </MenuItem>
                    ))
                  )}
                </TextField>
              </Grid>

              {/* Error */}
              {localError && (
                <Grid item xs={12}>
                  <Alert severity="error">
                    {localError}
                  </Alert>
                </Grid>
              )}

              {/* Buttons */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                >
                  {id ? "Update Batch" : "Save Batch"}
                </Button>
              </Grid>

            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddBatch;