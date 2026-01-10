import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// login using dummyjson auth endpoint - API-first (recommended)
export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      // Try authenticating against DummyJSON first
      const res = await api.post("/auth/login", { username, password });
      return res.data;
    } catch (err) {
      // If API fails with a client error (e.g. invalid credentials), fall back to locally-registered demo users
      const status = err?.response?.status;
      if (status && status < 500) {
        const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
        const found = localUsers.find(
          (u) => u.username === username && u.password === password
        );
        if (found) {
          return {
            accessToken: `local-${Date.now()}`,
            id: found.id,
            username: found.username,
            email: found.email || "",
            firstName: found.firstName || "",
            lastName: found.lastName || "",
          };
        }
      }

      // Otherwise prefer API-provided error details when available
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.statusText ||
        err.message ||
        "Login failed";
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
        // DummyJSON may return either 'accessToken' or 'token' depending on the endpoint/version.
        s.token = action.payload?.accessToken || action.payload?.token || null;
        s.user = {
          id: action.payload?.id,
          username: action.payload?.username,
          email: action.payload?.email,
          firstName: action.payload?.firstName,
          lastName: action.payload?.lastName,
        };
        if (s.token) {
          localStorage.setItem("token", s.token);
        } else {
          localStorage.removeItem("token");
        }
        if (s.user && s.user.username) {
          localStorage.setItem("user", JSON.stringify(s.user));
        } else {
          localStorage.removeItem("user");
        }
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