import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
} from "@mui/material";

export default function Register() {
  const dispatch = useDispatch();
  const auth = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      firstName,
      username,
      password,
    };
    const result = await dispatch(register(payload));
    if (result.type === "auth/register/fulfilled") {
      navigate("/login");
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 480, margin: "40px auto" }}>
      <Typography variant="h5" gutterBottom>
        Register (dummy)
      </Typography>

      <Stack spacing={2} component="form" onSubmit={handleSubmit}>
        {auth.error && <Alert severity="error">{auth.error}</Alert>}

        <TextField
          label="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button variant="contained" type="submit" disabled={auth.loading}>
          {auth.loading ? "Registering..." : "Register"}
        </Button>

        <Typography variant="body2">
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </Stack>
    </Paper>
  );
}