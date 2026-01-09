import React from "react";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/authSlice";

export default function Layout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((s) => s.auth.token);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Todo + Products App
          </Typography>

          <Button component={RouterLink} to="/products" color="inherit">
            Products
          </Button>
          <Button component={RouterLink} to="/todos" color="inherit">
            Todos
          </Button>

          {token ? (
            <Button onClick={handleLogout} color="inherit">
              Logout
            </Button>
          ) : (
            <Button component={RouterLink} to="/login" color="inherit">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container className="app-container">{children}</Container>
    </>
  );
}