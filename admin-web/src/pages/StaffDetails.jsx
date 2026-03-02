import React, { useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchStaff } from "../redux/slices/staffSlice";

const StaffDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { staff, loading } = useSelector((state) => state.staff);

  useEffect(() => {
    if (!staff.length) {
      dispatch(fetchStaff());
    }
  }, [dispatch, staff.length]);

  const staffMember = staff.find((s) => String(s.id) === id);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!staffMember) {
    return (
      <Typography align="center" sx={{ mt: 5 }}>
        Staff not found
      </Typography>
    );
  }

  const InfoItem = ({ label, value }) => (
    <Stack spacing={0.5}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography fontWeight={600}>{value || "-"}</Typography>
    </Stack>
  );

  return (
    <Box sx={{ mb: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" fontWeight={700} mb={3}>
            Staff Details
          </Typography>

          {/* Personal Info */}
          <Typography fontWeight={700} mb={1}>
            Personal Information
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <InfoItem label="Staff Name" value={staffMember.staffName} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InfoItem label="Email ID" value={staffMember.emailId} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InfoItem label="Phone Number" value={staffMember.phoneNumber} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InfoItem label="City" value={staffMember.cityName} />
            </Grid>
          </Grid>

          {/* Professional Info */}
          <Typography fontWeight={700} mt={5} mb={1}>
            Professional Information
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <InfoItem label="Degree" value={staffMember.degree} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InfoItem label="Role" value={staffMember.roleName} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InfoItem label="Skills" value={staffMember.skills} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InfoItem label="Joining Date" value={staffMember.joiningDate} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InfoItem label="Salary" value={`₹${staffMember.salary}`} />
            </Grid>
          </Grid>

          {/* Documents & Certification */}
          <Typography fontWeight={700} mt={5} mb={1}>
            Documents & Certification
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <InfoItem label="Adhar Card" value={staffMember.adharCard} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InfoItem label="PAN Card" value={staffMember.panCard} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InfoItem
                label="Original Certification"
                value={staffMember.originalCertification}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StaffDetails;