import { IsOptional } from 'class-validator';

export class CartDto {
  @IsOptional()
  userId?: number;

  @IsOptional()
  anonymousCartId?: string;
}
