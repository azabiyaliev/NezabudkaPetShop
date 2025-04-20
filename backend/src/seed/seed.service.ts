import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(private prisma: PrismaService) {}

  async seed() {
    await this.prisma.cart.deleteMany({});
    await this.prisma.cartItem.deleteMany({});
    await this.prisma.favorite.deleteMany({});
    await this.prisma.passwordReset.deleteMany();
    await this.prisma.user.deleteMany({});
    await this.prisma.products.deleteMany({});
    await this.prisma.siteEdition.deleteMany({});
    await this.prisma.photoByCarousel.deleteMany({});
    await this.prisma.brand.deleteMany({});
    await this.prisma.category.deleteMany({});
    await this.prisma.orderItem.deleteMany({});
    await this.prisma.companyPages.deleteMany({});
    await this.prisma.bonusProgramPage.deleteMany({});
    await this.prisma.deliveryPage.deleteMany({});

    const password = await bcrypt.hash('123', 10);
    const users = await Promise.all([
      this.prisma.user.create({
        data: {
          email: 'superAdmin@gmail.com',
          password: password,
          token: randomUUID(),
          firstName: 'Super',
          secondName: 'Admin',
          role: 'superAdmin',
          phone: '+996555100333',
          isProtected: true,
        },
      }),
      this.prisma.user.create({
        data: {
          email: 'kama@gmail.com',
          password: password,
          token: randomUUID(),
          firstName: 'Saha',
          secondName: 'Bekov',
          role: 'admin',
          phone: '+996555100222',
        },
      }),
      this.prisma.user.create({
        data: {
          email: 'igor@gmail.com',
          password: password,
          token: randomUUID(),
          firstName: 'Igor',
          secondName: 'Blinov',
          role: 'admin',
          phone: '+996555100700',
        },
      }),
      this.prisma.user.create({
        data: {
          email: 'mirana@gmail.com',
          password: password,
          token: randomUUID(),
          firstName: 'Saha',
          secondName: 'Bekov',
          role: 'client',
          phone: '+996555100444',
        },
      }),
      this.prisma.user.create({
        data: {
          email: 'ilon@gmail.com',
          password: password,
          token: randomUUID(),
          firstName: 'Ilon',
          secondName: 'Mask',
          role: 'client',
          phone: '+996555100555',
        },
      }),
      this.prisma.user.create({
        data: {
          email: 'michael@gmail.com',
          password: password,
          token: randomUUID(),
          firstName: 'Michael',
          secondName: 'Jackson',
          role: 'client',
          phone: '+996555444444',
        },
      }),
      this.prisma.user.create({
        data: {
          email: 'cristiano@gmail.com',
          password: password,
          token: randomUUID(),
          firstName: 'Cristiano',
          secondName: 'Ronaldo',
          role: 'client',
          phone: '+996555555555',
        },
      }),
    ]);

    const [, , , miranaClient, ilonClient, michaelClient, cristianoClient] =
      users;

    await this.prisma.siteEdition.create({
      data: {
        instagram: 'https://www.instagram.com/nezabudka.zoo/',
        whatsapp: 'https://api.whatsapp.com/send?phone=99655533889',
        schedule: '10:00-20:00',
        address: 'г. Бишкек, Гоголя 127',
        email: 'nezabudka.zoo@gmail.com',
        phone: '+(996)500-430-481',
        linkAddress: 'https://go.2gis.com/ZA3mL',
        mapGoogleLink:
          'https://www.google.com/maps/d/u/0/embed?mid=13x6QctVrCI831zyl84NAk4f4rI6LUDI&usp=sharing',
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

    const brands = await Promise.all([
      this.prisma.brand.create({
        data: {
          title: 'AVZ',
          logo: '/fixtures/Brands/avz.png',
          description:
            'НВЦ Агроветзащита был основан в 1993 году. Вот уже более 20 лет компания занимается разработкой, производством и продажей ветеринарных препаратов...',
        },
      }),
      this.prisma.brand.create({
        data: {
          title: 'BAYER',
          logo: '/fixtures/Brands/bayer.png',
          description:
            'Bayer – продукция, которая создана для оздоровления домашних животных. Компания выпускает эффективные препараты...',
        },
      }),
      this.prisma.brand.create({
        data: {
          title: 'Catchow',
          logo: '/fixtures/Brands/catchow_logofina.jpg',
          description: null,
        },
      }),
      this.prisma.brand.create({
        data: {
          title: 'Dog-Chow',
          logo: '/fixtures/Brands/dog-chow-logo.png',
          description: null,
        },
      }),
      this.prisma.brand.create({
        data: {
          title: 'Flexi',
          logo: '/fixtures/Brands/flexi-logo.png',
          description: null,
        },
      }),
      this.prisma.brand.create({
        data: {
          title: 'Friskies',
          logo: '/fixtures/Brands/friskies.png',
          description: null,
        },
      }),
      this.prisma.brand.create({
        data: {
          title: 'Gourmet',
          logo: '/fixtures/Brands/gourmet.png',
          description: null,
        },
      }),
      this.prisma.brand.create({
        data: {
          title: 'Happy Сat',
          logo: '/fixtures/Brands/happy-cat.png',
          description: null,
        },
      }),
      this.prisma.brand.create({
        data: {
          title: 'Happy Dog',
          logo: '/fixtures/Brands/happy-dog.png',
          description: null,
        },
      }),
      this.prisma.brand.create({
        data: {
          title: 'Purina Pro Plan',
          logo: '/fixtures/Brands/proplan.png',
          description: null,
        },
      }),
    ]);

    const [
      avz,
      bayer,
      catchHow,
      dogShow,
      flexi,
      friskies,
      gourmet,
      happyCat,
      happyDog,
      purinaProPlan,
    ] = brands;

    const category = await Promise.all([
      this.prisma.category.create({ data: { title: 'Собаки' } }),
      this.prisma.category.create({ data: { title: 'Кошки' } }),
      this.prisma.category.create({ data: { title: 'Другие питомцы' } }),
    ]);

    const [dogs, cats, others] = category;

    const subCategory = await Promise.all([
      this.prisma.category.create({
        data: {
          title: 'Сухой корм',
          parentId: dogs.id,
          icon: '/fixtures/categoryIcons/1icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Влажные корма',
          parentId: dogs.id,
          icon: '/fixtures/categoryIcons/2icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Сухие корма',
          parentId: cats.id,
          icon: '/fixtures/categoryIcons/3icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Влажные корм',
          parentId: cats.id,
          icon: '/fixtures/categoryIcons/4icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Амуниция',
          parentId: dogs.id,
          icon: '/fixtures/categoryIcons/5icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Ветеринарная аптека',
          parentId: cats.id,
          icon: '/fixtures/categoryIcons/2icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Витамины и добавки',
          parentId: dogs.id,
          icon: '/fixtures/categoryIcons/7icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Домики и лежанки',
          parentId: dogs.id,
          icon: '/fixtures/categoryIcons/8icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Ошейники и шлейки',
          parentId: cats.id,
          icon: '/fixtures/categoryIcons/9icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Лакомства',
          parentId: dogs.id,
          icon: '/fixtures/categoryIcons/1icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Игрушки',
          parentId: cats.id,
          icon: '/fixtures/categoryIcons/9icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Сено',
          parentId: others.id,
          icon: '/fixtures/categoryIcons/1icon.png',
        },
      }),
    ]);

    const [
      dryDogFood,
      wetDogFood,
      dryCatFood,
      wetCatFood,
      ammunition,
      vetPharmacy,
      vitamins,
      beds,
      collars,
      treats,
      toys,
      hay,
    ] = subCategory;

    await this.prisma.products.createMany({
      data: [
        {
          productName: 'Сухой корм для собак',
          productPrice: 1200,
          productDescription: 'Качественный сухой корм для взрослых собак.',
          brandId: avz.id,
          categoryId: dryDogFood.id,
          productPhoto: '/fixtures/products/dog_food.jpg',
          existence: true,
          sales: false,
        },
        {
          productName: 'Сухой корм для кошек',
          productPrice: 1200,
          productDescription: 'Качественный сухой корм для кошек.',
          brandId: bayer.id,
          categoryId: wetDogFood.id,
          productPhoto: '/fixtures/products/dog_food.jpg',
          existence: true,
          sales: false,
        },
        {
          productName: 'Щебень для собак',
          productPrice: 1200,
          productDescription:
            'Щебень для создания ландшафтных решений для собак.',
          brandId: catchHow.id,
          categoryId: dryCatFood.id,
          productPhoto: '/fixtures/products/dog_food.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Игрушка для собак',
          productPrice: 2500,
          productDescription: 'Прочная когтеточка для развлечения вашей кошки.',
          brandId: dogShow.id,
          categoryId: wetCatFood.id,
          productPhoto: '/fixtures/products/cat_scratcher.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Когтеточка для кошек',
          productPrice: 2500,
          productDescription: 'Прочная когтеточка для развлечения вашей кошки.',
          brandId: flexi.id,
          categoryId: ammunition.id,
          productPhoto: '/fixtures/products/cat_scratcher.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Ошейник',
          productPrice: 2500,
          productDescription: 'Прочная когтеточка для развлечения вашей кошки.',
          brandId: friskies.id,
          categoryId: vetPharmacy.id,
          productPhoto: '/fixtures/products/cat_scratcher.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Клетка для птиц',
          productPrice: 4500,
          productDescription: 'Просторная и удобная клетка для мелких птиц.',
          brandId: gourmet.id,
          categoryId: vetPharmacy.id,
          productPhoto: '/fixtures/products/bird_cage.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Фильтр для аквариума',
          productPrice: 1800,
          productDescription:
            'Мощный фильтр для чистой и прозрачной воды в аквариуме.',
          brandId: happyCat.id,
          categoryId: vitamins.id,
          productPhoto: '/fixtures/products/aquarium_filter.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Кормушка для сена для кроликов',
          productPrice: 900,
          productDescription:
            'Удобная кормушка для сена для кроликов и мелких грызунов.',
          brandId: happyDog.id,
          categoryId: beds.id,
          productPhoto: '/fixtures/products/rabbit_feeder.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Кормушка для сена для драконов',
          productPrice: 500,
          productDescription:
            'Удобная кормушка для сена для кроликов и мелких грызунов.',
          brandId: purinaProPlan.id,
          categoryId: collars.id,
          productPhoto: '/fixtures/products/rabbit_feeder.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Лакомства для драконов',
          productPrice: 500,
          productDescription:
            'Удобная кормушка для сена для кроликов и мелких грызунов.',
          brandId: purinaProPlan.id,
          categoryId: treats.id,
          productPhoto: '/fixtures/products/rabbit_feeder.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Игрушка для драконов',
          productPrice: 500,
          productDescription:
            'Удобная игрушка для сена для кроликов и мелких грызунов.',
          brandId: purinaProPlan.id,
          categoryId: toys.id,
          productPhoto: '/fixtures/products/rabbit_feeder.jpg',
          existence: false,
          sales: false,
        },
        {
          productName: 'Сена для драконов',
          productPrice: 500,
          productDescription:
            'Удобная кормушка для сена для кроликов и мелких грызунов.',
          brandId: purinaProPlan.id,
          categoryId: hay.id,
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
    await this.prisma.bonusProgramPage.createMany({
      data: [
        {
          text: `Бонусная программа:
За каждый оформленный заказ клиент получает бонусы, которые может в будущем потратить на оплату заказа.
За каждые потраченные 100 сом человек получает 1 бонус.
1 бонус равен 1 реальному сому.`,
        },
      ],
    });
    await this.prisma.deliveryPage.createMany({
      data: [
        {
          text: `Условия доставки
Приём заявок и доставка осуществляется ежедневно с 10.00 до 18.00

Заявка, принятая до 14.00, доставляется в этот же день.

Заявка, принятая после 14.00, доставляется на следующий день.

Наш оператор предварительно свяжется с Вами для уточнения деталей заказа и согласования времени доставки.

Просим обратить внимание что в связи с большим объемом заказов и появлением большого количества лифтов с чипами для оперативности развозки доставка осуществляется только до адреса получателя (дома). Без поднятия на этаж.

Подъем на этаж только  по индивидуальному согласованию непосредтвенно с курьером.
`,
          price:
            'Оплата\n' +
            'Оплата осуществляется наличными курьеру при доставке заказа, а так же посредством интернет-банкинга систем Банк Кыргызстан, Optima Bank, Demir Bank.\n' +
            '\n' +
            'Зоны доставки\n' +
            'Стоимость доставки фиксированная на следующие зоны:\n' +
            '\n' +
            '250 сом – на заказы до 1000 сом   \n' +
            '200 сом –  на заказы от 1000 сом до 2000 сом\n' +
            '\n' +
            '150 сом – на заказы от 2000 до 3000 сом\n' +
            '\n' +
            '100 сом – на заказы от 3000 до 3500 сом\n' +
            'Бесплатно –  на заказы от 3500 сом\n' +
            '\n' +
            '200 сом 250 сом 500 сом',
          map: 'https://www.google.com/maps/d/u/0/embed?mid=1G9bEPWjGTG9-GRPK14b78rv1mUoLvkE',
        },
      ],
    });
  }
}
