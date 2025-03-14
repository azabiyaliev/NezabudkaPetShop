import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductsDto } from '../dto/createProductsDto';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  //FOR ADMIN/USER
  async getAllProducts() {
    const products = await this.prismaService.products.findMany();
    return products || [];
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
    if (!newProduct) {
      throw new BadRequestException({
        message: 'Не удалось добавить товар в каталог товаров',
      });
    }
    return newProduct;
  }

  //FOR ADMIN/USER
  async getProductById(id: string) {
    const oneProduct = await this.prismaService.products.findUnique({
      where: {
        id,
      },
    });
    if (!oneProduct) {
      throw new BadRequestException('Товар не найден');
    }
    return oneProduct;
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
    const productId = await this.prismaService.products.findUnique({
      where: {
        id,
      },
    });

    if (!productId) {
      throw new NotFoundException('Товар не найден');
    }

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
  }

  //FOR ADMIN
  async deleteProduct(id: string) {
    const productId = await this.prismaService.products.findUnique({
      where: {
        id,
      },
    });

    if (!productId) {
      throw new NotFoundException('Данный товар не найден');
    }

    await this.prismaService.products.delete({
      where: {
        id,
      },
    });
    return { message: 'Товар был успешно удалён!' };
  }
}
