import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
} from "@mui/material";

export default function Login() {
  const dispatch = useDispatch();
  const auth = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({ username, password }));
    if (result.type === "auth/login/fulfilled") {
      navigate("/products");
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 480, margin: "40px auto" }}>
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>

      <Stack spacing={2} component="form" onSubmit={handleSubmit}>
        {auth.error && <Alert severity="error">{auth.error}</Alert>}

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
          {auth.loading ? "Logging in..." : "Login"}
        </Button>

        <Typography variant="body2">
          Don't have an account? <Link to="/register">Register</Link>
        </Typography>

        <Alert severity="info">
          <strong>Demo credentials (login directly, registration not required):</strong>
          <br />
          ? emilys / emilyspass
          <br />
          <br />
          <strong>How registration works:</strong>
          <br />
          Registration in this app is demo-only and stored locally in your browser (localStorage). The app attempts API authentication first and will fall back to any locally-stored account only if the API does not recognize the credentials.
        </Alert>
      </Stack>
    </Paper>
  );
}