import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Roles } from '../roles/roles.decorator';
import { CreateProductsDto } from '../dto/createProductsDto';
import { RolesGuard } from '../token.auth/token.role.guard';
import { TokenAuthGuard } from '../token.auth/token-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductQueryDto } from './dto/querySearchDto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //GET ALL PRODUCTS
  @Get('catalog')
  async getProducts(@Query() query: ProductQueryDto) {
    return await this.productsService.getAllProducts(query);
  }

  //GET ONE BY ID
  @Get(':id')
  async getOneProduct(@Param('id') id: string) {
    return await this.productsService.getProductById(Number(id));
  }

  //CREATE PRODUCT ONLY ADMIN
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('create')
  @UseInterceptors(
    FileInterceptor('productPhoto', {
      storage: diskStorage({
        destination: './public/productImg',
        filename: (_req, file, callback) => {
          const imageFormat = extname(file.originalname);
          callback(null, `${crypto.randomUUID()}${imageFormat}`);
        },
      }),
    }),
  )
  async createProduct(
    @Body() productDto: CreateProductsDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file && file.filename) {
      productDto.productPhoto = '/productImg/' + file.filename;
    }
    productDto.productPrice = Number(productDto.productPrice);
    productDto.brandId = Number(productDto.brandId);
    productDto.categoryId = Number(productDto.categoryId);
    return await this.productsService.addProduct(productDto);
  }

  //UPDATE PRODUCT ONLY ADMIN
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('update_product_item/:productId')
  async updateProductItem(
    @Param('productId') productId: string,
    @Body() createProductDto: CreateProductsDto,
  ) {
    return await this.productsService.changeProductInfo(
      Number(productId),
      createProductDto,
    );
  }

  //DELETE PRODUCT ONLY ADMIN
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':productId')
  async deleteProduct(@Param('productId') productId: string) {
    return await this.productsService.deleteProduct(Number(productId));
  }

  @Get('categoryId/:id')
  async getProductByCategory(@Param('id') categoryId: string) {
    return await this.productsService.getBrandsByCategoryId(
      Number(categoryId),
    );
  }
}
