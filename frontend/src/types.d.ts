export interface RegisterMutation {
  firstName: string;
  secondName: string;
  email: string;
  password: string;
  phone: string;
}

export interface LogInMutation {
  email: string;
  password: string;
}

export interface User {
  id: number;
  firstName: string;
  secondName: string;
  email: string;
  role: string;
  token: string;
  phone: string;
}

export interface AdminRefactor {
  firstName: string;
  secondName: string;
  email: string;
}

export interface RegisterResponse {
  user: User;
  message: string;
}

export interface ValidationError {
  errors: {
    [key: string]: string;
  };
}

export interface GlobalError {
  error: string;
  message: string;
}

export interface IBrand {
  id: number;
  title: string;
  logo: string | null;
}

export interface IBrandForm {
  id?: number;
  title: string;
  logo: File | null;
}

export interface EditSiteMutation {
  instagram: string;
  whatsapp: string;
  schedule: string;
  address: string;
  email: string;
  phone: string;
  PhotoByCarousel: PhotoCarousel[];
}

export interface EditSite {
  id: number;
  instagram: string;
  whatsapp: string;
  schedule: string;
  address: string;
  email: string;
  phone: string;
  PhotoByCarousel: PhotoCarousel[];
}

export interface PhotoCarousel {
  photo: File | null;
}

export interface ICategories {
  id: number;
  title: string;
  subcategories: [{id: number; title: string, parentId: number}];
  parentId: number;
  parent: { id:number, title: string };
}

export interface CategoryMutation {
  title: string;
}

export interface ProductRequest {
  productName: string;
  productPhoto: File | null;
  productPrice: number;
  productDescription: string;
  existence: boolean;
  sales: boolean;
  brandId: string;
  categoryId: string;
  subcategoryId: string;
  parentId: string;
  id?: number;
  category?: ICategories;
}

export interface ICart {
  quantity: number;
  product: ProductResponse;
}

export interface ICartMutation {
  productId: number;
  quantity: number;
}

export interface SubcategoryWithBrand {
  id: number;
  title: string;
  brands: IBrand[];
}

interface VerifyResetCodePayload {
  resetCode: string;
  newPassword: string;
}

interface VerifyResetCodeResponse {
  message: string;
}

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

interface ChangePasswordResponse {
  message: string;
}

export interface ProductResponse {
  id: number;
  productName: string;
  productPhoto: string;
  productPrice: number;
  productDescription: string;
  existence: boolean;
  sales: boolean;
  categoryId: string;
  brandId: string;
  brand: IBrand;
  category: ICategories;
}
