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
        PhotoByCarousel: {
          create: [
            { photo: '/fixtures/editionSitePhoto/photo1.jpg' },
            { photo: '/fixtures/editionSitePhoto/photo2.jpg' },
            { photo: '/fixtures/editionSitePhoto/photo3.jpg' },
            { photo: '/fixtures/editionSitePhoto/photo4.jpg' },
            { photo: '/fixtures/editionSitePhoto/photo5.jpg' },
          ],
        },
      },
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
          id: 2,
          title: 'Кошки',
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
        {
          id: 111,
          title: 'Сухой корм',
          parentId: 1,
        },
        {
          id: 112,
          title: 'Влажные корма',
          parentId: 1,
        },
        {
          id: 113,
          title: 'Сухие корма',
          parentId: 2,
        },
        {
          id: 114,
          title: 'Влажные корм',
          parentId: 2,
        },
        {
          id: 115,
          title: 'Амуниция',
          parentId: 1,
        },
        {
          id: 116,
          title: 'Ветеринарная аптека',
          parentId: 2,
        },
        {
          id: 117,
          title: 'Витамины и добавки',
          parentId: 1,
        },
        {
          id: 118,
          title: 'Домики и лежанки',
          parentId: 1,
        },
        {
          id: 119,
          title: 'Ошейники и шлейки',
          parentId: 2,
        },
        {
          id: 120,
          title: 'Лакомства',
          parentId: 1,
        },
        {
          id: 121,
          title: 'Игрушки',
          parentId: 2,
        },
        {
          id: 122,
          title: 'Сено',
          parentId: 1,
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
          productName: 'Сухой корм для кошек',
          productPrice: 1200,
          productDescription: 'Качественный сухой корм для кошек.',
          brandId: 1,
          categoryId: 2,
          productPhoto: './fixtures/products/dog_food.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Щебень для собак',
          productPrice: 1200,
          productDescription:
            'Щебень для создания ландшафтных решений для собак.',
          brandId: 1,
          categoryId: 1,
          productPhoto: './fixtures/products/dog_food.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Игрушка для собак',
          productPrice: 2500,
          productDescription: 'Прочная игрушка для развлечения собак.',
          brandId: 2,
          categoryId: 1,
          productPhoto: './fixtures/products/cat_scratcher.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Когтеточка для кошек',
          productPrice: 2500,
          productDescription: 'Прочная когтеточка для кошек.',
          brandId: 2,
          categoryId: 2,
          productPhoto: './fixtures/products/cat_scratcher.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Ошейник для собак',
          productPrice: 2500,
          productDescription: 'Ошейник для собак разных пород.',
          brandId: 2,
          categoryId: 1,
          productPhoto: './fixtures/products/cat_scratcher.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Клетка для птиц',
          productPrice: 4500,
          productDescription: 'Просторная клетка для птиц.',
          brandId: 3,
          categoryId: 3,
          productPhoto: './fixtures/products/bird_cage.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Фильтр для аквариума',
          productPrice: 1800,
          productDescription: 'Фильтр для аквариума.',
          brandId: 4,
          categoryId: 5,
          productPhoto: './fixtures/products/aquarium_filter.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Кормушка для кроликов',
          productPrice: 900,
          productDescription: 'Кормушка для кроликов и мелких животных.',
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
