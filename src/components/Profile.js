import { useState, useEffect } from "react";
import { useAuth } from "../context/Authcontext";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import * as yup from "yup";
import { useFormik } from "formik";

const validationSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  address: yup.object({
    address: yup.string().required("Address is required"),
    city: yup.string().required("City is required"),
  }),
  gender: yup.string().required("Gender is required"),
});

const Profile = () => {
  const { user, token } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: {
        address: user?.address?.address || "",
        city: user?.address?.city || "",
      },
      gender: user?.gender || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const { data } = await axios.put(
          `https://dummyjson.com/users/${user.id}`,
          values,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSuccess(true);
        setEditMode(false);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
        setError(err.response?.data?.message || "Update failed");
      }
    },
    enableReinitialize: true,
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Profile updated successfully!
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Avatar
          alt={`${user?.firstName} ${user?.lastName}`}
          src={user?.image}
          sx={{ width: 120, height: 120 }}
        />
      </Box>
      {!editMode ? (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body1">{user?.email}</Typography>
            <Typography variant="body1">{user?.phone}</Typography>
            <Typography variant="body1">
              {user?.address?.address}, {user?.address?.city}
            </Typography>
            <Typography variant="body1">Gender: {user?.gender}</Typography>
          </Box>
          <Button variant="contained" onClick={() => setEditMode(true)}>
            Edit Profile
          </Button>
        </>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="firstName"
                name="firstName"
                label="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={
                  formik.touched.firstName && Boolean(formik.errors.firstName)
                }
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="lastName"
                name="lastName"
                label="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={
                  formik.touched.lastName && Boolean(formik.errors.lastName)
                }
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="address.address"
                name="address.address"
                label="Address"
                value={formik.values.address.address}
                onChange={formik.handleChange}
                error={
                  formik.touched.address?.address &&
                  Boolean(formik.errors.address?.address)
                }
                helperText={
                  formik.touched.address?.address &&
                  formik.errors.address?.address
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="address.city"
                name="address.city"
                label="City"
                value={formik.values.address.city}
                onChange={formik.handleChange}
                error={
                  formik.touched.address?.city &&
                  Boolean(formik.errors.address?.city)
                }
                helperText={
                  formik.touched.address?.city && formik.errors.address?.city
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  id="gender"
                  name="gender"
                  value={formik.values.gender}
                  label="Gender"
                  onChange={formik.handleChange}
                  error={formik.touched.gender && Boolean(formik.errors.gender)}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button type="submit" variant="contained">
                  Save
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditMode(false);
                    formik.resetForm();
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </Box>
  );
};

export default Profile;
