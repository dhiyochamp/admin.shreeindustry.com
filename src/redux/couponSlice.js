// In this coupon and SEO is in this

import { supabase } from "@/lib/supabseClient";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export const fetchCoupon = createAsyncThunk( 
  "data/fetchCoupon",
  async (_, { rejectWithValue }) => {
    try {
      // Fetch data from 'category' table
      const { data, error } = await supabase
        .from("coupon") // Table name
        .select("*"); // Select all columns

      if (error) throw error;

      return data; // Return fetched categories
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCoupon = createAsyncThunk(
  "data/addCoupon",
  async (formData, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("coupon") // Table name
        .insert(formData) // Insert the object
        .select("*");

      if (error) throw error;

      console.log(data[0], "data");
      toast.success("coupon add successfully");
      return data[0]; // Return the inserted data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const addSEO = createAsyncThunk(
  "data/addSEO",
  async (seoData, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("seo-metadata") // Table name
        .insert(seoData) // Insert the object
        .select("*");

      if (error) throw error;

      console.log(data[0], "data");
      toast.success("SEO add successfully");
      return data[0]; // Return the inserted data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// export const fetchSeo = createAsyncThunk(
//   "data/fetchSeo",
//   async (searchValue, { rejectWithValue }) => {
//     try {
//       // Fetch data from 'category' table
//       const { data, error } = await supabase
//         .from("seo-metadata") // Table name
//         .select("*"); // Select all columns

//       if (error) throw error;

//       return data; // Return fetched categories
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const fetchSeo = createAsyncThunk(
  "data/fetchSeo",
  async (searchValue, { rejectWithValue }) => {
    console.log(searchValue, "searchValuesearchValue");
    try {
      let query = supabase.from("seo-metadata").select("*");

      // Apply search filter only if searchValue is provided
      if (searchValue && searchValue.trim() !== "") {
        query = query.or(
          `pageUrl.ilike.%${searchValue}%,title.ilike.%${searchValue}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;

      return data; // Return either all or filtered data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSeo = createAsyncThunk(
  "data/updateSeo",
  async ({ seoData, id }, { rejectWithValue }) => {
    try {
      console.log(id, "what is data");
      if (!id) throw new Error("SEO ID is required for update");

      const { data, error } = await supabase
        .from("seo-metadata")
        .update(seoData)
        .eq("id", id) // Fix here: id should be used separately
        .select();

      if (error) throw error;
      toast.success("SEO updated successfully");
      return data;
    } catch (error) {
      toast.error("Failed to update SEO");
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSeo = createAsyncThunk(
  "data/deleteSeo",
  async (ids, { rejectWithValue }) => {
    try {
      if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error("Invalid IDs array");
      }

      const { data, error } = await supabase
        .from("seo-metadata")
        .delete()
        .in("id", ids);

      if (error) throw error;
      toast.success("SEO entries deleted successfully");
      return data;
    } catch (error) {
      toast.error("Failed to delete SEO entries");
      return rejectWithValue(error.message);
    }
  }
);

// 1. Add Banner
export const addBanner = createAsyncThunk(
  "banner/addBanner",
  async (bannerData, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("banners")
        .insert([bannerData]);

      if (error) throw error;
      return data;
    } catch (error) {
      toast.error(error.message || "Failed to add banner");
      return rejectWithValue(error.message || "Failed to add banner");
    }
  }
);

// 2. Edit Banner
export const editBanner = createAsyncThunk(
  "banner/editBanner",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("banners")
        .update(updatedData)
        .eq("id", id);

      if (error) throw error;
      toast.success("Banner updated successfully");
      return data;
    } catch (error) {
      toast.error(error.message || "Failed to edit banner");
      return rejectWithValue(error.message || "Failed to edit banner");
    }
  }
);

// 3. Delete Single Banner
export const deleteBanner = createAsyncThunk(
  "banner/deleteBanner",
  async (id, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("banners")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return data;
    } catch (error) {
      toast.error(error.message || "Failed to delete banner");
      return rejectWithValue(error.message || "Failed to delete banner");
    }
  }
);

// 4. Delete All Banners
export const deleteAllBanners = createAsyncThunk(
  "banner/deleteAllBanners",
  async (_, { rejectWithValue }) => {
    try {
      // First fetch all IDs
      const { data: banners, error: fetchError } = await supabase
        .from("banners")
        .select("id");

      if (fetchError) throw fetchError;

      if (!banners.length) {
        throw new Error("No banners found to delete.");
      }

      const idsToDelete = banners.map((banner) => banner.id);

      // Then delete all by IDs
      const { data, error } = await supabase
        .from("banners")
        .delete()
        .in("id", idsToDelete);

      if (error) throw error;

      toast.success("All banners deleted successfully!");
      return data;
    } catch (error) {
      toast.error(error.message || "Failed to delete all banners");
      return rejectWithValue(error.message || "Failed to delete all banners");
    }
  }
);

// 5. Fetch All Banners
export const fetchBanners = createAsyncThunk(
  "banner/fetchBanners",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch banners");
    }
  }
);

export const couponSlice = createSlice({
  name: "coupon",
  initialState: {
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    coupon: null,
    allCoupon: null,
    seo: null,
    allSeo: null,
    topBanners: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addCoupon.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addCoupon.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.coupon = action.payload;
      })
      .addCase(addCoupon.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchCoupon.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCoupon.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allCoupon = action.payload;
      })
      .addCase(fetchCoupon.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addSEO.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addSEO.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.seo = action.payload;
      })
      .addCase(addSEO.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchSeo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSeo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allSeo = action.payload;
      })
      .addCase(fetchSeo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateSeo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateSeo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.seo = action.payload;
      })
      .addCase(updateSeo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteSeo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteSeo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.seo = action.payload;
      })
      .addCase(deleteSeo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBanner.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.length > 0) {
          state.topBanners.push(action.payload[0]); // supabase returns array
        }
      })
      .addCase(addBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 2. Edit Banner
      .addCase(editBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editBanner.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.length > 0) {
          const updatedBanner = action.payload[0];
          state.topBanners = state.topBanners.map((banner) =>
            banner.id === updatedBanner.id ? updatedBanner : banner
          );
        }
      })
      .addCase(editBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 3. Delete Single Banner
      .addCase(deleteBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta && action.meta.arg) {
          const deletedId = action.meta.arg;
          state.topBanners = state.topBanners.filter(
            (banner) => banner.id !== deletedId
          );
        }
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 4. Delete All Banners
      .addCase(deleteAllBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAllBanners.fulfilled, (state) => {
        state.loading = false;
        state.topBanners = [];
      })
      .addCase(deleteAllBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 5. Fetch All Banners
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.topBanners = action.payload || [];
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default couponSlice.reducer;
