import { Request } from 'express';
import { User } from '@prisma/client';

export interface AuthRequest extends Request {
  user: User;
  cookies: {
    token?: string;
  };
}

export interface RequestUser {
  id: number;
}

export interface ProductData {
  productName: string;
  productPrice: number;
  productDescription: string;
  brandId: number;
  productPhoto: string;
  existence: boolean;
  sales: boolean;
  productWeight: number;
  productManufacturer: string;
  productAge: string;
  startDateSales?: Date;
  endDateSales?: Date;
  promoPrice?: number;
  promoPercentage?: number;
  orderedProductsStats?: number;
}

export interface RawProduct {
  productName: string;
  productPhoto?: string;
  productPrice: number;
  productDescription?: string;
  brandTitle?: string | null;
  categoryTitle?: string | null;
  existence?: boolean;
  sales?: boolean;
  promoPercentage?: number | null;
  promoPrice?: number | null;
  productComment?: string;
  productWeight?: number | null;
  productSize?: string | null;
  productAge?: string | null;
  productFeedClass?: string | null;
  productManufacturer?: string | null;
  startDateSales?: string;
  endDateSales?: string;
}
