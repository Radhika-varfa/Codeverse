import { useState, useEffect } from "react";
import { useAuth } from "../context/Authcontext";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import UserForm from "./UserForm";

const Users = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalUsers, setTotalUsers] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(
          `https://dummyjson.com/users?limit=${rowsPerPage}&skip=${
            page * rowsPerPage
          }`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(data.users);
        console.log(data.users);
        setTotalUsers(data.total);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setOpenForm(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialog(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://dummyjson.com/users/${userToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user.id !== userToDelete.id));
      setTotalUsers(totalUsers - 1);
      setSuccess("User deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    } finally {
      setDeleteDialog(false);
      setUserToDelete(null);
    }
  };

  const handleFormSubmit = async (userData) => {
    try {
      if (currentUser) {
        const { data } = await axios.put(
          `https://dummyjson.com/users/${currentUser.id}`,
          userData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(users.map((user) => (user.id === data.id ? data : user)));
        setSuccess("User updated successfully");
      } else {
        // Add new user
        const { data } = await axios.post(
          "https://dummyjson.com/users/add",
          userData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers([data, ...users]);
        setTotalUsers(totalUsers + 1);
        setSuccess("User added successfully");
      }
      setTimeout(() => setSuccess(""), 3000);
      setOpenForm(false);
      setCurrentUser(null);
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4">User List</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setCurrentUser(null);
            setOpenForm(true);
          }}
        >
          Add User
        </Button>
      </Box>
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(user)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteClick(user)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalUsers}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
      <UserForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setCurrentUser(null);
        }}
        onSubmit={handleFormSubmit}
        user={currentUser}
      />
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {userToDelete?.firstName}{" "}
          {userToDelete?.lastName}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
