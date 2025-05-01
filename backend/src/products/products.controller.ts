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
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CreateProductsDto } from '../dto/createProductsDto';
import { TokenAuthGuard } from '../token.auth/token-auth.guard';
import { RolesGuard } from '../token.auth/token.role.guard';
import { Roles } from '../roles/roles.decorator';
import { ImageProcessorService } from '../common/image-processor.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly imageProcessorService: ImageProcessorService,
  ) {}

  @Get('catalog')
  async getProducts(
    @Query('search') searchKeyword: string,
    @Query('brand') brand: number,
  ) {
    return await this.productsService.getAllProducts(
      searchKeyword || '',
      brand || 0,
    );
  }

  @Get('promotional')
  async getPromotionalProducts() {
    return await this.productsService.getPromotionalProducts();
  }

  @Get('selling')
  async getTopSellingProducts() {
    return await this.productsService.getTopSellingProducts();
  }

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
      storage: memoryStorage(),
    }),
  )
  async createProduct(
    @Body() productDto: CreateProductsDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const photoPath = await this.imageProcessorService.convertToWebP(
        file,
        './public/productImg',
        'PRODUCT',
      );
      productDto.productPhoto = photoPath;
    }
    productDto.productPrice = Number(productDto.productPrice);
    productDto.brandId = Number(productDto.brandId);
    productDto.categoryId = Number(productDto.categoryId);
    return await this.productsService.addProduct(productDto);
  }

  //UPDATE PRODUCT ONLY ADMIN
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin')
  @Put('update_product_item/:productId')
  @UseInterceptors(
    FileInterceptor('productPhoto', {
      storage: memoryStorage(),
    }),
  )
  async updateProductItem(
    @Param('productId') productId: string,
    @Body() createProductDto: CreateProductsDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!createProductDto) {
      throw new BadRequestException('Необходимо передать данные продукта');
    }
    if (file) {
      const photoPath = await this.imageProcessorService.convertToWebP(
        file,
        './public/productImg',
        'PRODUCT',
      );
      createProductDto.productPhoto = photoPath;
    }
    return await this.productsService.changeProductInfo(
      Number(productId),
      createProductDto,
    );
  }

  //DELETE PRODUCT ONLY ADMIN
  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin', 'superAdmin')
  @Delete(':productId')
  async deleteProduct(@Param('productId') productId: string) {
    return await this.productsService.deleteProduct(Number(productId));
  }

  @Get('categoryId/:id')
  async getProductByCategory(@Param('id') categoryId: string) {
    return await this.productsService.getBrandsByCategoryId(Number(categoryId));
  }

  @Get('productsByCategory/:id')
  async getProductsByCategory(@Param('id') id: string, @Query() filters: any) {
    // Если есть параметры фильтрации, используем метод getFilteredProducts
    if (Object.keys(filters).length > 0) {
      return this.productsService.getFilteredProducts(parseInt(id), filters);
    }

    // Иначе используем существующий метод
    return this.productsService.getProductsByCategoryId(parseInt(id));
  }

  @Get('categories/:categoryId/filter-options')
  async getCategoryFilterOptions(@Param('categoryId') categoryId: string) {
    return this.productsService.getCategoryFilterOptions(parseInt(categoryId));
  }

  @Post('filter/all')
  async filterAllProducts(@Body() filters: any) {
    return await this.productsService.getFilteredProducts(undefined, filters);
  }
}
