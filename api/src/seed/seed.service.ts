import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(private prisma: PrismaService) {}

  async seed() {
    await this.prisma.user.deleteMany({});
    await this.prisma.brand.deleteMany({});

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
          title: 'AVZ',
          logo: '/fixtures/brands/avz.png',
        },
        {
          title: 'BAYER',
          logo: '/fixtures/brands/bayer.png',
        },
        {
          title: 'Catchow',
          logo: '/fixtures/brands/catchow_logofina.jpg',
        },
        {
          title: 'Dog-Chow',
          logo: '/fixtures/brands/dog-chow-logo.png',
        },
        {
          title: 'Flexi',
          logo: '/fixtures/brands/flexi-logo.png',
        },
        {
          title: 'Friskies',
          logo: '/fixtures/brands/friskies.png',
        },
        {
          title: 'Gourmet',
          logo: '/fixtures/brands/gourmet.png',
        },
        {
          title: 'Happy-cat',
          logo: '/fixtures/brands/happy-cat.png',
        },
        {
          title: 'Happy-dog',
          logo: '/fixtures/brands/happy-dog.png',
        },
        {
          title: 'Proplan',
          logo: '/fixtures/brands/proplan.png',
        },
      ],
    });
    await this.prisma.products.create({
      data: {
        productName: 'test',
        productDescription: 'testttste',
        productPrice: 555,
        productPhoto: './assets/images/product.png',
      },
    });
    await this.prisma.category.create({
      data: {
        title: 'test',
      },
    });
    await this.prisma.orderItem.create({
      data: {
        quantity: 2,
        createdAt: new Date(),
      },
    });
    await this.prisma.brand.create({
      data: {
        title: 'testrwrw',
        logo: './assets/images/logo.png',
      },
    });
  }
}
