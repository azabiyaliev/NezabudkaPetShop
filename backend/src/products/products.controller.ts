import {
  BadRequestException,
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

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //GET ALL PRODUCTS
  @Get('catalog')
  async getProducts(
    @Query('search') searchKeyword: string,
    @Query('brand') brand: number,
  ) {
    return await this.productsService.getAllProducts(searchKeyword, brand);
  }

  //GET ONE BY ID
  @Get(':id')
  async getOneProduct(@Param('id') id: string) {
    return await this.productsService.getProductById(Number(id));
  }

  @Get('/edit/:id')
  async getOneProductForEdit(@Param('id') id: string) {
    return await this.productsService.getOneProductForEdit(Number(id));
  }

  //CREATE PRODUCT ONLY ADMIN
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin')
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
  async updateProductItem(
    @Param('productId') productId: string,
    @Body() createProductDto: CreateProductsDto,
  ) {
    if (!createProductDto) {
      throw new BadRequestException('Необходимо передать данные продукта');
    }
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
    return await this.productsService.getBrandsByCategoryId(Number(categoryId));
  }
}
