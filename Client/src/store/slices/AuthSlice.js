
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, register, getCurrentUser, googleAuth } from "../../API/AuthApi.js";



// התחברות
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (loginData, thunkAPI) => {
    try {
      const data = await login(loginData);
     
      if (loginData?.role === "admin" && data.user.role !== "admin") 
        {
        localStorage.removeItem("token");
        return thunkAPI.rejectWithValue("אין הרשאה להתחבר כמנהל");
        }

      if (data && data.token) {
        localStorage.setItem("token", data.token);
      }

      return data; 
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.response?.data?.error || "Login failed"
      );
    }
  }
);

// התחברות/הרשמה עם גוגל (מתחברת לחשבון קיים או יוצרת חשבון חדש אוטומטית)
export const continueWithGoogle = createAsyncThunk(
  "auth/continueWithGoogle",
  async ({ credential, mode }, thunkAPI) => {
    try {
      const data = await googleAuth(credential, mode);

      if (data && data.token) {
        localStorage.setItem("token", data.token);
      }

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.response?.data?.error || "Google login failed"
      );
    }
  }
);

// הרשמה
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (registerData, thunkAPI) => {
    try {
      const data = await register(registerData);

      if (data && data.token) {
        localStorage.setItem("token", data.token);
      }

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.response?.data?.error || "Register failed"
      );
    }
  }
);
// REFRESH
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return thunkAPI.rejectWithValue("No token");
      }

      const data = await getCurrentUser();

      return data;
    } catch (err) {
      localStorage.removeItem("token");

      return thunkAPI.rejectWithValue(
        err.response?.data?.message ||
        "Session expired"
      );
    }
  }
);
const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  success: false,
  error: null,
  authInitialized: false,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.success = false;
      state.error = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload?.user || action.payload;
        state.token = action.payload?.token;
        state.authInitialized = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.authInitialized = true;

        // אם כבר אין טוקן שמור (למשל ניסיון כושל להתחבר כמנהל) —
        // מנקים גם את ה-state, כדי שלא יישאר "מחובר" בלי טוקן אמיתי
        if (!localStorage.getItem("token")) {
          state.user = null;
          state.token = null;
        }
      })
      // GOOGLE AUTH
      .addCase(continueWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(continueWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload?.user || action.payload;
        state.token = action.payload?.token;
        state.authInitialized = true;
      })
      .addCase(continueWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.authInitialized = true;
      })
    // REFRESH
    .addCase(fetchCurrentUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })

    .addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = localStorage.getItem("token");
      state.authInitialized = true;
    })

    .addCase(fetchCurrentUser.rejected, (state) => {
      state.loading = false;
      state.user = null;
      state.token = null;
      state.authInitialized = true
    })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload?.user || action.payload;
        state.token = action.payload?.token;
        state.authInitialized = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.authInitialized = true;
      });
  },
});

export const { logout } = AuthSlice.actions;
export default AuthSlice.reducer;
