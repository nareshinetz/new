import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Button,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import { School as SchoolIcon } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Breadcrumbs, Link } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  addCourse,
  editCourse,
  fetchCourseById,
} from "../redux/slices/courseSlice";


const initialState = {
  courseName: "",
  price: "",
  domainCode : "",
  programType : "",
};

const AddCourse = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedCourse, loading, error } = useSelector(
    (state) => state.courses
  );

  const [formData, setFormData] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);

  /* ================= FETCH COURSE (EDIT MODE) ================= */
  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchCourseById(id));
    }
  }, [dispatch, id, isEditMode]);

  /* ================= PREFILL FORM ================= */
  useEffect(() => {
    if (isEditMode && selectedCourse) {
      setFormData({
        courseName: selectedCourse.courseName || "",
        price: selectedCourse.price || "",
        domainCode : selectedCourse.domainCode || "",
        programType : selectedCourse.programType || "",
      });
    }
  }, [selectedCourse, isEditMode]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price"
          ? Number(value)
          : value,
    }));

    setFormErrors((prev) => ({ ...prev, [name]: false }));
  };

  /* ================= VALIDATION ================= */
 const validateForm = () => {
  const errors = {};

  if (!formData.courseName.trim()) {
    errors.courseName = "Course name is required";
  }

  if (formData.price === "") {
    errors.price = "Course fee is required";
  } else if (isNaN(formData.price)) {
    errors.price = "Fee must be a number";
  } else if (Number(formData.price) <= 0) {
    errors.price = "Fee must be greater than 0";
  }

  setFormErrors(errors);

  console.log("Validation Errors:", errors);

  return Object.keys(errors).length === 0;
};

  /* ================= SUBMIT ================= */
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Submit clicked");

  if (!validateForm()) return;

  const payload = {
    courseName: formData.courseName.trim(),
    price: Number(formData.price),
    domainCode : formData.domainCode,
    programType : formData.programType,
  };

  console.log("Sending payload:", payload);

  try {
    if (isEditMode) {
      await dispatch(editCourse({ id, ...payload })).unwrap();
    } else {
      await dispatch(addCourse(payload)).unwrap();
    }

    console.log("API Success");
    setSuccess(true);

    setTimeout(() => navigate("/courses/list"), 1200);
  } catch (err) {
    console.error("API Error:", err);
  }
};
  /* ================= LOADING ================= */
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  /* ================= SUCCESS ================= */
  if (success) {
    return (
      <Alert severity="success" sx={{ maxWidth: 500, mx: "auto", mt: 6 }}>
        {isEditMode
          ? "Course Updated Successfully!"
          : "Course Added Successfully!"}
      </Alert>
    );
  }

  /* ================= UI ================= */

  return (<>
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>
        {isEditMode ? "Edit Course" : "Add New Course"}
      </Typography>



      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 4, sm: 4, md: 5 } }}>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3} sx={{ width: '100%', maxWidth: '100%' }}>
              {[
                { label: "Course Name", name: "courseName" },
              ].map((field) => (
                <Grid item xs={12} md={4} sx={{ width: '30%' }} key={field.name}>
                  <TextField
                    label={`${field.label} *`}
                    name={field.name}
                    fullWidth
                    value={formData[field.name]}
                    onChange={handleChange}
                    error={formErrors[field.name]}
                  />
                </Grid>
              ))}

              <Grid item xs={12} md={4} sx={{ width: '30%' }}>
                <TextField
                  label="Domain Code"
                  name="domainCode"
                  type="text"
                  fullWidth
                  value={formData.domainCode}
                  onChange={handleChange}
                  error={formErrors.domainCode}
                />
              </Grid>

              <Grid item xs={12} md={4} sx={{ width: '30%' }}>
                <TextField
                  label="Program Type"
                  name="programType"
                  type="text"
                  fullWidth
                  value={formData.programType}
                  onChange={handleChange}
                  error={formErrors.ProgramType}
                />
              </Grid>

              <Grid item xs={12} md={4} sx={{ width: '30%' }}>
                <TextField
                  label="Course Fees *"
                  name="price"
                  type="number"
                  fullWidth
                  value={formData.price}
                  onChange={handleChange}
                  error={formErrors.price}
                />
              </Grid>

              <Grid item xs={12} md={4} sx={{ width: '30%' }}>
                <Box
                  sx={{
                    height: '100%',
                    display: "flex",
                    flexDirection: "row-reverse",
                    gap: 2,
                    justifyContent: "center"
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      boxShadow: "0 8px 24px rgba(25,118,210,0.35)",
                      fontWeight: 700,
                      "&:hover": {
                        boxShadow: "0 12px 32px rgba(25,118,210,0.45)",
                      },
                    }}
                  >
                    {isEditMode ? "Update Course" : "SAVE"}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    color="error"
                    fullWidth
                    onClick={() => navigate("/courses/list")}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      borderWidth: 2,
                      fontWeight: 600,
                      "&:hover": {
                        borderWidth: 2,
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>


          </form>

          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  </>
  );
};

export default AddCourse;



















// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Grid,
//   Button,
//   Alert,
//   CircularProgress,
// } from "@mui/material";
// import { useNavigate, useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   addCourse,
//   editCourse,
//   fetchCourseById,
// } from "../redux/slices/courseSlice";

// const initialState = {
//   courseName: "",
//   courseCode: "",
//   price: "",
// };

// const AddCourse = () => {
//   const { id } = useParams();
//   const isEditMode = Boolean(id);

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { selectedCourse, loading, error } = useSelector(
//     (state) => state.courses
//   );

//   const [formData, setFormData] = useState(initialState);
//   const [formErrors, setFormErrors] = useState({});
//   const [success, setSuccess] = useState(false);

//   /* ================= FETCH COURSE (EDIT MODE) ================= */
//   useEffect(() => {
//     if (isEditMode) {
//       dispatch(fetchCourseById(id));
//     }
//   }, [dispatch, id, isEditMode]);

//   /* ================= PREFILL FORM ================= */
//   useEffect(() => {
//     if (isEditMode && selectedCourse) {
//       setFormData({
//         courseName: selectedCourse.courseName || "",
//         courseCode: selectedCourse.courseCode || "",
//         price: selectedCourse.price || "",
//       });
//     }
//   }, [selectedCourse, isEditMode]);

//   /* ================= HANDLE CHANGE ================= */
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === "price" ? Number(value) : value,
//     }));

//     setFormErrors((prev) => ({ ...prev, [name]: false }));
//   };

//   /* ================= VALIDATION ================= */
//   const validateForm = () => {
//     const errors = {};

//     if (!formData.courseName) errors.courseName = true;
//     if (!formData.courseCode) errors.courseCode = true;
//     if (!formData.price) errors.price = true;

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   /* ================= SUBMIT ================= */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     try {
//       if (isEditMode) {
//         await dispatch(editCourse({ id, ...formData })).unwrap();
//       } else {
//         await dispatch(addCourse(formData)).unwrap();
//       }

//       setSuccess(true);

//       setTimeout(() => {
//         navigate("/courses/list");
//       }, 1200);
//     } catch (err) {
//       console.error("Submission error:", err);
//     }
//   };

//   /* ================= LOADING ================= */
//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" mt={6}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   /* ================= SUCCESS ================= */
//   if (success) {
//     return (
//       <Alert severity="success" sx={{ maxWidth: 500, mx: "auto", mt: 6 }}>
//         {isEditMode
//           ? "Course Updated Successfully!"
//           : "Course Added Successfully!"}
//       </Alert>
//     );
//   }

//   /* ================= UI ================= */
//   return (
//     <Box>
//       <Typography variant="h5" fontWeight={700} mb={3}>
//         {isEditMode ? "Edit Course" : "Add New Course"}
//       </Typography>

//       <Card sx={{ borderRadius: 3 }}>
//         <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
//           <form onSubmit={handleSubmit}>
//             <Grid container spacing={3}>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   label="Course Name *"
//                   name="courseName"
//                   fullWidth
//                   value={formData.courseName}
//                   onChange={handleChange}
//                   error={formErrors.courseName}
//                 />
//               </Grid>

//               {/* <Grid item xs={12} md={4}>
//                 <TextField
//                   label="Course Code *"
//                   name="courseCode"
//                   fullWidth
//                   value={formData.courseCode}
//                   onChange={handleChange}
//                   error={formErrors.courseCode}
//                 />
//               </Grid> */}

//               <Grid item xs={12} md={4}>
//                 <TextField
//                   label="Course Fees *"
//                   name="price"
//                   type="number"
//                   fullWidth
//                   value={formData.price}
//                   onChange={handleChange}
//                   error={formErrors.price}
//                 />
//               </Grid>

//               <Grid item xs={12} md={4}>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     gap: 2,
//                   }}
//                 >
//                   {/* <Button
//                     type="submit"
//                     variant="contained"
//                     fullWidth
//                     sx={{ borderRadius: 2, fontWeight: 700 }}
//                   >
//                     {isEditMode ? "Update Course" : "Save"}
//                   </Button>

//                   <Button
//                     variant="outlined"
//                     color="error"
//                     fullWidth
//                     onClick={() => navigate("/courses/list")}
//                     sx={{ borderRadius: 2 }}
//                   >
//                     Cancel
//                   </Button> */}



//                    <Button
//                     type="submit"
//                     variant="contained"
//                     size="large"
//                     fullWidth
//                     sx={{
//                       borderRadius: 2,
//                       py: 1.5,
//                       boxShadow: "0 8px 24px rgba(25,118,210,0.35)",
//                       fontWeight: 700,
//                       "&:hover": {
//                         boxShadow: "0 12px 32px rgba(25,118,210,0.45)",
//                       },
//                     }}
//                   >
//                     {isEditMode ? "Update Course" : "SAVE"}
//                   </Button>
//                   <Button
//                     variant="outlined"
//                     size="large"
//                     color="error"
//                     fullWidth
//                     onClick={() => navigate("/courses/list")}
//                     sx={{
//                       borderRadius: 2,
//                       py: 1.5,
//                       borderWidth: 2,
//                       fontWeight: 600,
//                       "&:hover": {
//                         borderWidth: 2,
//                       },
//                     }}
//                   >
//                     Cancel
//                   </Button>
//                 </Box>
//               </Grid>
//             </Grid>
//           </form>

//           {error && (
//             <Alert severity="error" sx={{ mt: 3 }}>
//               {error}
//             </Alert>
//           )}
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default AddCourse;