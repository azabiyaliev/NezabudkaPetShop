export interface OneCImportDto {
  products?: OneCProductDto[];
  categories?: OneCCategoryDto[];
  brands?: OneCBrandDto[];
}

export interface OneCProductDto {
  productName: string;
  productPhoto: string;
  productPrice: number;
  productDescription?: string;
  existence?: boolean;
  sales?: boolean;
  startDateSales?: string;
  endDateSales?: string;
  promoPercentage?: number;
  promoPrice?: number;
  productComment?: string;
  productWeight?: number;
  productSize?: string;
  productAge?: string;
  productFeedClass?: string;
  productManufacturer?: string;
  brandTitle?: string;
  categoryTitle?: string;
}

export interface OneCCategoryDto {
  title: string;
}

export interface OneCBrandDto {
  title: string;
  logo?: string;
  description?: string;
}
