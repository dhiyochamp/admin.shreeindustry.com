import { supabase } from "@/lib/supabseClient";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

// insert the main category
export const addCategory = createAsyncThunk(
  "data/addCategory",
  async ({ id, name, pathName }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("category") // Table name
        .insert([{ id, name, pathName }]) // Insert the object
        .select();

      if (error) throw error;

      console.log(data[0], "data");
      toast.success("Category add successfully");
      return data[0]; // Return the inserted data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateMainCategory = createAsyncThunk(
  "data/updateMainCategory",
  async (catdata, { rejectWithValue }) => {
    try {
      if (!catdata.id) throw new Error("category ID is required for update");

      const { data, error } = await supabase
        .from("category")
        .update(catdata)
        .eq("id", catdata.id)
        .select();

      if (error) throw error;
      toast.success("Category updated successfully");
    } catch (error) {
      toast.error("Failed to update product");
      return rejectWithValue(error.message);
    }
  }
);
export const deleteMainCategory = createAsyncThunk(
  "data/deleteMainCategory",
  async (id, { rejectWithValue }) => {
    try {
      console.log(id, "what id is the value");

      if (!id || !isUUID(id)) {
        throw new Error("Invalid UUID provided");
      }

      const { data, error } = await supabase
        .from("category") // Table name
        .delete() // Delete rows
        .eq("id", id); // Use `.eq()` for a single ID

      if (error) throw error;

      toast.success("Category deleted successfully");
      return data; // Return deleted record
    } catch (error) {
      toast.error("Failed to delete category");
      return rejectWithValue(error.message);
    }
  }
);

//fetch the main category
export const fetchCategory = createAsyncThunk(
  "data/fetchCategory",
  async (_, { rejectWithValue }) => {
    try {
      // Fetch data from 'category' table
      const { data, error } = await supabase
        .from("category") // Table name
        .select("*"); // Select all columns

      if (error) throw error;

      return data; // Return fetched categories
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//insert the sub-category

export const addSubCategory = createAsyncThunk(
  "data/sub-category",
  async ({ id, name, category, imageUrl, pathName }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("sub-category") // Table name
        .insert({ id, name, category, imageUrl, pathName }) // Insert the object
        .select();

      if (error) throw error;

      console.log(data[0], "data");
      toast.success("sub-category added successfully");
      return data[0]; // Return the inserted data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchSubCategory = createAsyncThunk(
  "data/fetchSUbCategory",
  async (_, { rejectWithValue }) => {
    try {
      // Fetch data from 'category' table
      const { data, error } = await supabase
        .from("sub-category") // Table name
        .select("*"); // Select all columns

      if (error) throw error;

      return data; // Return fetched categories
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSubCategory = createAsyncThunk(
  "data/updateSubCategory",
  async (subCatdata, { rejectWithValue }) => {
    try {
      if (!subCatdata.id)
        throw new Error("subCategory ID is required for update");

      const { data, error } = await supabase
        .from("sub-category")
        .update(subCatdata)
        .eq("id", subCatdata.id)
        .select();

      if (error) throw error;
      toast.success("Sub-Category updated successfully");
    } catch (error) {
      toast.error("Failed to update product");
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSubCategory = createAsyncThunk(
  "data/deleteSubCategory",
  async (id, { rejectWithValue }) => {
    try {
      console.log(id, "what id is the value");

      if (!id || !isUUID(id)) {
        throw new Error("Invalid UUID provided");
      }

      const { data, error } = await supabase
        .from("sub-category") // Table name
        .delete() // Delete rows
        .eq("id", id); // Use `.eq()` for a single ID

      if (error) throw error;

      toast.success("Sub category deleted successfully");
      return data; // Return deleted record
    } catch (error) {
      toast.error("Failed to delete category");
      return rejectWithValue(error.message);
    }
  }
);

//insert the Product
export const addProduct = createAsyncThunk(
  "data/addProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("product") // Table name
        .insert(productData) // Insert the object
        .select();

      if (error) throw error;

      console.log(data[0], "data");
      toast.success("product added successfully");
      return data[0]; // Return the inserted data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const updateProduct = createAsyncThunk(
  "data/updateProduct",
  async (productData, { rejectWithValue }) => {
    console.log(productData, "data of product");
    try {
      if (!productData.id) throw new Error("Product ID is required for update");

      const { data, error } = await supabase
        .from("product") // Table name
        .update(productData) // Update product
        .eq("id", productData.id) // Find product by ID
        .select();

      if (error) throw error;

      toast.success("Product updated successfully");
      return data[0]; // Return the updated product
    } catch (error) {
      toast.error("Failed to update product");
      return rejectWithValue(error.message);
    }
  }
);
export const bulkUpdateProducts = createAsyncThunk(
  "data/bulkUpdateProducts",
  async ({ productIds, updateData }, { rejectWithValue }) => {
    console.log(productIds, updateData, "IDs and update data");

    try {
      if (!productIds || productIds.length === 0)
        throw new Error("Product IDs are required for bulk update");

      // Remove empty fields from updateData
      const filteredUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(
          ([_, value]) => value !== "" && value !== null && value !== undefined
        )
      );

      if (Object.keys(filteredUpdateData).length === 0)
        throw new Error("No valid data provided for update");

      const { data, error } = await supabase
        .from("product") // Table name
        .update(filteredUpdateData) // Update only provided fields
        .in("id", productIds) // Match multiple product IDs
        .select();

      if (error) throw error;

      toast.success("Products updated successfully");
      return data; // Return updated products
    } catch (error) {
      toast.error("Failed to update products");
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProducts = createAsyncThunk(
  "data/deleteProducts",
  async (productIds, { rejectWithValue }) => {
    try {
      if (!productIds.length)
        throw new Error("No product IDs provided for deletion");

      const { error } = await supabase
        .from("product") // Table name
        .delete() // Delete rows
        .in("id", productIds); // Delete multiple products using array of IDs

      if (error) throw error;

      toast.success("Products deleted successfully");
      return productIds; // Return deleted IDs to update state
    } catch (error) {
      toast.error("Failed to delete products");
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllProduct = createAsyncThunk(
  "data/fetchAllProduct",
  async (
    {
      selectedCategories,
      selectedSubCategories,
      selectedSort,
      searchTerm,
      dataLength,
    },
    { rejectWithValue }
  ) => {
    try {
      let query = supabase.from("product").select("*", { count: "exact" });

      // Apply category filter if array has values
      if (selectedCategories?.length > 0)
        query = query.in("category", selectedCategories);

      // Apply sub-category filter if array has values
      if (selectedSubCategories?.length > 0)
        query = query.in("subCategory", selectedSubCategories);

      // Apply sorting conditions
      if (selectedSort === "out of stock") {
        query = query.eq("outOfStock", true);
      } else if (selectedSort === "Ascending") {
        query = query.order("inventory", { ascending: true });
      } else if (selectedSort === "Descending") {
        query = query.order("inventory", { ascending: false });
      }

      // Apply search filter
      if (searchTerm) {
        const isUUID =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            searchTerm
          );

        if (isUUID) {
          query = query.eq("id", searchTerm); // Exact match for UUID
        } else {
          query = query.ilike("productName", `%${searchTerm}%`); // Partial search for productName
        }
      }

      // Apply limit if `dataLength` is provided
      if (dataLength) {
        query = query.limit(dataLength);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return { data, total: count }; // Return both filtered data and total count
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProduct = createAsyncThunk(
  "data/fetchProduct",
  async ({ searchTerm }, { rejectWithValue }) => {
    try {
      let query = supabase
        .from("product")
        .select("*", { count: "exact" })
        .limit(10); // Limit results to top 10

      // Apply search filter
      if (searchTerm) {
        const isUUID =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            searchTerm
          );

        if (isUUID) {
          query = supabase
            .from("product")
            .select("*")
            .eq("id", searchTerm)
            .limit(10); // Exact match for UUID with limit
        } else {
          query = supabase
            .from("product")
            .select("*")
            .ilike("productName", `%${searchTerm}%`)
            .limit(10); // Partial search with limit
        }
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return { data, total: count }; // Return both filtered data and total count
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductsBySubCategory = createAsyncThunk(
  "data/fetchProductsBySubCategory",
  async ({ subCategoryId }, { rejectWithValue }) => {
    try {
      let query = supabase.from("product").select("*", { count: "exact" });

      // Filter products where subCategory matches the provided id
      query = query.eq("subCategory", subCategoryId);

      const { data, error, count } = await query;

      if (error) throw error;

      return { data, total: count }; // Return both filtered data and total count
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBlogs = createAsyncThunk(
  "data/fetchBlogs",
  async ({ search, page = 1, itemPerPage = 10 }, { rejectWithValue }) => {
    console.log(search, "what i seach");
    try {
      let query = supabase
        .from("blog")
        .select("*", { count: "exact" }) // count for pagination
        .range((page - 1) * itemPerPage, page * itemPerPage - 1);

      if (search.trim() !== "") {
        query = query.ilike("heading", `%${search}%`);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return { data, count }; // return count for frontend pagination
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchBlogByid = createAsyncThunk(
  "data/fetchBlogByid",
  async (id, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("blog")
        .select("*")
        .eq("id", id)
        .single(); // Ensures only one object is returned

      if (error) throw error;

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const insertBlog = createAsyncThunk(
  "data/insertBlog",
  async (blogData, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from("blog").insert([blogData]);

      if (error) throw error;

      toast.success("Blog add successfully");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const updateBlog = createAsyncThunk(
  "data/updateBlog",
  async ({ id, data: updatedData }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("blog")
        .update(updatedData)
        .eq("id", id);

      if (error) throw error;

      toast.success("Blog updated successfully");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteMultipleBlogs = createAsyncThunk(
  "data/deleteMultipleBlogs",
  async (ids, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("blog")
        .delete()
        .in("id", ids); // Deletes where id is in array

      if (error) throw error;

      toast.success("Deleted successfully");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWebStories = createAsyncThunk(
  "data/fetchWebStories",
  async ({ search, page = 1, itemPerPage = 10 }, { rejectWithValue }) => {
    console.log(search, "what i seach");
    try {
      let query = supabase
        .from("webStories")
        .select("*", { count: "exact" }) // count for pagination
        .range((page - 1) * itemPerPage, page * itemPerPage - 1);

      // if (id) {
      //   query = query.eq("category", id);
      // }

      if (search.trim() !== "") {
        query = query.ilike("heading", `%${search}%`);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return { data, count }; // return count for frontend pagination
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchWebStoriesByid = createAsyncThunk(
  "data/fetchWebStoriesByid",
  async (id, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("webStories")
        .select("*")
        .eq("id", id)
        .single(); // Ensures only one object is returned

      if (error) throw error;

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const insertWebStories = createAsyncThunk(
  "data/insertWebStories",
  async (blogData, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("webStories")
        .insert([blogData]);

      if (error) throw error;

      toast.success("Web Storie add successfully");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const updateWebStories = createAsyncThunk(
  "data/updateWebStories",
  async ({ id, data: updatedData }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("webStories")
        .update(updatedData)
        .eq("id", id);

      if (error) throw error;

      toast.success("Web Storie updated successfully");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteMultipleWebStories = createAsyncThunk(
  "data/deleteMultipleWebStories",
  async (ids, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("webStories")
        .delete()
        .in("id", ids); // Deletes where id is in array

      if (error) throw error;

      toast.success("Deleted successfully");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// export const fetchLeads = createAsyncThunk(
//   "data/fetchLeads",
//   async (
//     { search = "", data = "", page = 1, itemPerPage = 10 },
//     { rejectWithValue }
//   ) => {
//     try {
//       let query = supabase
//         .from("contactUs")
//         .select("*", { count: "exact" })
//         .range((page - 1) * itemPerPage, page * itemPerPage - 1);

//       // Apply filters only if they exist
//       if (search.trim() !== "") {
//         query = query.ilike("fullName", `%${search.trim()}%`);
//       }

//       if (date && typeof date === "string" && date.trim() !== "") {
//         query = query.eq("date", date.trim());
//       }

//       const { data, error, count } = await query;

//       if (error) throw error;

//       return { data, count };
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const fetchLeads = createAsyncThunk(
  "data/fetchLeads",
  async (
    { search = "", date = "", page = 1, itemPerPage = 10 },
    { rejectWithValue }
  ) => {
    try {
      let query = supabase
        .from("contactUs")
        .select("*", { count: "exact" })
        .range((page - 1) * itemPerPage, page * itemPerPage - 1);

      // Filter by name if search term exists
      if (search.trim() !== "") {
        query = query.ilike("fullName", `%${search.trim()}%`);
      }

      // Filter by date (match only date part, ignoring time)
      if (date && date.trim() !== "") {
        const startOfDay = `${date}T00:00:00`;
        const endOfDay = `${date}T23:59:59`;

        query = query.gte("date", startOfDay).lte("date", endOfDay);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return { data, count };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateLead = createAsyncThunk(
  "data/updateLead",
  async ({ leadId, updates }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("contactUs") // your table name
        .update(updates)
        .eq("id", leadId)
        .select()
        .single();

      if (error) throw error;

      return data; // Return updated lead
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const bulkUpdateLeads = createAsyncThunk(
  "data/bulkUpdateLeads",
  async ({ ids, status, note }, { rejectWithValue }) => {
    try {
      if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error("No IDs provided for bulk update.");
      }

      const { data, error } = await supabase
        .from("contactUs")
        .update({ status, note })
        .in("id", ids) // bulk update where id IN (...)
        .select(); // optionally return updated records

      if (error) throw error;

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const dataSlice = createSlice({
  name: "data",
  initialState: {
    status: "idle",
    error: null,
    category: null,
    product: null,
    subCategory: null,
    allCategory: null,
    allSubCategory: null,
    allProduct: null,
    allProductCategory: null,
    seoProduct: null,
    blog: null,
    allBlogs: null,
    allWebStories: null,
    webStories: null,
    searchText: "",
    allLeads: null,
    lead: null,
  },
  reducers: {
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCategory.pending, (state) => {
        (state.status = "loading"), (state.error = null);
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.category = action.payload;
        state.status = "succeeded";
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateMainCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateMainCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.category = action.payload; // Store fetched categories
      })
      .addCase(updateMainCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteMainCategory.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteMainCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(deleteMainCategory.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(fetchCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allCategory = action.payload; // Store fetched categories
      })
      .addCase(fetchCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchSubCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSubCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allSubCategory = action.payload; // Store fetched categories
      })
      .addCase(fetchSubCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateSubCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateSubCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subCategory = action.payload; // Store fetched categories
      })
      .addCase(updateSubCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteSubCategory.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(addSubCategory.pending, (state) => {
        (state.status = "loading"), (state.error = null);
      })
      .addCase(addSubCategory.fulfilled, (state, action) => {
        state.subCategory = action.payload;
        state.status = "succeeded";
      })
      .addCase(addSubCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addProduct.pending, (state) => {
        (state.status = "loading"), (state.error = null);
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.product = action.payload;
        if (!state.allProductCategory) {
          state.allProduct.data = [state.product, ...state.allProduct.data];
        } else {
          state.allProductCategory.data = [
            state.product,
            ...state.allProductCategory.data,
          ];
        }
        state.status = "succeeded";
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        (state.status = "loading"), (state.error = null);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.product = action.payload;
        state.status = "succeeded";
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(bulkUpdateProducts.pending, (state) => {
        (state.status = "loading"), (state.error = null);
      })
      .addCase(bulkUpdateProducts.fulfilled, (state, action) => {
        state.product = action.payload;
        state.status = "succeeded";
      })
      .addCase(bulkUpdateProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchAllProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllProduct.fulfilled, (state, action) => {
        state.allProduct = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchAllProduct.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(fetchProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.seoProduct = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(fetchProductsBySubCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsBySubCategory.fulfilled, (state, action) => {
        state.allProductCategory = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchProductsBySubCategory.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(deleteProducts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteProducts.fulfilled, (state, action) => {
        if (!state.allProductCategory) {
          if (Array.isArray(action.payload)) {
            state.allProduct.data =
              state.allProduct?.data?.filter(
                (product) => !action.payload.includes(product.id) // Remove deleted products
              ) || [];
          }
        }
        state.status = "succeeded";
      })
      .addCase(deleteProducts.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(fetchBlogs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.allBlogs = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(fetchBlogByid.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBlogByid.fulfilled, (state, action) => {
        state.blog = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchBlogByid.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(insertBlog.pending, (state) => {
        state.status = "loading";
      })
      .addCase(insertBlog.fulfilled, (state, action) => {
        state.blog = action.payload;
        state.status = "succeeded";
      })
      .addCase(insertBlog.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(updateBlog.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.blog = action.payload;
        state.status = "succeeded";
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(deleteMultipleBlogs.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteMultipleBlogs.fulfilled, (state, action) => {
        if (!state.allProductCategory) {
          if (Array.isArray(action.payload)) {
            state.allBlogs =
              state.allBlogs?.filter(
                (product) => !action.payload.includes(product.id) // Remove deleted products
              ) || [];
          }
        }
        state.status = "succeeded";
      })
      .addCase(deleteMultipleBlogs.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(fetchWebStories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWebStories.fulfilled, (state, action) => {
        state.allWebStories = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchWebStories.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(fetchWebStoriesByid.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWebStoriesByid.fulfilled, (state, action) => {
        state.webStories = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchWebStoriesByid.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(insertWebStories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(insertWebStories.fulfilled, (state, action) => {
        state.webStories = action.payload;
        state.status = "succeeded";
      })
      .addCase(insertWebStories.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(updateWebStories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateWebStories.fulfilled, (state, action) => {
        state.webStories = action.payload;
        state.status = "succeeded";
      })
      .addCase(updateWebStories.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(deleteMultipleWebStories.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteMultipleWebStories.fulfilled, (state, action) => {
        if (!state.allWebStories) {
          if (Array.isArray(action.payload)) {
            state.allWebStories =
              state.allWebStories?.filter(
                (product) => !action.payload.includes(product.id) // Remove deleted products
              ) || [];
          }
        }
        state.status = "succeeded";
      })
      .addCase(deleteMultipleWebStories.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(fetchLeads.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.allLeads = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(updateLead.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        state.lead = action.payload;
        state.status = "succeeded";
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(bulkUpdateLeads.pending, (state) => {
        state.status = "loading";
      })
      .addCase(bulkUpdateLeads.fulfilled, (state, action) => {
        state.lead = action.payload;
        state.status = "succeeded";
      })
      .addCase(bulkUpdateLeads.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      });
  },
});
export const { setSearchText } = dataSlice.actions;
export default dataSlice.reducer;
