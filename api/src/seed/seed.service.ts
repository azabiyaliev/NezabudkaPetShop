import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(private prisma: PrismaService) {}

  async seed() {
    await this.prisma.passwordReset.deleteMany();
    await this.prisma.user.deleteMany({});
    await this.prisma.customerCart.deleteMany({});
    await this.prisma.products.deleteMany({});
    await this.prisma.siteEdition.deleteMany({});
    await this.prisma.photoByCarousel.deleteMany({});
    await this.prisma.brand.deleteMany({});
    await this.prisma.category.deleteMany({});
    await this.prisma.orderItem.deleteMany({});

    const password = await bcrypt.hash('123', 10);

    await this.prisma.user.createMany({
      data: [
        {
          email: 'kama@gmail.com',
          password: password,
          token: randomUUID(),
          firstName: 'Saha',
          secondName: 'Bekov',
          role: 'admin',
          phone: '+996555100222',
        },
        {
          email: 'mirana@gmail.com',
          password: password,
          token: randomUUID(),
          firstName: 'Saha',
          secondName: 'Bekov',
          role: 'client',
          phone: '+996555100444',
        },
      ],
    });

    await this.prisma.siteEdition.create({
      data: {
        instagram: 'nezabudka.zoo',
        whatsapp: '+(996)500-430-481',
        schedule: '10:00-20:00',
        address: 'г. Бишкек, Гоголя 127',
        email: 'nezabudka.zoo@gmial.com',
        phone: '+(996)500-430-481',
      },
    });

    await this.prisma.photoByCarousel.createMany({
      data: [
        {
          photo: '/fixtures/editionSitePhoto/photo1.jpg',
          link: 'https://example.com/photo1.jpg',
          order: 1,
        },
        {
          photo: '/fixtures/editionSitePhoto/photo2.jpg',
          link: 'https://example.com/photo2.jpg',
          order: 2,
        },
        {
          photo: '/fixtures/editionSitePhoto/photo2.jpg',
          link: 'https://example.com/photo3.jpg',
          order: 3,
        },
        {
          photo: '/fixtures/editionSitePhoto/photo4.jpg',
          link: 'https://example.com/photo3.jpg',
          order: 3,
        },
        {
          photo: '/fixtures/editionSitePhoto/photo5.jpg',
          link: 'https://example.com/photo3.jpg',
          order: 3,
        },
      ],
    });

    await this.prisma.brand.createMany({
      data: [
        {
          id: 1,
          title: 'AVZ',
          logo: '/fixtures/brands/avz.png',
        },
        {
          id: 2,
          title: 'BAYER',
          logo: '/fixtures/brands/bayer.png',
        },
        {
          id: 3,
          title: 'Catchow',
          logo: '/fixtures/brands/catchow_logofina.jpg',
        },
        {
          id: 4,
          title: 'Dog-Chow',
          logo: '/fixtures/brands/dog-chow-logo.png',
        },
        {
          id: 5,
          title: 'Flexi',
          logo: '/fixtures/brands/flexi-logo.png',
        },
        {
          id: 6,
          title: 'Friskies',
          logo: '/fixtures/brands/friskies.png',
        },
        {
          id: 7,
          title: 'Gourmet',
          logo: '/fixtures/brands/gourmet.png',
        },
        {
          id: 8,
          title: 'Happy-cat',
          logo: '/fixtures/brands/happy-cat.png',
        },
        {
          id: 9,
          title: 'Happy-dog',
          logo: '/fixtures/brands/happy-dog.png',
        },
        {
          id: 10,
          title: 'Proplan',
          logo: '/fixtures/brands/proplan.png',
        },
      ],
    });
    await this.prisma.category.createMany({
      data: [
        {
          id: 1,
          title: 'Собаки',
        },
        {
          id: 22,
          title: 'Сухой корм',
          parentId: 1,
        },
        {
          id: 23,
          title: 'Влажные корма',
          parentId: 1,
        },
        {
          id: 2,
          title: 'Кошки',
        },
        {
          id: 25,
          title: 'Сухие корма',
          parentId: 2,
        },
        {
          id: 26,
          title: 'Влажные корм',
          parentId: 2,
        },
        {
          id: 3,
          title: 'Птицы',
        },
        {
          id: 4,
          title: 'Кролики',
        },
        {
          id: 5,
          title: 'Рыбы',
        },
        {
          id: 6,
          title: 'Драконы',
        },
      ],
    });
    await this.prisma.products.createMany({
      data: [
        {
          productName: 'Сухой корм для собак',
          productPrice: 1200,
          productDescription: 'Качественный сухой корм для взрослых собак.',
          brandId: 1,
          categoryId: 1,
          productPhoto: './fixtures/products/dog_food.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Сухой корм',
          productPrice: 1200,
          productDescription: 'Качественный сухой корм для взрослых собак.',
          brandId: 1,
          categoryId: 22,
          productPhoto: './fixtures/products/dog_food.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Щебень для собак',
          productPrice: 1200,
          productDescription: 'Качественный сухой корм для взрослых собак.',
          brandId: 1,
          categoryId: 23,
          productPhoto: './fixtures/products/dog_food.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Игрушка для собак',
          productPrice: 2500,
          productDescription: 'Прочная когтеточка для развлечения вашей кошки.',
          brandId: 2,
          categoryId: 25,
          productPhoto: './fixtures/products/cat_scratcher.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Когтеточка для кошек',
          productPrice: 2500,
          productDescription: 'Прочная когтеточка для развлечения вашей кошки.',
          brandId: 2,
          categoryId: 25,
          productPhoto: './fixtures/products/cat_scratcher.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Ошейник',
          productPrice: 2500,
          productDescription: 'Прочная когтеточка для развлечения вашей кошки.',
          brandId: 2,
          categoryId: 26,
          productPhoto: './fixtures/products/cat_scratcher.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Клетка для птиц',
          productPrice: 4500,
          productDescription: 'Просторная и удобная клетка для мелких птиц.',
          brandId: 3,
          categoryId: 3,
          productPhoto: './fixtures/products/bird_cage.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Фильтр для аквариума',
          productPrice: 1800,
          productDescription:
            'Мощный фильтр для чистой и прозрачной воды в аквариуме.',
          brandId: 4,
          categoryId: 5,
          productPhoto: './fixtures/products/aquarium_filter.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Кормушка для сена для кроликов',
          productPrice: 900,
          productDescription:
            'Удобная кормушка для сена для кроликов и мелких грызунов.',
          brandId: 5,
          categoryId: 4,
          productPhoto: './fixtures/products/rabbit_feeder.jpg',
          existence: false,
          sales: false,
        },
      ],
    });
    await this.prisma.orderItem.create({
      data: {
        quantity: 2,
        createdAt: new Date(),
      },
    });
  }
}
