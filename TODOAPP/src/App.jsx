import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";

import Login from ".././src/components/pages/Login";
import Register from "./components/pages/Register";
import Products from "./components/pages/Products";
import Todos from "./components/pages/Todos";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/products"
          element={
            <RequireAuth>
              <Products />
            </RequireAuth>
          }
        />

        <Route
          path="/todos"
          element={
            <RequireAuth>
              <Todos />
            </RequireAuth>
          }
        />

        <Route path="*" element={<div>Not found</div>} />
      </Routes>
    </Layout>
  );
}