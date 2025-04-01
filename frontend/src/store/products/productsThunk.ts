import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  GlobalError,
  ProductRequest,
  SubcategoryWithBrand,
  ProductResponse,
} from "../../types";
import { isAxiosError } from "axios";
import axiosApi from "../../axiosApi.ts";

export const addProduct = createAsyncThunk<
  void,
  { product: ProductRequest; token: string },
  {
    rejectValue: GlobalError;
  }
>("product/addProduct", async ({ product, token }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    const keys = Object.keys(product) as (keyof ProductRequest)[];
    keys.forEach((key) => {
      const value = product[key];
      if (value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value, value.name);
        } else {
          formData.append(key, String(value));
        }
      }
    });
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }
    await axiosApi.post("products/create", formData, {
      headers: { Authorization: token },
    });
  } catch (error) {
    if (
      isAxiosError(error) &&
      error.response &&
      (error.response.status === 409 || error.response.status === 404)
    ) {
      return rejectWithValue(error.response.data as GlobalError);
    }
    throw error;
  }
});

export const editProduct = createAsyncThunk<
  void,
  { product: ProductRequest; token: string }
>("product/editProduct", async ({ product, token }) => {
  const formData = new FormData();

  const keys = Object.keys(product) as (keyof ProductRequest)[];

  keys.forEach((key) => {
    const value = product[key];
    if (value !== undefined) {
      if (value instanceof File) {
        formData.append(key, value, value.name);
      } else {
        formData.append(key, String(value));
      }
    }
  });
  await axiosApi.put(`products/update_product_item/${product.id}`, formData, {
    headers: { Authorization: token },
  });
});

export const getProducts = createAsyncThunk<ProductResponse[]>(
  "products/getProducts",
  async () => {
    const response = await axiosApi<ProductResponse[]>("/products/catalog");
    return response.data || [];
  },
);

export const getOneProduct = createAsyncThunk<ProductRequest, number>(
  "products/getOneProduct",
  async (productId) => {
    const response = await axiosApi.get<ProductRequest>(
      `/products/${productId}`,
    );
    return response.data || null;
  },
);

export const deleteProduct = createAsyncThunk<
  void,
  {
    productId: number;
    token: string;
  }
>("products/deleteProduct", async ({ productId, token }) => {
  await axiosApi.delete(`products/${productId}`, {
    headers: { Authorization: token },
  });
});

export const getAllProductsByCategory = createAsyncThunk<
  SubcategoryWithBrand[],
  number
>("product/getAllProductsByCategory", async (id: number) => {
  const response = await axiosApi<SubcategoryWithBrand[]>(
    `products/categoryID/${id}`,
  );
  return response.data || [];
});
