// import { supabase } from "@/lib/supabseClient";
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// //  Async Thunk for Anonymous Sign-In
// export const signInAnonymously = createAsyncThunk(
//   "auth/signInAnonymously",
//   async (_, { rejectWithValue }) => {
//     try {
//       // Check if a session already exists
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();

//       if (session?.user) {
//         console.log("Anonymous user already exists:", session.user);
//         return session.user; // Return existing user
//       }

//       // No existing session, create a new anonymous user
//       const { data, error } = await supabase.auth.signInAnonymously();

//       if (error) throw error;

//       console.log("New anonymous user created:", data.user);
//       return data.user; // Return newly created user
//     } catch (error) {
//       console.error("Error signing in anonymously:", error.message);
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // ✅ Redux Slice
// export const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     user: null,
//     status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(signInAnonymously.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       .addCase(signInAnonymously.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.user = action.payload;
//       })
//       .addCase(signInAnonymously.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       });
//   },
// });

// export default authSlice.reducer;
import { supabase } from "@/lib/supabseClient";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

// Async Thunk for Anonymous Sign-In
export const signInAnonymously = createAsyncThunk(
  "auth/signInAnonymously",
  async (_, { rejectWithValue }) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        console.log("Anonymous user already exists:", session.user);
        return session.user;
      }

      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;

      console.log("New anonymous user created:", data.user);
      return data.user;
    } catch (error) {
      console.error("Error signing in anonymously:", error.message);
      toast.error(error.message);

      return rejectWithValue(error.message);
    }
  }
);

// Async Thunk for Email Sign-Up
export const signUpWithEmail = createAsyncThunk(
  "auth/signUpWithEmail",
  async ({ email, password, name }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) throw error;

      const user = data.user;
      console.log(user, "User signed up");

      toast.success("Signup successful! Please verify your email.");
      return user;
    } catch (error) {
      console.error("Error signing up:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const saveUserProfile = createAsyncThunk(
  "auth/saveUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      // Check active session
      const { data: session, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) throw sessionError;
      if (!session?.session) console.log("No active session found!");

      // Fetch user data
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) throw error;
      if (!user || !user.email_confirmed_at) {
        throw new Error("Email not verified yet.");
      }

      return user;
    } catch (error) {
      console.error("Error saving profile:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Async Thunk for Email Sign-In
export const signInWithEmail = createAsyncThunk(
  "auth/signInWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Sign-in successful!");

      return data.user;
    } catch (error) {
      // console.error("Error signing in:", error.message);
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);
export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) throw error;

      toast.success("Google sign-in successful!");
      return data.user;
    } catch (error) {
      console.error("Google sign-in error:", error.message);
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Call Supabase logout method to clear the session
      await supabase.auth.signOut();

      // Return a success message or empty response
      toast.success("user log out successful!");

      return null; // Returning null will clear the user from the state
    } catch (error) {
      console.error("Error logging out:", error.message);
      return rejectWithValue(error.message);
    }
  }
);
export const checkUserSession = createAsyncThunk(
  "auth/checkUserSession",
  async (_, { rejectWithValue }) => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) throw error;

      return session?.user || null;
    } catch (error) {
      console.error("Error checking session:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Redux Slice
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle",
    error: null,
    isauth: false,
  },
  reducers: {
    setIsAuth: (state) => {
      state.isauth = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInAnonymously.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signInAnonymously.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(signInAnonymously.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(signUpWithEmail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(signInWithEmail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isauth = true;
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(signInWithGoogle.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isauth = true;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(saveUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(logout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isauth = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(checkUserSession.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkUserSession.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isauth = true;
      })
      .addCase(checkUserSession.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.isauth = false;
        state.error = action.payload;
      });
  },
});

export const { setIsAuth } = authSlice.actions;

export default authSlice.reducer;
