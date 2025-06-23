import { useEffect, useState } from "react";
import { useAuth } from "../context/Authcontext";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";

const DashboardHome = () => {
  const { token } = useAuth();
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const { data } = await axios.get("https://dummyjson.com/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserCount(data.total);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user count");
        setLoading(false);
      }
    };

    fetchUserCount();
  }, [token]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <PeopleIcon sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h6">Total Users</Typography>
                    <Typography variant="h4">{userCount}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default DashboardHome;
