export interface RegisterMutation {
  firstName: string;
  secondName: string;
  email: string;
  password: string;
  phone: string;
  bonus?: number
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
  bonus : number
}

export interface UserWithOrder {
  id: number;
  firstName: string;
  secondName: string;
  email: string;
  role: string;
  token: string;
  phone: string;
  orderCount: number;
  Order: IOrder[];
  orderItem: OrderItem[];
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

interface ErrorMutation {
  message: string;
  field?: string;
}

export interface GlobalError {
  error: string;
  message: string;
}

export interface IBrand {
  id: number;
  title: string;
  logo: string | null;
  description: string | null;
}

export interface IBrandForm {
  id?: number;
  title: string;
  logo: File | null;
  description: string;
}

export interface BrandError {
  error: string;
  errors: {
    title: string;
  };
  message: string;
  statusCode: number;
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
  parent: { id:number, title: string };
}

export interface CategoryMutation {
  title: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: number;
  title: string;
  parentId: string | number | null;
  subcategories?: Subcategory[];
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
  startDateSales?: Date | null | string;
  endDateSales?: Date | null | string;
}

export interface ICart {
  quantity: number;
  productId: number;
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
  resetToken: string;
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
  startDateSales?: string;
  endDateSales?: string;
  orderedProductsStats: number;
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
  address?: string;
  guestEmail: string;
  guestPhone: string;
  guestName: string;
  guestLastName: string;
  orderComment: string;
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  userId: number;
  bonusUsed?: number;
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
  bonusUsed?: number;
  deliveryMethod: string;
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

export interface OrderStats {
  id: number;
  deliveryStatistic: number;
  pickUpStatistic: number;
}