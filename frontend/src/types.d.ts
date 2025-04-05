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
  linkAddress: string;
}

export interface EditSite {
  id: number;
  instagram: string;
  whatsapp: string;
  schedule: string;
  address: string;
  email: string;
  phone: string;
  linkAddress: string;
}

export interface PhotoCarousel {
  id?: number;
  photo: File | null;
  link: string;
  order?: number;
}

export interface PhotoForm{
  photo: File | null;
  link: string;
}


export interface ICategories {
  id: number;
  title: string;
  parentId?: number | null;
  subcategories?: Subcategory[];
}

export interface CategoryMutation {
  title: string;
}

export interface Subcategory {
  id: number;
  title: string;
  parentId: string | number | undefined | null;
  subcategories?: string[];
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
  id?: number;
}

export interface ICart {
  id: number;
  productId: number;
  quantity: number;
  product: ProductResponse;
}

export interface ICartMutation {
  productId: number;
  quantity: number;
  orderAmount: number;
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

// export interface AdminFormData {
//   firstName: string;
//   secondName: string;
//   email: string;
//   phone: string;
//   password: string;
//   role: string;
// }

export interface AdminDataMutation {
  id?: number;
  firstName: string;
  secondName: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}

export interface IOrder {
  id: number;
  status: string;
  address: string;
  guestEmail: string;
  guestPhone: string;
  guestName: string;
  guestLastName: string;
  orderComment: string;
  paymentMethod: PaymentMethod;
  userId: number;
  user: User;
  items: ICart[];

  createdAt: string;
  updatedAt: string;
}

export interface OrderMutation {
  address: string;
  guestEmail: string;
  guestPhone: string;
  guestName: string;
  guestLastName: string;
  orderComment: string;
  paymentMethod: string;
  userId: string;
  items: ICartMutation[];
}

export interface OrderItem {
  id: number;
  quantity: number;
  productId: number;
  product: ProductResponse;
  orderAmount: number;
}