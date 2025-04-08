import { IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  reviewId!: number;

  @IsString()
  comment!: string;
}
