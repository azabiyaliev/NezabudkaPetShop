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
    await this.prisma.products.deleteMany({});
    await this.prisma.siteEdition.deleteMany({});
    await this.prisma.photoByCarousel.deleteMany({});
    await this.prisma.brand.deleteMany({});
    await this.prisma.category.deleteMany({});
    await this.prisma.orderItem.deleteMany({});
    await this.prisma.companyPages.deleteMany({});

    const password = await bcrypt.hash('123', 10);

    await this.prisma.user.createMany({
      data: [
        {
          email: 'superAdmin@gmail.com',
          password: password,
          token: randomUUID(),
          firstName: 'Super',
          secondName: 'Admin',
          role: 'superAdmin',
          phone: '+996555100333',
          isProtected: true,
        },
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
        instagram: 'https://www.instagram.com/nezabudka.zoo/',
        whatsapp: 'https://api.whatsapp.com/send?phone=99655533889',
        schedule: '10:00-20:00',
        address: 'г. Бишкек, Гоголя 127',
        email: 'nezabudka.zoo@gmial.com',
        phone: '+(996)500-430-481',
        linkAddress: 'https://go.2gis.com/ZA3mL',
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
          logo: '/fixtures/Brands/avz.png',
          description:
            'НВЦ Агроветзащита был основан в 1993 году. Вот уже более 20 лет компания занимается разработкой, производством и продажей ветеринарных препаратов для сельскохозяйственных животных и птицы, для домашних животных, рептилий, декоративных птиц, грызунов, лошадей и товарной рыбы.',
        },
        {
          id: 2,
          title: 'BAYER',
          logo: '/fixtures/Brands/bayer.png',
          description:
            'Bayer – продукция, которая создана для оздоровления домашних животных. Компания выпускает эффективные препараты, отличное качество которых контролируется в каждой товарной партии. Особое внимание уделяется совершенствованию проверенных решений, своевременному выпуску новинок с лучшими потребительскими параметрами. В ассортименте представлены следующие группы защитных продуктов: средства от клещей, блох, иных наружных паразитов, разносчиков заболеваний; средства от гельминтов и других внутренних паразитов; комплексные средства; антибактериальные препараты. Все продукты Bayer при правильном применении совершенно безвредны для домашних любимцев и людей.',
        },
        {
          id: 3,
          title: 'Catchow',
          logo: '/fixtures/Brands/catchow_logofina.jpg',
          description: null,
        },
        {
          id: 4,
          title: 'Dog-Chow',
          logo: '/fixtures/Brands/dog-chow-logo.png',
          description: null,
        },
        {
          id: 5,
          title: 'Flexi',
          logo: '/fixtures/Brands/flexi-logo.png',
          description: null,
        },
        {
          id: 6,
          title: 'Friskies',
          logo: '/fixtures/Brands/friskies.png',
          description: null,
        },
        {
          id: 7,
          title: 'Gourmet',
          logo: '/fixtures/Brands/gourmet.png',
          description: null,
        },
        {
          id: 8,
          title: 'Happy Сat',
          logo: '/fixtures/Brands/happy-cat.png',
          description: null,
        },
        {
          id: 9,
          title: 'Happy Dog',
          logo: '/fixtures/Brands/happy-dog.png',
          description: null,
        },
        {
          id: 10,
          title: 'Purina Pro Plan',
          logo: '/fixtures/Brands/proplan.png',
          description: null,
        },
      ],
    });
    await this.prisma.category.createMany({
      data: [
        { id: 1, title: 'Собаки' },
        { id: 2, title: 'Кошки' },
        { id: 3, title: 'Другие питомцы' },
      ],
    });
    await this.prisma.category.createMany({
      data: [
        { id: 111, title: 'Сухой корм', parentId: 1 },
        { id: 112, title: 'Влажные корма', parentId: 1 },
        { id: 113, title: 'Сухие корма', parentId: 2 },
        { id: 114, title: 'Влажные корм', parentId: 2 },
        { id: 115, title: 'Амуниция', parentId: 1 },
        { id: 116, title: 'Ветеринарная аптека', parentId: 2 },
        { id: 117, title: 'Витамины и добавки', parentId: 1 },
        { id: 118, title: 'Домики и лежанки', parentId: 1 },
        { id: 119, title: 'Ошейники и шлейки', parentId: 2 },
        { id: 120, title: 'Лакомства', parentId: 1 },
        { id: 121, title: 'Игрушки', parentId: 2 },
        { id: 122, title: 'Сено', parentId: 3 },
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
          productPhoto: '/fixtures/products/dog_food.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Сухой корм для кошек',
          productPrice: 1200,
          productDescription: 'Качественный сухой корм для кошек.',
          brandId: 1,
          categoryId: 2,
          productPhoto: '/fixtures/products/dog_food.jpg',
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
          productPhoto: '/fixtures/products/dog_food.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Игрушка для собак',
          productPrice: 2500,
          productDescription: 'Прочная когтеточка для развлечения вашей кошки.',
          brandId: 2,
          categoryId: 1,
          productPhoto: '/fixtures/products/cat_scratcher.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Когтеточка для кошек',
          productPrice: 2500,
          productDescription: 'Прочная когтеточка для развлечения вашей кошки.',
          brandId: 2,
          categoryId: 2,
          productPhoto: '/fixtures/products/cat_scratcher.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Ошейник',
          productPrice: 2500,
          productDescription: 'Прочная когтеточка для развлечения вашей кошки.',
          brandId: 2,
          categoryId: 2,
          productPhoto: '/fixtures/products/cat_scratcher.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Клетка для птиц',
          productPrice: 4500,
          productDescription: 'Просторная и удобная клетка для мелких птиц.',
          brandId: 3,
          categoryId: 3,
          productPhoto: '/fixtures/products/bird_cage.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Фильтр для аквариума',
          productPrice: 1800,
          productDescription:
            'Мощный фильтр для чистой и прозрачной воды в аквариуме.',
          brandId: 4,
          categoryId: 3,
          productPhoto: '/fixtures/products/aquarium_filter.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Кормушка для сена для кроликов',
          productPrice: 900,
          productDescription:
            'Удобная кормушка для сена для кроликов и мелких грызунов.',
          brandId: 5,
          categoryId: 3,
          productPhoto: '/fixtures/products/rabbit_feeder.jpg',
          existence: false,
          sales: false,
        },
      ],
    });
    await this.prisma.companyPages.createMany({
      data: {
        text:
          'С 2008 года магазин зоотоваров "Незабудка" радует своих клиентов и их питомцев. Теперь Мы вышли в онлайн и готовы предложить один самых широких ассортиментов зоотоваров в Бишкеке на доставку.\n' +
          'В ассортименте Вы найдете корма всех классов, одежду,игрушки, лакомства, ветеринарные препараты для кошек и собак. Так же в ассортименте есть корма и атрибутика для птиц и мелких грызунов.',
      },
    });
  }
}
