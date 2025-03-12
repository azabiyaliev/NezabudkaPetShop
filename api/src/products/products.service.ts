import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductsDto } from './dto/createProductsDto';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  //FOR ADMIN/USER
  async getAllProducts() {
    try {
      const products = await this.prismaService.products.findMany();
      return products || [];
    } catch (e) {
      console.log(e);
    }
  }

  //FOR ADMIN
  async addProduct(createProductsDto: CreateProductsDto) {
    const {
      productName,
      productDescription,
      productPhoto,
      productPrice,
      existence,
      sales,
      Brand,
    } = createProductsDto;
    try {
      const newProduct = await this.prismaService.products.create({
        data: {
          productName,
          productPhoto,
          productDescription,
          Brand,
          productPrice: Number(productPrice),
          sales,
          existence,
        },
      });
      return newProduct;
    } catch (e) {
      console.log({
        message: 'Не удалось добавить товар в каталог товаров',
        e,
      });
    }
  }

  //FOR ADMIN/USER
  async getProductById(id: string) {
    try {
      const oneProduct = await this.prismaService.products.findUnique({
        where: {
          id,
        },
      });
      if (!oneProduct) {
        throw new BadRequestException('Товар не найден');
      }
      return oneProduct;
    } catch (e) {
      console.log({
        message: 'Получение одного товара не удалось',
        e,
      });
    }
  }

  //FOR ADMIN
  async changeProductInfo(
    id: string,
    {
      productName,
      productDescription,
      productPrice,
      productPhoto,
      Brand,
      existence,
      sales,
    }: CreateProductsDto,
  ) {
    try {
      const changedProduct = await this.prismaService.products.update({
        where: {
          id,
        },
        data: {
          productName,
          productDescription,
          productPrice,
          productPhoto,
          Brand,
          existence,
          sales,
        },
      });
      if (!changedProduct) {
        throw new BadRequestException('Продукт не найден');
      }
      return changedProduct;
    } catch (e) {
      console.log({
        message: 'Редактирование товара не было записано',
        e,
      });
    }
  }

  //FOR ADMIN
  async deleteProduct(id: string) {
    try {
      await this.prismaService.products.delete({
        where: {
          id,
        },
      });
      return { message: 'Товар был успешно удалён!' };
    } catch (e) {
      console.log({ message: 'Не удалось удалить товар', e });
    }
  }
}
