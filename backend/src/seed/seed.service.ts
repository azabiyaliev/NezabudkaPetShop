import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(private prisma: PrismaService) {}

  async seed() {
    await this.prisma.cartItem.deleteMany({});
    await this.prisma.cart.deleteMany({});
    await this.prisma.favorite.deleteMany({});
    await this.prisma.passwordReset.deleteMany();
    await this.prisma.user.deleteMany({});
    await this.prisma.orderItem.deleteMany({});
    await this.prisma.products.deleteMany({});
    await this.prisma.siteEdition.deleteMany({});
    await this.prisma.photoByCarousel.deleteMany({});
    await this.prisma.brand.deleteMany({});
    await this.prisma.category.deleteMany({});
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
      this.prisma.brand.create({
        data: {
          title: 'ROYAL CANIN',
          logo: '/fixtures/Brands/ROYAL_CANIN.webp',
          description:
            'Здоровье каждой собаки и кошки настолько индивидуально, как и само животное. Оно зависит от размера, породы и условий жизни питомца. Откройте для себя специальные диеты от ROYAL CANIN, которые адаптированы к уникальным потребностям собак и кошек и разработаны для оптимальной поддержки их здоровья.',
        },
      }),
      this.prisma.brand.create({
        data: {
          title: 'WOLF OF WILDERNESS',
          logo: '/fixtures/Brands/wolf-of-wilderness_f.png',
          description:
            'Собаки и волки имеют 99% общего ДНК. Именно поэтому мы разработали корм Wolf of Wilderness. Наш рацион основан на природных инстинктах вашей собаки — он на 100% беззерновой и содержит много свежего мяса.',
        },
      }),
      this.prisma.brand.create({
        data: {
          title: 'James Wellbeloved',
          logo: '/fixtures/Brands/James_Wellbeloved.webp',
          description:
            'Уже более 30 лет владельцы домашних животных доверяют James Wellbeloved заботу о своих четвероногих друзьях, помогая им быть счастливыми, здоровыми и полными энергии. Наши натуральные и вкусные рационы разработаны с учётом потребностей питомцев, чтобы обеспечивать их всем необходимым. Мы стремимся не просто сделать питание лучше — мы хотим, чтобы жизнь ваших любимцев стала лучше. Ведь это естественно — желать, чтобы ваш питомец с удовольствием ел и жил здоровой и счастливой жизнью.',
        },
      }),
      this.prisma.brand.create({
        data: {
          title: "HILL'S PET NUTRITION",
          logo: '/fixtures/Brands/Hills.webp',
          description:
            "От щенков и котят до пожилых питомцев — питание для собак и кошек от Hill's, основанное на научном подходе, всегда на шаг впереди, чтобы вы могли видеть, чувствовать и доверять результату.",
        },
      }),
      this.prisma.brand.create({
        data: {
          title: 'Arden Grange',
          logo: '/fixtures/Brands/ArdenGrange.webp',
          description:
            'Наша основная философия — «питание без компромиссов» — лежит в основе всего, что мы делаем. Все наши рационы для собак и кошек являются натурально гипоаллергенными, содержат пребиотики и поддерживают здоровье суставов. Каждый ингредиент в составе выбран не случайно — он несёт реальную питательную ценность и способствует достижению оптимального здоровья и жизненной энергии питомца.',
        },
      }),
      this.prisma.brand.create({
        data: {
          title: 'Applaws',
          logo: '/fixtures/Brands/Applaws.webp',
          description:
            'Добро пожаловать в Applaws — мир для любознательных натур и ещё более любознательных аппетитов. У нас новый облик, но наш корм для кошек по-прежнему такой же натуральный и вкусный, с тем самым любимым вкусом, который оценит ваш питомец. Каждая кошка уникальна, и мы стремимся удовлетворить её любопытство и постоянно меняющиеся вкусовые предпочтения. Благодаря разнообразию натурально вкусных рецептов в нашем меню, у нас найдётся блюдо для любой «мяу»-личности!',
        },
      }),
      this.prisma.brand.create({
        data: {
          title: 'Burns',
          logo: '/fixtures/Brands/Burns.png',
          description:
            'Мы — новаторский бренд в мире питания для домашних животных и стоим у истоков рынка здорового корма с момента основания компании ветеринарным врачом Джоном Бёрнсом в 1993 году. Мы специализируемся на простых, полезных и натуральных ингредиентах, создавая отмеченные наградами рецепты, которые любят питомцы. С момента выпуска нашего первого рецепта с курицей и рисом почти 30 лет назад, мы разработали разнообразные линейки здорового и гипоаллергенного корма, в которых используется один источник белка и ингредиенты, максимально полезные, натуральные и устойчивые с точки зрения экологии. С момента нашего скромного старта мы выиграли множество наград, продали более 2 миллиардов порций корма и продолжаем поддерживать приюты, благотворительные организации и социальные проекты по всей Великобритании, ежегодно жертвуя 25% своей прибыли.',
        },
      }),
      this.prisma.brand.create({
        data: {
          title: 'Whiskas',
          logo: '/fixtures/Brands/Whiskas.webp',
          description:
            'Откройте для себя вкусное разнообразие влажного и сухого корма, а также лакомств от Whiskas® — для довольного мурчания во время еды и не только.',
        },
      }),
      this.prisma.brand.create({
        data: {
          title: 'Concept for Life',
          logo: '/fixtures/Brands/CFL.webp',
          description:
            'Корм Concept for Life обеспечивает вашего питомца правильным питанием на каждом этапе жизни. Этот вкусный сухой и влажный корм создан с учётом индивидуальных потребностей и особенностей рациона вашей кошки или собаки. Будь то котёнок, щенок, пожилое животное, рабочая собака, домашняя кошка или любительница прогулок — Concept for Life предлагает премиальное питание по отличной цене. Калорийность и питательная ценность каждого вида корма оптимизированы под конкретные потребности на каждом этапе жизни, чтобы состав и польза точно соответствовали образу жизни вашего питомца. Во всех рационах используются качественные ингредиенты, соответствующие виду животного и выполняющие конкретные функции. Этот сбалансированный комплекс питательных веществ помогает вашему питомцу жить счастливой и здоровой жизнью.',
        },
      }),
      this.prisma.brand.create({
        data: {
          title: 'Cosma',
          logo: '/fixtures/Brands/Cosma.webp',
          description:
            'Каждый ответственный владелец кошки ценит качественное питание в миске своего питомца. Корм для кошек Cosma — это вкусный премиальный рацион, приготовленный из 100% натуральных ингредиентов с высоким содержанием чистого мяса или рыбы. Он не содержит консервантов, искусственных красителей или усилителей вкуса. Корм Cosma предлагает наилучшую питательную ценность и разработан для самых взыскательных домашних кошек и их утончённых вкусов. Cosma — это именно то, что ваша кошка заслуживает каждый день: чистое мясо и настоящая забота!',
        },
      }),
      this.prisma.brand.create({
        data: {
          title: 'Purizon',
          logo: '/fixtures/Brands/purizon.jpg',
          description:
            'Корм для собак и кошек Purizon ориентирован на естественный рацион наших любимцев. Он содержит до 80% мяса, рыбы и других ингредиентов животного происхождения.',
        },
      }),
      this.prisma.brand.create({
        data: {
          title: "Rosie's Farm",
          logo: '/fixtures/Brands/RosiesFarm.webp',
          description:
            "Rosie's Farm предлагает широкий выбор беззерновых влажных и сухих кормов, а также лакомств для собак и кошек. Они приготовлены с заботой и любовью из питательных ингредиентов. Каждый рецепт содержит свежее мясо или рыбу, а также тщательно отобранные овощи и травы. В Rosie's Farm знают, что хорошая еда объединяет семьи. Именно потому вы можете быть уверены, что еда в миске питомца будет не менее вкусной и полезной, чем ваша!",
        },
      }),
      this.prisma.brand.create({
        data: {
          title: 'Tigerino',
          logo: '/fixtures/Brands/Tigerino.jpg',
          description:
            'Tigerino — это не только сверхвпитывающий, но и экологичный наполнитель для кошек. Он мгновенно устраняет неприятные запахи и надёжно запирает бактерии внутри. Удивительно, но он способен впитать почти собственный вес жидкости.',
        },
      }),
      this.prisma.brand.create({
        data: {
          title: 'Pedigree',
          logo: '/fixtures/Brands/Pedigree.png',
          description:
            'PEDIGREE® верит, что собаки делают нашу жизнь лучше и делают нас лучшими людьми. Их искренняя преданность раскрывает в нас всё хорошее, поэтому мы стараемся, чтобы наше питание раскрывало всё лучшее в них. Вся наша продукция разрабатывается ветеринарами на основе научных исследований Института Waltham Petcare Science, чтобы каждая собака была максимально здоровой и счастливой.',
        },
      }),
      this.prisma.brand.create({
        data: {
          title: 'SkogsFRO',
          logo: '/fixtures/Brands/SkogsFRO.webp',
          description: null,
        },
      }),
      this.prisma.brand.create({
        data: {
          title: 'Qushy',
          logo: '/fixtures/Brands/Qushy.webp',
          description:
            'Бренд «Qushy» берёт своё название от двух слов: французского «Queue», что значит «хвост», и английского «Bushy» — «пушистый». Изготавливаемые под этой маркой наполнители будут радовать абсолютно всех котиков, ведь для каждого из них можно подобрать любимый вид. Впитывающий, комкующийся и древесный наполнители производятся в разных регионах России, и сырьё для них отбирается самым тщательным образом. Поддерживая тенденции по сбережению окружающей среды, мы производим наш продукт таким образом, чтобы он полностью подлежал переработке. Благодаря этому важному условию, вы можете безопасно утилизировать наполнитель и его упаковку без вреда для экологии. Когда вы выбираете «Qushy», вы делаете шаг в сторону заботы не только о своём питомце, но и о природе в целом.',
        },
      }),
      this.prisma.brand.create({
        data: {
          title: 'Мнямс',
          logo: '/fixtures/Brands/Мнямс.webp',
          description:
            'Многие хозяева кошек выбирают уже готовую продукцию для своего питомца. При таком кормлении не нужно тратить много времени на готовку. К тому же, такую пищу можно купить в зоомагазине, либо заказать по интернету. Это немецкая марка представляет собой товар премиум-класса. По отзывам потребителей, качество корма Мнямс выше большинства представителей данного класса. Продукт сбалансирован, содержит все необходимые витамины и микроэлементы. Корма Мнямс выпускается в большом ассортименте: в виде влажных и сухих рационов, консервов и лакомств. Изобилие вкусов порадует самых привередливых в еде кошек. У нас выгодные цены, сертифицированная продукция, отличная бонусная программа! Наличие собственных складов товаров и более 185 магазинов, дает возможность нашим клиентам купить корма и лакомства Мнямс с доставкой на дом в течение 1 часа в городах: Москва, Санкт-Петербург, Нижний Новгород, Казань, или воспользоваться услугой самовывоз на ближайшем пункте доставки уже через 30 минут после заказа!',
        },
      }),
      this.prisma.brand.create({
        data: {
          title: 'Brit',
          logo: '/fixtures/Brands/Brit.webp',
          description:
            'Среди многообразия питания для домашних животных на рынке зоотоваров можно легко растеряться. Здесь представлен широчайший ассортимент различной ценовой категории, начиная от бюджетных кормов и заканчивая элитными. Многие заводчики отдают предпочтение рационам чешского производителя Brit. Корма производятся в широком ассортименте для кошек и собак всех пород и возрастов. Продукция Брит на 100% отвечает высоким стандартам и требованиям и по праву занимает свое место в рейтинге лучших кормов. Питание относится к премиум-классу и выпускается как в сухом, так и влажном виде. Заводские рационы Brit отличают сбалансированная рецептура, качественные ингредиенты и натуральный состав, в котором исключено содержание сои и ГМО. Продукция содержит все необходимые домашнему животному витамины и полезные минеральные вещества. Сбалансированный состав, экологически чистое серьё, высочайшее качество, доступные цены делают продукцию Брит популярной и востребованной. Купить корм Brit по самым выгодным ценам можно на сайте нашего интернет-магазина. У нас представлена широкая линейка самой разнообразной продукции популярной торговой марки. Грамотные консультанты помогут определиться с выбором необходимого товара. К тому же, уже через полчаса после оформления заказа, можно самостоятельно забрать товар в любом магазине в Москве, Санкт-Петербурге, Нижнем Новгороде и Казани, где он есть в наличии. Наша сеть насчитывает более 185 магазинов и имеет собственные склады для хранения. Это дает возможность доставить корм Brit в кратчайшие сроки. Звоните прямо сейчас.',
        },
      }),
      this.prisma.brand.create({
        data: {
          title: 'Jarvi',
          logo: '/fixtures/Brands/Jarvi.svg',
          description:
            'Järvi – для тех, кто выбирает лучшее для своего любимца. В составе только проверенные источники белка, витамины, аминокислоты, пребиотики, пробиотики и полезные добавки, которые учитывают все физиологические потребности организма. Продукция представляет собой сбалансированное полнорационное питание, изготовленное с учётом индивидуальных особенностей питомцев. Широкая палитра вкусов и разнообразие продуктов превращают процесс кормления в ежедневное удовольствие.',
        },
      }),
      this.prisma.brand.create({
        data: {
          title: 'ANIMAL ISLAND',
          logo: '/fixtures/Brands/ANIMAL_ISLAND.jpg',
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
      ROYAL_CANIN,
      WOLF_OF_WILDERNESS,
      James_Wellbeloved,
      hills,
      ArdenGrange,
      Applaws,
      Burns,
      Whiskas,
      CFL,
      Cosma,
      purizon,
      RosiesFarm,
      Tigerino,
      Pedigree,
      SkogsFRO,
      Qushy,
      Мнямс,
      Brit,
      Jarvi,
      ANIMAL_ISLAND,
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
