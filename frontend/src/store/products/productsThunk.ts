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
>("product/addProduct", async ({ product }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    const keys = Object.keys(product) as (keyof ProductRequest)[];
    keys.forEach((key) => {
      const value = product[key];
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !(typeof value === "boolean" && !value)
      ) {
        if (value instanceof File) {
          formData.append(key, value, value.name);
        } else if (typeof value === "boolean") {
          formData.append(key, value ? "true" : "false");
        } else {
          formData.append(key, String(value));
        }
      }
    });
    await axiosApi.post("products/create", formData);
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
>("product/editProduct", async ({ product },) => {
  const formData = new FormData();

  const keys = Object.keys(product).filter(
    (key) => !["id"].includes(key),
  ) as (keyof ProductRequest)[];

  keys.forEach((key) => {
    const value = product[key];
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      !(typeof value === "boolean" && !value)
    ) {
      if (key === "productPhoto") {
        if (value instanceof File) {
          formData.append('productPhoto', value, value.name);
        }
      } else if (typeof value === "boolean") {
        formData.append(key, value ? "true" : "false");
      } else {
        formData.append(key, String(value));
      }
    }
  });
  await axiosApi.put(`products/update_product_item/${product.id}`, formData);
});

export const getProducts = createAsyncThunk<ProductResponse[], string>(
  "products/getProducts",
  async (searchKeyword = '') => {
    const response = await axiosApi<ProductResponse[]>(`/products/catalog?search=${searchKeyword}`);
    return response.data || [];
  },
);

export const getOneProduct = createAsyncThunk<ProductResponse, number>(
  "products/getOneProduct",
  async (productId) => {
    const response = await axiosApi.get<ProductResponse>(
      `/products/${productId}`,
    );
    return response.data || null;
  },
);

export const getOneProductForEdit = createAsyncThunk<ProductRequest, number>(
  "products/getOneProduct",
  async (productId) => {
    const response = await axiosApi.get<ProductRequest>(
      `/products/edit/${productId}`,
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
>("products/deleteProduct", async ({ productId }) => {
  await axiosApi.delete(`products/${productId}`);
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

export const getProductsByBrand = createAsyncThunk<ProductResponse[], number>(
  "products/getProductsByBrand",
  async (id) => {
    const products = await axiosApi<ProductResponse[]>(`products/catalog?brand=${id}`);
    return products.data || [];
  }
);

export const getPromotionalProducts = createAsyncThunk<ProductResponse[], void>(
  "products/getPromotionalProducts",
  async () => {
    const products = await axiosApi<ProductResponse[]>('products/promotional');
    return products.data || [];
  }
);

export const getTopSellingProducts = createAsyncThunk<ProductResponse[], void>(
  "products/getTopSellingProducts",
  async () => {
    const products = await axiosApi<ProductResponse[]>('products/selling');
    return products.data || [];
  }
);

export const getProductsByCategory = createAsyncThunk<ProductResponse[], number>(
  "products/productByCategory",
  async (id) => {
    const products = await axiosApi<ProductResponse[]>(`products/productsByCategory/${id}`);
    return products.data || [];
  }
)

export const getFilteredProducts = createAsyncThunk<
  ProductResponse[],
  { categoryId: number; filters: Record<string, any> }
>(
  "products/getFilteredProducts",
  async ({ categoryId, filters }) => {
    // Конвертируем фильтры в параметры запроса
    const params = new URLSearchParams();
    
    // Добавляем параметры фильтрации
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value) && value.length > 0) {
          // Для массивов добавляем каждый элемент с одинаковым ключом
          value.forEach((item) => {
            params.append(key, item.toString());
          });
        } else if (typeof value === 'boolean') {
          params.append(key, value.toString());
        } else if (typeof value === 'number' || typeof value === 'string') {
          params.append(key, value.toString());
        }
      }
    });
    
    // Выполняем запрос с параметрами фильтрации
    const products = await axiosApi<ProductResponse[]>(
      `products/productsByCategory/${categoryId}?${params.toString()}`
    );
    
    return products.data || [];
  }
);

