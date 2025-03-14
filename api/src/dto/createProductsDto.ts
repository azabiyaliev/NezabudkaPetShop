export class CreateProductsDto {
  productName!: string;
  productPhoto!: string;
  productPrice!: number;
  Brand!: string;
  productDescription!: string;

  existence!: boolean;
  sales!: boolean;
}
