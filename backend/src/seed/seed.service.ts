import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import {
  DeliveryMethod,
  OrderStatus,
  PaymentMethod,
  Role,
} from '@prisma/client';
import { ProductData } from '../types';

@Injectable()
export class SeedService {
  constructor(private prisma: PrismaService) {}
  async seed() {
    const tablesToClear = [
      'productCategory',
      'cartItem',
      'cart',
      'favorite',
      'passwordReset',
      'user',
      'orderItem',
      'order',
      'statistic',
      'productUpdateHistory',
      'products',
      'siteEdition',
      'photoByCarousel',
      'brand',
      'category',
      'companyPages',
      'bonusProgramPage',
      'deliveryPage',
    ];

    for (const table of tablesToClear) {
      const model = this.prisma[table as keyof typeof this.prisma] as {
        deleteMany: (args: unknown) => Promise<unknown>;
      };
      if (model && typeof model.deleteMany === 'function') {
        await model.deleteMany({});
      }
    }

    const password = await bcrypt.hash('123', 10);

    const userDataArray = [
      {
        email: 'superAdmin@gmail.com',
        firstName: 'Super',
        secondName: 'Admin',
        role: 'superAdmin' as Role,
        phone: '+996555100333',
        isProtected: true,
      },
      {
        email: 'kama@gmail.com',
        firstName: 'Saha',
        secondName: 'Bekov',
        role: 'admin' as Role,
        phone: '+996555100222',
      },
      {
        email: 'igor@gmail.com',
        firstName: 'Igor',
        secondName: 'Blinov',
        role: 'admin' as Role,
        phone: '+996555100700',
      },
    ];

    const firstNames = [
      'Михаил',
      'Александр',
      'Иван',
      'Сергей',
      'Дмитрий',
      'Анна',
      'Елена',
      'Мария',
      'Ольга',
      'Кристина',
    ];
    const lastNames = [
      'Смирнов',
      'Иванов',
      'Петров',
      'Сидоров',
      'Козлов',
      'Морозова',
      'Волкова',
      'Кузнецова',
      'Соколова',
      'Попова',
    ];

    const users = [];

    for (const userData of userDataArray) {
      const user = await this.prisma.user.create({
        data: {
          email: userData.email,
          password: password,
          token: randomUUID(),
          firstName: userData.firstName,
          secondName: userData.secondName,
          role: userData.role,
          phone: userData.phone,
          isProtected: userData.isProtected || false,
        },
      });
      users.push(user);
    }

    for (let i = 0; i < 20; i++) {
      const randomFirstName =
        firstNames[Math.floor(Math.random() * firstNames.length)];
      const randomLastName =
        lastNames[Math.floor(Math.random() * lastNames.length)];
      const randomPhone = `+99655${Math.floor(1000000 + Math.random() * 9000000)}`;
      const randomEmail = `client${i}@gmail.com`;

      const user = await this.prisma.user.create({
        data: {
          email: randomEmail,
          password: password,
          token: randomUUID(),
          firstName: randomFirstName,
          secondName: randomLastName,
          role: 'client' as Role,
          phone: randomPhone,
        },
      });
      users.push(user);
    }

    const clients = users.filter((user) => user.role === 'client');

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
          'https://www.google.com/maps/d/u/0/embed?mid=13x6QctVrCI831zyl84NAk4f4rI6LUDI&ehbc=2E312F&noprof=1',
      },
    });

    const carouselPhotos = [
      {
        photo: '/fixtures/editionSitePhoto/animal1.jpg',
        link: 'https://example.com/photo1.jpg',
        title: 'Купи корм',
        description: 'Лучший выбор кормов для всех пород животных',
      },
      {
        photo: '/fixtures/editionSitePhoto/animal2.jpg',
        link: 'https://example.com/photo2.jpg',
        title: 'Игрушки',
        description: 'Развлечение и забота о вашем любимце каждый день',
      },
      {
        photo: '/fixtures/editionSitePhoto/animal3.jpg',
        link: 'https://example.com/photo3.jpg',
        title: 'Скидки до 50%',
        description: 'Успейте купить всё необходимое по выгодной цене',
      },
      {
        photo: '/fixtures/editionSitePhoto/animal4.jpg',
        link: 'https://example.com/photo4.jpg',
        title: 'Аксессуары',
        description: 'Ошейники, миски, переноски и всё для комфорта',
      },
      {
        photo: '/fixtures/editionSitePhoto/animal5.jpg',
        link: 'https://example.com/photo5.jpg',
        title: 'Уход',
        description: 'Щётки, шампуни и средства для здоровой шерсти',
      },
    ];

    for (let i = 0; i < carouselPhotos.length; i++) {
      await this.prisma.photoByCarousel.create({
        data: {
          photo: carouselPhotos[i].photo,
          link: carouselPhotos[i].link,
          title: carouselPhotos[i].title,
          description: carouselPhotos[i].description,
          order: i + 1,
        },
      });
    }

    const brandNames = [
      'Cosma',
      'James Wellbeloved',
      'BAYER',
      'AVZ',
      'Pedigree',
      'Brit',
      "HILL'S PET NUTRITION",
      'Applaws',
      'ANIMAL ISLAND',
      'Dog-Chow',
      'Gourmet',
      'Happy Сat',
      'Concept for Life',
      'Purizon',
      'Burns',
      'Flexi',
      'Friskies',
      'Purina Pro Plan',
      'Arden Grange',
      'Happy Dog',
      'Jarvi',
      'Catchow',
      'Qushy',
      "Rosie's Farm",
      'ROYAL CANIN',
      'SkogsFRO',
      'Tigerino',
      'Whiskas',
      'WOLF OF WILDERNESS',
      'Мнямс',
    ];

    const logo = [
      '/fixtures/Brands/Cosma.png',
      '/fixtures/Brands/James_Wellbeloved.webp',
      '/fixtures/Brands/bayer.png',
      '/fixtures/Brands/avz.png',
      '/fixtures/Brands/Pedigree.png',
      '/fixtures/Brands/Brit.webp',
      '/fixtures/Brands/Hills.webp',
      '/fixtures/Brands/Applaws.webp',
      '/fixtures/Brands/ANIMAL_ISLAND.jpg',
      '/fixtures/Brands/dog-chow-logo.png',
      '/fixtures/Brands/gourmet.png',
      '/fixtures/Brands/happy-cat.png',
      '/fixtures/Brands/CFL.webp',
      '/fixtures/Brands/purizon.jpg',
      '/fixtures/Brands/Burns.png',
      '/fixtures/Brands/flexi-logo.png',
      '/fixtures/Brands/friskies.png',
      '/fixtures/Brands/proplan.png',
      '/fixtures/Brands/ArdenGrange.webp',
      '/fixtures/Brands/happy-dog.png',
      '/fixtures/Brands/Jarvi.svg',
      '/fixtures/Brands/catchow_logofina.jpg',
      '/fixtures/Brands/Qushy.webp',
      '/fixtures/Brands/RosiesFarm.webp',
      '/fixtures/Brands/ROYAL_CANIN.webp',
      '/fixtures/Brands/SkogsFRO.webp',
      '/fixtures/Brands/Tigerino.jpg',
      '/fixtures/Brands/Whiskas.webp',
      '/fixtures/Brands/wolf-of-wilderness_f.png',
      '/fixtures/Brands/Мнямс.webp',
    ];

    const brandDescriptions = [
      'НВЦ Агроветзащита был основан в 1993 году. Вот уже более 20 лет компания занимается разработкой, производством и продажей ветеринарных препаратов...',
      'Bayer – продукция, которая создана для оздоровления домашних животных. Компания выпускает эффективные препараты...',
      'Премиальные корма для котов с высоким содержанием мяса и натуральными ингредиентами',
      'Сбалансированное питание для собак всех пород и возрастов',
      'Инновационные поводки и аксессуары для собак',
      'Доступные и качественные корма для кошек и котят',
      'Изысканное питание для особенных кошек',
      'Высококачественные корма для кошек',
      'Здоровое питание для собак с учетом их потребностей',
      'Научно обоснованное питание для домашних животных',
      'Здоровье каждой собаки и кошки настолько индивидуально, как и само животное. Оно зависит от размера, породы и условий жизни питомца.',
      'Собаки и волки имеют 99% общего ДНК. Именно поэтому мы разработали корм Wolf of Wilderness.',
      'Уже более 30 лет владельцы домашних животных доверяют James Wellbeloved заботу о своих четвероногих друзьях.',
      "От щенков и котят до пожилых питомцев — питание для собак и кошек от Hill's, основанное на научном подходе.",
      'Наша основная философия — «питание без компромиссов» — лежит в основе всего, что мы делаем.',
      'Добро пожаловать в Applaws — мир для любознательных натур и ещё более любознательных аппетитов.',
    ];

    const brands = [];
    for (let i = 0; i < brandNames.length; i++) {
      const hasDescription = Math.random() > 0.3;
      const description = hasDescription
        ? brandDescriptions[
            Math.floor(Math.random() * brandDescriptions.length)
          ]
        : null;

      const brandLogo = logo[i];

      const brand = await this.prisma.brand.create({
        data: {
          title: brandNames[i],
          logo: brandLogo,
          description: description,
        },
      });
      brands.push(brand);
    }

    const mainCategories = [
      { title: 'Собаки', image: '/fixtures/categoryIcons/10.png' },
      { title: 'Кошки', image: '/fixtures/categoryIcons/7.png' },
      { title: 'Грызуны', image: '/fixtures/categoryIcons/6.png' },
      { title: 'Птицы', image: '/fixtures/categoryIcons/3.png' },
      { title: 'Рыбки', image: '/fixtures/categoryIcons/4.png' },
      {
        title: 'Рептилии',
        image: '/fixtures/categoryIcons/lizard_transparent.png',
      },
      { title: 'Другие питомцы', image: '/fixtures/categoryIcons/1.png' },
    ];

    const categories = [];
    for (const cat of mainCategories) {
      const category = await this.prisma.category.create({
        data: {
          title: cat.title,
          image: cat.image,
        },
      });
      categories.push(category);
    }

    const subCategoryData: Record<string, string[]> = {
      Собаки: [
        'Сухой корм',
        'Влажные корма',
        'Шампуни и гели',
        'Одежда для собак',
        'Лежаки и подушки',
        'Питание для щенков',
        'Переноски',
      ],
      Кошки: [
        'Сухие корма',
        'Влажные корм',
        'Шампуни для кошек',
        'Одежда для кошек',
        'Груминг и уход',
        'Игрушки для кошек',
        'Когтеточки',
      ],
      Грызуны: [
        'Корма для грызунов',
        'Клетки для грызунов',
        'Игрушки для грызунов',
        'Наполнитель для клеток',
        'Лакомства для грызунов',
      ],
      Птицы: [
        'Корм для птиц',
        'Клетки и вольеры',
        'Игрушки для птиц',
        'Витамины и добавки',
        'Поилки и кормушки',
      ],
      Рыбки: [
        'Корма для рыб',
        'Аквариумы и аксессуары',
        'Фильтры для аквариумов',
        'Освещение для аквариумов',
        'Декорации для аквариумов',
      ],
      Рептилии: [
        'Корма для рептилий',
        'Террариумы',
        'Обогреватели для террариумов',
        'Декорации для террариумов',
        'Термометры и гигрометры для террариумов',
      ],
      'Другие питомцы': [
        'Пищевые смеси',
        'Миски и поилки',
        'Палочки и витаминные добавки',
        'Гнезда и укрытия',
        'Минеральные добавки',
        'Обогреватели для воды',
        'Влажные и сухие смеси для кормления',
        'Солевые растворы и добавки',
      ],
    };

    const iconPaths = [
      '/fixtures/categoryIcons/1icon.png',
      '/fixtures/categoryIcons/2icon.png',
      '/fixtures/categoryIcons/3icon.png',
      '/fixtures/categoryIcons/4icon.png',
      '/fixtures/categoryIcons/5icon.png',
      '/fixtures/categoryIcons/6icon.png',
      '/fixtures/categoryIcons/7icon.png',
      '/fixtures/categoryIcons/8icon.png',
      '/fixtures/categoryIcons/9icon.png',
      '/fixtures/categoryIcons/icon10.png',
      '/fixtures/categoryIcons/dog-food.png',
      '/fixtures/categoryIcons/yarn-ball.png',
      '/fixtures/categoryIcons/pet-cage.png',
      '/fixtures/categoryIcons/fish-bowl.png',
      '/fixtures/categoryIcons/pet-feeder.png',
      '/fixtures/categoryIcons/tray.png',
      '/fixtures/categoryIcons/terrarium.png',
    ];

    const subCategories = [];
    for (const category of categories) {
      const subcats = subCategoryData[category.title] || [];
      for (const subcat of subcats) {
        const randomIcon =
          iconPaths[Math.floor(Math.random() * iconPaths.length)];
        const subcategory = await this.prisma.category.create({
          data: {
            title: subcat,
            parentId: category.id,
            icon: randomIcon,
          },
        });
        subCategories.push(subcategory);
      }
    }

    const productPrefixes = [
      'Про',
      'Био',
      'Натур',
      'Эко',
      'Люкс',
      'Макси',
      'Мини',
      'Комфорт',
      'Зоо',
      'Ультра',
    ];
    const productTypes = [
      'Стандарт',
      'Премиум',
      'Универсальный',
      'Гипоаллергенный',
      'Повседневный',
      'Полнорационный',
    ];
    const productPhotos = [
      '/fixtures/products/dog-food.webp',
      '/fixtures/products/cat-food.webp',
      '/fixtures/products/treats.webp',
      '/fixtures/products/vitamins.webp',
      '/fixtures/products/Dog_Toys.webp',
      '/fixtures/products/cat_scratcher.webp',
      '/fixtures/products/collars.webp',
      '/fixtures/products/aquarium_filter.webp',
      '/fixtures/products/rabbit_feeder.webp',
      '/fixtures/products/hay.webp',
    ];
    const productDescriptions = [
      'Прочная и надежная конструкция.',
      'Вкусно и полезно — одобрено питомцами.',
      'Прост в применении и эффективен.',
      'Удобен в использовании дома и в поездке.',
      'Разработан с учетом потребностей животных.',
      'Сбалансированная формула для лучшего самочувствия.',
      'Идеально подходит для повседневного использования.',
      'Содержит все необходимые элементы для здоровья питомца.',
      'Подходит для чувствительных питомцев.',
      'Помогает поддерживать активность и энергию.',
      'Полезный и качественный товар для домашних животных.',
    ];
    const manufacturers = [
      'Испания',
      'Германия',
      'Франция',
      'Италия',
      'Швейцария',
      'Россия',
      'США',
      'Япония',
      'Корея',
      'Великобритания',
    ];
    const ages = ['Взрослый', 'Щенок/Котенок', 'Пожилой', 'Все возрасты'];
    const weights = [0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20];
    const topSelling = [1, 20, 105, 35, 99, 19, 88, 55, 75];

    const products = [];
    for (const subCategory of subCategories) {
      const productsCount = Math.floor(Math.random() * 5) + 3;

      for (let i = 0; i < productsCount; i++) {
        const randomPrefix =
          productPrefixes[Math.floor(Math.random() * productPrefixes.length)];
        const randomType =
          productTypes[Math.floor(Math.random() * productTypes.length)];
        const randomBrand = brands[Math.floor(Math.random() * brands.length)];
        const randomPhoto =
          productPhotos[Math.floor(Math.random() * productPhotos.length)];
        const randomDescription =
          productDescriptions[
            Math.floor(Math.random() * productDescriptions.length)
          ];
        const randomPrice = Math.floor(Math.random() * 3000) + 300; // От 300 до 3300 сом
        const randomWeight =
          weights[Math.floor(Math.random() * weights.length)];
        const randomManufacturer =
          manufacturers[Math.floor(Math.random() * manufacturers.length)];
        const randomAge = ages[Math.floor(Math.random() * ages.length)];
        const randomTopSelling =
          topSelling[Math.floor(Math.random() * topSelling.length)];

        const existence = Math.random() > 0.1; // 90% товаров в наличии
        const onSale = Math.random() > 0.8; // 20% товаров на акции

        let startDateSales: Date | undefined = undefined;
        let endDateSales: Date | undefined = undefined;
        let promoPrice: number | undefined = undefined;
        let promoPercentage: number | undefined = undefined;
        if (onSale) {
          const now = new Date();
          startDateSales = new Date(now);
          startDateSales.setDate(
            now.getDate() - Math.floor(Math.random() * 10),
          );

          endDateSales = new Date(now);
          endDateSales.setDate(
            now.getDate() + Math.floor(Math.random() * 30) + 5,
          );
          const discountPercentage = Math.floor(Math.random() * 26) + 5;
          promoPercentage = discountPercentage;
          promoPrice = Math.round(
            (randomPrice * (100 - discountPercentage)) / 100,
          );
        }

        const parentCategory = await this.prisma.category.findUnique({
          where: { id: subCategory.parentId || 1 },
        });

        const productName = `${randomPrefix} ${randomType} – ${subCategory.title}${parentCategory ? ' для ' + parentCategory.title.toLowerCase() : ''}`;

        const productData: ProductData = {
          productName,
          productPrice: randomPrice,
          productDescription: `${subCategory.title}. ${randomDescription}`,
          brandId: randomBrand.id,
          productPhoto: randomPhoto,
          existence,
          sales: onSale,
          productWeight: randomWeight,
          productManufacturer: randomManufacturer,
          productAge: randomAge,
          orderedProductsStats: randomTopSelling,
        };

        if (onSale && startDateSales && endDateSales) {
          productData.startDateSales = startDateSales;
          productData.endDateSales = endDateSales;
          productData.promoPrice = promoPrice;
          productData.promoPercentage = promoPercentage;
        }

        const product = await this.prisma.products.create({
          data: {
            ...productData,
            productCategory: {
              create: [
                {
                  category: {
                    connect: { id: subCategory.id },
                  },
                },
              ],
            },
          },
        });
        products.push(product);
      }
    }

    const orderStatuses: OrderStatus[] = [
      'Pending',
      'Confirmed',
      'Shipped',
      'Delivered',
      'Canceled',
    ];
    const paymentMethods: PaymentMethod[] = ['ByCard', 'ByCash'];
    const deliveryMethods: DeliveryMethod[] = ['Delivery', 'PickUp'];
    const cities = [
      'Бишкек',
      'Ош',
      'Кара-Балта',
      'Талас',
      'Нарын',
      'Чолпон-Ата',
      'Балыкчы',
      'Джалал-Абад',
    ];
    const streets = [
      'Ленина',
      'Гагарина',
      'Московская',
      'Киевская',
      'Абдрахманова',
      'Фрунзе',
      'Чуй',
      'Боконбаева',
      'Байтик Баатыра',
    ];
    const orderComments = [
      'Позвонить перед доставкой',
      'Оставить у двери',
      'Доставить до 18:00',
      'Нужна сдача с 5000 сом',
      'Не звонить, написать в WhatsApp',
      'Домофон не работает, позвонить',
      'Пожалуйста, не забудьте пакет',
      '',
      '',
      '',
    ];

    const ordersCount = Math.floor(Math.random() * 20) + 30;

    for (let i = 0; i < ordersCount; i++) {
      const randomClient = clients[Math.floor(Math.random() * clients.length)];
      const randomStatus =
        orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
      const randomPaymentMethod =
        paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      const randomDeliveryMethod =
        deliveryMethods[Math.floor(Math.random() * deliveryMethods.length)];

      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomStreet = streets[Math.floor(Math.random() * streets.length)];
      const randomHouseNumber = Math.floor(Math.random() * 200) + 1;
      const address = `г. ${randomCity}, ул. ${randomStreet} ${randomHouseNumber}`;

      const useBonus = Math.random() > 0.7;
      const bonusUsed = useBonus
        ? Math.floor(Math.random() * 300) + 50
        : undefined;

      const randomComment =
        orderComments[Math.floor(Math.random() * orderComments.length)];

      const orderItemsCount = Math.floor(Math.random() * 5) + 1;
      const orderItems = [];

      for (let j = 0; j < orderItemsCount; j++) {
        const randomProduct =
          products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 5) + 1;
        const orderAmount = randomProduct.productPrice * quantity;

        orderItems.push({
          quantity,
          orderAmount,
          productId: randomProduct.id,
        });
      }

      function randomDate(start: Date, end: Date): Date {
        return new Date(
          start.getTime() + Math.random() * (end.getTime() - start.getTime()),
        );
      }

      await this.prisma.order.create({
        data: {
          userId: randomClient.id,
          status: randomStatus,
          address,
          createdAt: randomDate(new Date(2025, 3, 1), new Date()),
          guestPhone: randomClient.phone,
          guestEmail: randomClient.email,
          guestName: randomClient.firstName,
          guestLastName: randomClient.secondName,
          paymentMethod: randomPaymentMethod,
          deliveryMethod: randomDeliveryMethod,
          orderComment: randomComment,
          useBonus,
          bonusUsed,
          items: {
            create: orderItems,
          },
        },
      });
    }

    await this.prisma.statistic.create({
      data: {
        id: 1,
        date: new Date(),
        pickUpStatistic: Math.floor(Math.random() * 1000),
        deliveryStatistic: Math.floor(Math.random() * 1000),
        paymentByCard: Math.floor(Math.random() * 10000),
        paymentByCash: Math.floor(Math.random() * 10000),
        bonusUsage: Math.floor(Math.random() * 5000),
        canceledOrderCount: Math.floor(Math.random() * 500),
        totalOrders: Math.floor(Math.random() * 100000) + 30000,
      },
    });

    await this.prisma.adminInfo.create({
      data: {
        information:
          'Добро пожаловать в зоомагазин "Незабудка"!\n\nМы рады видеть вас среди наших клиентов. Здесь вы найдете всё необходимое для здоровья и счастья вашего питомца. Мы заботимся о каждом хвостике и предлагаем только лучшие товары и сервис. Спасибо, что выбрали нас!',
      },
    });

    await this.prisma.clientInfo.create({
      data: {
        information:
          'Добро пожаловать в зоомагазин "Незабудка"!\n\nМы рады видеть вас среди наших клиентов. Здесь вы найдете всё необходимое для здоровья и счастья вашего питомца. Мы заботимся о каждом хвостике и предлагаем только лучшие товары и сервис. Спасибо, что выбрали нас!',
      },
    });

    await this.prisma.companyPages.create({
      data: {
        text: `
      <p>С 2008 года магазин зоотоваров <strong>«Незабудка»</strong> радует своих клиентов и их питомцев. Мы начинали как небольшой уютный магазин, а сегодня выходим в онлайн, чтобы быть еще ближе к вам. Теперь вы можете заказать всё необходимое не выходя из дома — быстро, удобно и с доставкой по Бишкеку.</p>

      <p>Наш ассортимент — один из самых широких в городе. В нём вы найдете:</p>
      <ul>
        <li>корма всех классов — от эконом до супер-премиум;</li>
        <li>ветеринарные препараты и витамины;</li>
        <li>одежду, переноски, аксессуары и игрушки для кошек и собак;</li>
        <li>товары для птиц, грызунов и других мелких питомцев.</li>
      </ul>

      <p>Мы работаем только с проверенными поставщиками и брендами, гарантируя качество каждой позиции. Наша команда — это люди, искренне любящие животных и стремящиеся сделать уход за ними лёгким и приятным для вас.</p>

      <p>В <strong>«Незабудке»</strong> мы заботимся не только о животных, но и о своих клиентах — поэтому у нас действует бонусная программа, постоянные акции и персональный подход к каждому.</p>

      <p>Благодарим за доверие и надеемся стать вашим надёжным помощником в заботе о любимых питомцах.</p>
    `,
      },
    });
    await this.prisma.bonusProgramPage.create({
      data: {
        text: `
      <h6>Бонусная программа</h6>
      <p>В благодарность за ваш выбор и доверие мы разработали <strong>выгодную бонусную программу</strong> для постоянных клиентов.</p>

      <p><strong>Как это работает?</strong></p>
      <ul>
        <li>За каждый оформленный заказ вы получаете бонусы.</li>
        <li>За каждые потраченные <strong>100 сом</strong> вы получаете <strong>1 бонусный балл</strong>.</li>
        <li><strong>1 бонус = 1 сому</strong> при оплате следующих заказов.</li>
      </ul>

      <p><strong>Где применить бонусы?</strong></p>
      <p>Вы можете использовать накопленные баллы при оформлении любого следующего заказа — частично или полностью оплатив ими покупку.</p>

      <p><strong>Дополнительные преимущества:</strong></p>
      <ul>
        <li>Бонусы начисляются автоматически сразу после подтверждения заказа.</li>
        <li>Чем больше вы заказываете — тем больше бонусов получаете!</li>
      </ul>

      <p>Присоединяйтесь к бонусной программе <strong>«Незабудки»</strong> и делайте покупки не только с удовольствием, но и с выгодой!</p>
    `,
      },
    });

    await this.prisma.deliveryPage.create({
      data: {
        text: `<h6 style="font-weight: bold">Условия доставки</h6>
  <p>Приём заявок и доставка осуществляется <strong>ежедневно с 10:00 до 18:00</strong>.</p>

  <ul>
    <li>Заявки, принятые <strong>до 14:00</strong>, доставляются в тот же день.</li>
    <li>Заявки, принятые <strong>после 14:00</strong>, доставляются на следующий день.</li>
  </ul>

  <p>Перед выездом <strong>наш оператор свяжется с вами</strong> для подтверждения и согласования деталей заказа.</p>

  <p style="margin-bottom: 0;"><strong>Важно:</strong></p>
  <ul style="margin-top: 4px;">
    <li>Из-за большого количества заказов и наличия лифтов с чипами доставка осуществляется <strong>только до подъезда</strong> (без подъема на этаж).</li>
    <li>Подъем возможен только по индивидуальной договоренности с курьером.</li>
  </ul>

  <h6 style="margin-top: 24px; font-weight: bold">Оплата</h6>
  <p>Оплату можно произвести <strong>наличными курьеру</strong> или через интернет-банкинг:</p>
  <ul>
    <li>Банк Кыргызстан</li>
    <li>Optima Bank</li>
    <li>Demir Bank</li>
  </ul>
`,
        price: `<h6 style="margin-top: 24px; font-weight: bold">Зоны доставки и стоимость</h6>
  <p>Фиксированная стоимость доставки в зависимости от суммы заказа:</p>
  <ul>
    <li><strong style="color: green">250 сом</strong> — на заказы до 1000 сом</li>
    <li><strong style="color: red">200 сом </strong> — на заказы от 1000 до 2000 сом</li>
    <li><strong style="color: pink">150 сом</strong> — на заказы от 2000 до 3000 сом</li>
    <li><strong style="color: yellow">100 сом</strong> — на заказы от 3000 до 3500 сом</li>
    <li><strong>Бесплатно</strong> — на заказы от 3500 сом</li>
  </ul>

  <p>Если ваш район находится за пределами основных зон доставки, уточните стоимость у оператора. Стандартные варианты: <strong>200 сом, 250 сом, 500 сом</strong>.</p>
`,
        map: 'https://www.google.com/maps/d/u/0/embed?mid=1G9bEPWjGTG9-GRPK14b78rv1mUoLvkE',
      },
    });
  }
}
