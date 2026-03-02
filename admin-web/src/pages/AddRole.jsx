import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
  Alert,
} from "@mui/material";
import { addRole, fetchRoleById, updateRole } from "../redux/slices/roleSlice";

const permissionsList = [
  "Student Management",
  "Price Management",
  "Lead Management",
  "Staff Management",
  "Generate Certificate",
];

const AddRole = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roleId } = useParams(); // URL: /roles/add OR /roles/edit/:roleId
  const { roles } = useSelector((state) => state.roles);

  const [formData, setFormData] = useState({
    roleName: "",
    permissions: [],
  });
  const [formError, setFormError] = useState("");

  // Prefill data if editing
  useEffect(() => {
    if (roleId) {
      const role = roles.find((r) => String(r.id) === String(roleId));
      if (role) {
        setFormData({
          roleName: role.role,
          permissions: [
            role.studentManagement && "Student Management",
            role.staffManagement && "Staff Management",
            role.priceManagement && "Price Management",
            role.leadManagement && "Lead Management",
            role.generateCertificate && "Generate Certificate",
          ].filter(Boolean),
        });
      } else {
        // Fetch from API if not in state
        dispatch(fetchRoleById(roleId))
          .unwrap()
          .then((r) => {
            setFormData({
              roleName: r.role,
              permissions: [
                r.studentManagement && "Student Management",
                r.staffManagement && "Staff Management",
                r.priceManagement && "Price Management",
                r.leadManagement && "Lead Management",
                r.generateCertificate && "Generate Certificate",
              ].filter(Boolean),
            });
          })
          .catch(() => setFormError("Failed to fetch role data"));
      }
    }
  }, [roleId, roles, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (perm) => {
    setFormData((prev) => {
      const updated = prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm];
      return { ...prev, permissions: updated };
    });
  };

  const mapPermissionsToPayload = () => ({
    role: formData.roleName,
    studentManagement: formData.permissions.includes("Student Management"),
    staffManagement: formData.permissions.includes("Staff Management"),
    priceManagement: formData.permissions.includes("Price Management"),
    leadManagement: formData.permissions.includes("Lead Management"),
    generateCertificate: formData.permissions.includes("Generate Certificate"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.roleName.trim()) {
      setFormError("Role Name is required");
      return;
    }

    setFormError("");
    const payload = mapPermissionsToPayload();

    try {
      if (roleId) {
        await dispatch(updateRole({ id: roleId, ...payload })).unwrap();
      } else {
        await dispatch(addRole(payload)).unwrap();
      }
      navigate("/roles/list");
    } catch (err) {
      setFormError(err || "Failed to save role");
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        {roleId ? "Edit Role" : "Add New Role"}
      </Typography>

      <Card
        elevation={0}
        sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}
      >
        <CardContent sx={{ p: { xs: 4, sm: 4, md: 5 } }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Role Name"
                  name="roleName"
                  fullWidth
                  value={formData.roleName}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography fontWeight={600} mb={1}>
                  Assign Permissions
                </Typography>
                <FormGroup>
                  <Grid container spacing={1}>
                    {permissionsList.map((perm) => (
                      <Grid item xs={12} sm={6} md={4} key={perm}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.permissions.includes(perm)}
                              onChange={() => handlePermissionChange(perm)}
                            />
                          }
                          label={perm}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: "flex", flexDirection: "row-reverse", gap: 2 }}>
                  <Button type="submit" variant="contained" size="large" fullWidth>
                    SAVE
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    color="error"
                    fullWidth
                    onClick={() => navigate("/roles/list")}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>

          {formError && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {formError}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddRole;