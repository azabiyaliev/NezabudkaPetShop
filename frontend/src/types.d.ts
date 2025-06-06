import { DeliveryMethod, PaymentMethod } from './features/Order/OrderForm.tsx';

export interface RegisterMutation {
  firstName: string;
  secondName: string;
  email: string;
  password: string;
  phone: string;
  bonus?: number
  guestEmail?: string;
  recaptchaToken: string;
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
  guestEmail: string;
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
  phone: string;
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
  mapGoogleLink: string;
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
  mapGoogleLink: string;
}

export interface PhotoCarousel {
  id?: number;
  photo: File | null;
  link: string;
  order?: number;
  title: string;
  description: string;
}

export interface PhotoForm{
  photo: File | null;
  link: string;
  title: string;
  description: string;
}


export interface ICategories {
  id: number;
  title: string;
  parentId?: number | null;
  subcategories?: Subcategory[];
  parent?: { id: number; title: string } | null;
  image?: File | null;
}

export interface CategoryMutation {
  title: string;
  subcategories?: Subcategory[];
  parentId?: number | null;
  image?: File | null | string;
}


export interface ICategoriesMutation {
  id: number;
  title: string;
  parentId: number | null;
  subcategories: Subcategory[];
  parent: { id:number, title: string };
  image: string | null;
}

export interface Subcategory {
  id: number;
  title: string;
  parentId: string | number | null;
  subcategories?: Subcategory[];
  image?: File | null;
}

export interface ProductRequest {
  productName: string;
  productPhoto: File | string | null;
  productPrice: number;
  productDescription: string;
  productSize?: string | null;
  productAge?: string | null;
  productWeight?: number | null;
  productFeedClass?: string | null;
  productManufacturer?: string | null;
  existence?: boolean;
  sales?: boolean;
  isBestseller?: boolean;
  brandId?: string;
  categoryId: number[];
  id?: number;
  category?: ICategories;
  startDateSales?: Date | null | string;
  endDateSales?: Date | null | string;
  promoPrice?: number;
  promoPercentage?: number;
  brand?: IBrand;
}


export interface ICartBack {
  id: number,
  userId: number,
  products: ICartItem[],
}
export interface ICartItem {
  id?: number,
  cartId?: number,
  quantity: number;
  productId: number;
  product: ProductResponse;
}

export interface CartError {
  error: string;
  errors: {
    title: string;
  };
  message: string;
  statusCode: number;
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
  isBestseller?: boolean;
  brandId: string;
  brand: IBrand;
  categoryId: number[];
  subcategoryId?: string[];
  productCategory: {
    category: {
      id: number;
      title: string;
      parentId?: number;
      parent?: {
        id: number;
        title: string;
      };
    };
  }[];
  startDateSales?: string;
  endDateSales?: string;
  orderedProductsStats: number;
  productSize?: string;
  productAge?: string;
  productWeight?: number;
  productFeedClass?: string;
  productManufacturer?: string;
  promoPercentage?: number;
  promoPrice: number;
}

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
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  totalPrice: number;
  isArchive: boolean;
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
  items: OrderItem[];
  recaptchaToken: string;
  totalPrice: number;
}

export interface OrderItem {
  id?: number;
  quantity: number;
  productId: number;
  product?: ProductResponse;
  orderAmount: number;
  productName: string | null;
  productPhoto: string | null;
  productPrice: number | null;
  promoPercentage: number | null;
  promoPrice: number | null;
  sales: boolean;
  productDescription: string | null;
}

export interface OrderStats {
  id: number;
  deliveryStatistic: number;
  pickUpStatistic: number;
  totalOrders: number;
  paymentByCard: number;
  paymentByCash: number;
  bonusUsage: number;
  canceledOrderCount: number;
}

export interface FavoritesResponse {
  id: number;
  userId: number;
  productId: number;
  createdAt: string;
  product: ProductResponse;
}

export interface historyProduct {
  productId: number;
  product: ProductResponse;
}

export interface CompanyPage{
  id: number;
  text: string;
}

export interface CompanyPageMutation{
  text: string;
}

export interface BonusProgramPage{
  id: number;
  text: string;
}

export interface BonusProgramPageMutation{
  text: string;
}

export interface DeliveryPage{
  id: number;
  text: string;
  price: string;
  map: string;
  checkoutDeliveryPriceInfo: string;
}

export interface DeliveryPageMutation{
  text: string;
  price: string;
  map: string;
  checkoutDeliveryPriceInfo: string;
}

export interface AdminInfo{
  id: number;
  information: string;
}

export interface AdminInfoMutation{
  information: string;
}

export interface ClientInfo{
  id: number;
  information: string;
}

export interface ClientInfoMutation{
  information: string;
}