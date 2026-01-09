import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// login using dummyjson auth endpoint
export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      // First, check any locally registered users (demo-only, stored in localStorage)
      const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
      const found = localUsers.find(
        (u) => u.username === username && u.password === password
      );
      if (found) {
        // simulate dummyjson response shape
        return {
          accessToken: `local-${Date.now()}`,
          id: found.id,
          username: found.username,
          email: found.email || "",
          firstName: found.firstName || "",
          lastName: found.lastName || "",
        };
      }

      // Fallback to dummyjson auth endpoint for known demo users
      const res = await api.post("/auth/login", { username, password });
      return res.data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Login failed";
      return rejectWithValue(msg);
    }
  }
);

// optional register (dummyjson supports adding users)
export const register = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      // dummyjson /users/add is demo-only and does not provide auth credentials usable by /auth/login
      // To enable register+login in this demo app, persist the new user locally (in localStorage)
      const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
      const newUser = {
        id: Date.now(),
        username: payload.username,
        password: payload.password,
        firstName: payload.firstName || "",
        email: payload.email || "",
      };
      localUsers.push(newUser);
      localStorage.setItem("localUsers", JSON.stringify(localUsers));
      // return the created user object to the caller
      return newUser;
    } catch (err) {
      const msg = err?.response?.data || err.message || "Register failed";
      return rejectWithValue(msg);
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setCredentials(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(login.fulfilled, (s, action) => {
        s.loading = false;
        // dummyjson returns accessToken, id, username, email, firstName, lastName, etc.
        s.token = action.payload?.accessToken || null;
        // Store the entire payload as user (it contains all user info)
        s.user = {
          id: action.payload?.id,
          username: action.payload?.username,
          email: action.payload?.email,
          firstName: action.payload?.firstName,
          lastName: action.payload?.lastName,
        };
        localStorage.setItem("token", s.token || "");
        localStorage.setItem("user", JSON.stringify(s.user || {}));
      })
      .addCase(login.rejected, (s, action) => {
        s.loading = false;
        s.error = action.payload || "Login failed";
      })
      .addCase(register.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(register.fulfilled, (s, action) => {
        s.loading = false;
        // we aren't auto-logging in on register; you can adapt if desired
      })
      .addCase(register.rejected, (s, action) => {
        s.loading = false;
        s.error = action.payload || "Register failed";
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;