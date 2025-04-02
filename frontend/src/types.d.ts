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

///  productName        String  @map("product_name")
//   productPhoto       String  @map("product_photo")
//   productPrice       Int     @map("product_price")
//   productDescription String  @map("product_description")
//   productComment     String? @map("product_comment")
//
//   existence Boolean @default(true)
//   sales     Boolean @default(false)
//
//   orderItem  OrderItem[]
//   brandId    Int?        @map("brand_id")
//   brand      Brand?      @relation(fields: [brandId], references: [id])
//   categoryId Int?        @map("category_id")
//   category   Category?   @relation(fields: [categoryId], references: [id])
//
//   reviews Review[]
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

