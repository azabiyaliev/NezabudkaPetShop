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
  categoryId: number;
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
