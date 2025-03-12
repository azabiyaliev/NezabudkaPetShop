import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Roles } from '../roles/roles.decorator';
import { CreateProductsDto } from './dto/createProductsDto';
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
  async getProducts() {
    try {
      const products = await this.productsService.getAllProducts();
      return products;
    } catch (e) {
      console.log(e);
    }
  }

  //GET ONE BY ID
  @Get(':id')
  async getOneProduct(@Param('id') id: string) {
    try {
      const product = await this.productsService.getProductById(id);
      return product;
    } catch (e) {
      console.log(e);
    }
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
    try {
      if (file && file.filename) {
        productDto.productPhoto = '/productImg/' + file.filename;
      }
      productDto.productPrice = Number(productDto.productPrice);
      const newProduct = await this.productsService.addProduct(productDto);
      return newProduct;
    } catch (e) {
      console.log(e);
    }
  }

  //UPDATE PRODUCT ONLY ADMIN
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('update_product_item/:productId')
  async updateProductItem(
    @Param('productId') productId: string,
    @Body() createProductDto: CreateProductsDto,
  ) {
    try {
      const updatedProductItem = await this.productsService.changeProductInfo(
        productId,
        createProductDto,
      );
      return updatedProductItem;
    } catch (e) {
      console.log(e);
    }
  }

  //DELETE PRODUCT ONLY ADMIN
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':productId')
  async deleteProduct(@Param('productId') productId: string) {
    try {
      await this.productsService.deleteProduct(productId);
      return { message: 'Товар был удален успешно' };
    } catch (e) {
      console.log(e);
    }
  }
}
