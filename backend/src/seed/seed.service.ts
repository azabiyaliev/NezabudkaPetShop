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
    await this.prisma.order.deleteMany({});
    await this.prisma.orderItem.deleteMany({});
    await this.prisma.statistic.deleteMany({});
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
          logo: '/fixtures/Brands/Cosma.png',
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
      Mnyams,
      Brit,
      Jarvi,
      ANIMAL_ISLAND,
    ] = brands;

    const category = await Promise.all([
      this.prisma.category.create({
        data: { title: 'Собаки', image: '/fixtures/categoryIcons/10.png' },
      }),
      this.prisma.category.create({
        data: { title: 'Кошки', image: '/fixtures/categoryIcons/7.png' },
      }),
      this.prisma.category.create({
        data: { title: 'Грызуны', image: '/fixtures/categoryIcons/6.png' },
      }),
      this.prisma.category.create({
        data: { title: 'Птицы', image: '/fixtures/categoryIcons/3.png' },
      }),
      this.prisma.category.create({
        data: { title: 'Рыбки', image: '/fixtures/categoryIcons/4.png' },
      }),
      this.prisma.category.create({
        data: {
          title: 'Рептилии',
          image: '/fixtures/categoryIcons/lizard_transparent.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Другие питомцы',
          image: '/fixtures/categoryIcons/1.png',
        },
      }),
    ]);

    const [dogs, cats, rodents, birds, fishes, reptiles, others] = category;

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
          title: 'Шампуни и гели',
          parentId: dogs.id,
          icon: '/fixtures/categoryIcons/5icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Одежда для собак',
          parentId: dogs.id,
          icon: '/fixtures/categoryIcons/icon10.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Лежаки и подушки',
          parentId: dogs.id,
          icon: '/fixtures/categoryIcons/6icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Питание для щенков',
          parentId: dogs.id,
          icon: '/fixtures/categoryIcons/3icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Переноски',
          parentId: dogs.id,
          icon: '/fixtures/categoryIcons/6icon.png',
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
          title: 'Шампуни для кошек',
          parentId: cats.id,
          icon: '/fixtures/categoryIcons/5icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Одежда для кошек',
          parentId: cats.id,
          icon: '/fixtures/categoryIcons/icon10.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Груминг и уход',
          parentId: cats.id,
          icon: '/fixtures/categoryIcons/5icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Игрушки для кошек',
          parentId: cats.id,
          icon: '/fixtures/categoryIcons/9icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Когтеточки',
          parentId: cats.id,
          icon: '/fixtures/categoryIcons/yarn-ball.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Пищевые смеси',
          parentId: others.id,
          icon: '/fixtures/categoryIcons/8icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Миски и поилки',
          parentId: others.id,
          icon: '/fixtures/categoryIcons/dog-food.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Палочки и витаминные добавки',
          parentId: others.id,
          icon: '/fixtures/categoryIcons/8icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Гнезда и укрытия',
          parentId: others.id,
          icon: '/fixtures/categoryIcons/6icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Минеральные добавки ',
          parentId: others.id,
          icon: '/fixtures/categoryIcons/8icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Обогреватели для воды',
          parentId: others.id,
          icon: '/fixtures/categoryIcons/6icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Влажные и сухие смеси для кормления',
          parentId: others.id,
          icon: '/fixtures/categoryIcons/4icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Солевые растворы и добавки',
          parentId: others.id,
          icon: '/fixtures/categoryIcons/8icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Корма для рыб',
          parentId: fishes.id,
          icon: '/fixtures/categoryIcons/4icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Аквариумы и аксессуары',
          parentId: fishes.id,
          icon: '/fixtures/categoryIcons/fish-bowl.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Фильтры для аквариумов',
          parentId: fishes.id,
          icon: '/fixtures/categoryIcons/fish-bowl.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Освещение для аквариумов',
          parentId: fishes.id,
          icon: '/fixtures/categoryIcons/fish-bowl.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Декорации для аквариумов',
          parentId: fishes.id,
          icon: '/fixtures/categoryIcons/fish-bowl.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Корма для рептилий',
          parentId: reptiles.id,
          icon: '/fixtures/categoryIcons/4icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Террариумы',
          parentId: reptiles.id,
          icon: '/fixtures/categoryIcons/terrarium.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Обогреватели для террариумов',
          parentId: reptiles.id,
          icon: '/fixtures/categoryIcons/terrarium.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Декорации для террариумов',
          parentId: reptiles.id,
          icon: '/fixtures/categoryIcons/terrarium.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Термометры и гигрометры для террариумов',
          parentId: reptiles.id,
          icon: '/fixtures/categoryIcons/terrarium.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Корма для грызунов',
          parentId: rodents.id,
          icon: '/fixtures/categoryIcons/4icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Клетки для грызунов',
          parentId: rodents.id,
          icon: '/fixtures/categoryIcons/pet-cage.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Игрушки для грызунов',
          parentId: rodents.id,
          icon: '/fixtures/categoryIcons/9icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Наполнитель для клеток',
          parentId: rodents.id,
          icon: '/fixtures/categoryIcons/tray.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Лакомства для грызунов',
          parentId: rodents.id,
          icon: '/fixtures/categoryIcons/8icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Корм для птиц',
          parentId: birds.id,
          icon: '/fixtures/categoryIcons/4icon.png',
        },
      }),
      this.prisma.category.create({
        data: {
          title: 'Клетки и вольеры',
          parentId: birds.id,
          icon: '/fixtures/categoryIcons/pet-cage.png',
        },
      }),

      this.prisma.category.create({
        data: {
          title: 'Игрушки для птиц',
          parentId: birds.id,
          icon: '/fixtures/categoryIcons/9icon.png',
        },
      }),

      this.prisma.category.create({
        data: {
          title: 'Витамины и добавки',
          parentId: birds.id,
          icon: '/fixtures/categoryIcons/2icon.png',
        },
      }),

      this.prisma.category.create({
        data: {
          title: 'Поилки и кормушки',
          parentId: birds.id,
          icon: '/fixtures/categoryIcons/pet-feeder.png',
        },
      }),
    ]);

    const [
      dryDogFood,
      wetDogFood,
      dogShampoosAndGels,
      dogClothing,
      dogBedsAndCushions,
      puppyFood,
      dogCarriers,
      dryCatFood,
      wetCatFood,
      catShampoos,
      catClothing,
      groomingAndCare,
      catToys,
      scratchingPosts,
      foodMixes,
      bowlsAndDrinkers,
      sticksAndSupplements,
      nestsAndHides,
      mineralSupplements,
      waterHeaters,
      wetAndDryFeedMixes,
      salineSolutionsAndAdditives,
      fishFood,
      aquariumsAndAccessories,
      aquariumFilters,
      aquariumLighting,
      aquariumDecor,
      reptileFood,
      terrariums,
      terrariumHeaters,
      terrariumDecor,
      terrariumThermometers,
      rodentFood,
      rodentCages,
      rodentToys,
      rodentBedding,
      rodentTreats,

      birdFood,
      birdCagesAndAviaries,
      birdToys,
      birdVitamins,
      birdFeedersAndDrinkers,
    ] = subCategory;

    const products = await Promise.all([
      this.prisma.products.create({
        data: {
          productName: 'Про Полнорационный – Сухой корм для собак',
          productPrice: 1000,
          productDescription:
            'Сухой корм для собак. Вкусно и полезно — одобрено питомцами.',
          brandId: purinaProPlan.id,
          categoryId: dryDogFood.id,
          productPhoto: '/fixtures/products/dog-food.webp',
          existence: true,
          sales: false,
          productWeight: 10,
          productManufacturer: 'Испания',
          productAge: 'Взрослый',
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Про Полнорационный – Сухой корм для собак',
          productPrice: 600,
          productDescription:
            'Сухой корм для собак. Вкусно и полезно — одобрено питомцами.',
          brandId: purinaProPlan.id,
          categoryId: dryDogFood.id,
          productPhoto: '/fixtures/products/dog-food.webp',
          existence: true,
          sales: false,
          productWeight: 5,
          productManufacturer: 'Испания',
          productAge: 'Взрослый',
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Зоо Полнорационный – Влажный корм для собак',
          productPrice: 800,
          productDescription:
            'Влажный корм для собак. Сбалансированная формула для лучшего самочувствия.',
          brandId: purinaProPlan.id,
          categoryId: wetDogFood.id,
          productPhoto: '/fixtures/products/dog-food.webp',
          existence: true,
          sales: false,
          productWeight: 5,
          productManufacturer: 'Испания',
          productAge: 'Взрослый',
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Зоо Полнорационный – Влажный корм для собак',
          productPrice: 650,
          productDescription:
            'Влажный корм для собак. Сбалансированная формула для лучшего самочувствия.',
          brandId: avz.id,
          categoryId: wetDogFood.id,
          productPhoto: '/fixtures/products/dog-food.webp',
          existence: true,
          sales: false,
          productWeight: 5,
          productManufacturer: 'Испания',
          productAge: 'Взрослый',
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Зоо Универсальный – Шампуни и гели для собак',
          productPrice: 2300,
          productDescription:
            'Шампуни и гели для собак. Сбалансированная формула для лучшего самочувствия.',
          brandId: avz.id,
          categoryId: dogShampoosAndGels.id,
          productPhoto: '/fixtures/products/dog-food.webp',
          existence: true,
          sales: false,
          productWeight: 5,
          productManufacturer: 'Испания',
          productAge: 'Взрослый',
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Зоо Универсальный – Шампуни и гели для собак',
          productPrice: 1500,
          productDescription:
            'Шампуни и гели для собак. Сбалансированная формула для лучшего самочувствия.',
          brandId: avz.id,
          categoryId: dogShampoosAndGels.id,
          productPhoto: '/fixtures/products/dog-food.webp',
          existence: true,
          sales: false,
          productWeight: 5,
          productManufacturer: 'Испания',
          productAge: 'Взрослый',
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Люкс Стандарт – Одежда для собак',
          productPrice: 1400,
          productDescription:
            'Одежда для собак. Прочная и надежная конструкция.',
          brandId: avz.id,
          categoryId: dogClothing.id,
          productPhoto: '/fixtures/products/dog-food.webp',
          existence: true,
          sales: false,
          productWeight: 5,
          productManufacturer: 'Испания',
          productAge: 'Взрослый',
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Люкс Стандарт – Одежда для собак',
          productPrice: 1200,
          productDescription:
            'Одежда для собак. Прочная и надежная конструкция.',
          brandId: bayer.id,
          categoryId: dogClothing.id,
          productPhoto: '/fixtures/products/dog-food.webp',
          existence: true,
          sales: false,
          productWeight: 5,
          productManufacturer: 'Испания',
          productAge: 'Взрослый',
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Эко Повседневный – Лежаки и подушки для собак',
          productPrice: 950,
          productDescription:
            'Лежаки и подушки для собак. Подходит для чувствительных питомцев.',
          brandId: bayer.id,
          categoryId: dogBedsAndCushions.id,
          productPhoto: '/fixtures/products/dog-food.webp',
          existence: true,
          sales: false,
          productWeight: 5,
          productManufacturer: 'Испания',
          productAge: 'Взрослый',
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Эко Повседневный – Лежаки и подушки для собак',
          productPrice: 1100,
          productDescription:
            'Лежаки и подушки для собак. Подходит для чувствительных питомцев.',
          brandId: bayer.id,
          categoryId: dogBedsAndCushions.id,
          productPhoto: '/fixtures/products/dog-food.webp',
          existence: true,
          sales: false,
          productWeight: 5,
          productManufacturer: 'Испания',
          productAge: 'Взрослый',
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Био Стандарт – Питание для щенков',
          productPrice: 1100,
          productDescription:
            'Питание для щенков. Содержит все необходимые элементы для здоровья питомца.',
          brandId: catchHow.id,
          categoryId: puppyFood.id,
          productPhoto: '/fixtures/products/dog-food.webp',
          existence: true,
          sales: false,
          productWeight: 5,
          productManufacturer: 'Испания',
          productAge: 'Взрослый',
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Био Стандарт – Питание для щенков',
          productPrice: 1100,
          productDescription:
            'Питание для щенков. Содержит все необходимые элементы для здоровья питомца.',
          brandId: catchHow.id,
          categoryId: puppyFood.id,
          productPhoto: '/fixtures/products/dog-food.webp',
          existence: true,
          sales: false,
          productWeight: 5,
          productManufacturer: 'Испания',
          productAge: 'Взрослый',
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Люкс Стандарт – Переноски для собак',
          productPrice: 1100,
          productDescription:
            'Переноски для собак. Прост в применении и эффективен.',
          brandId: dogShow.id,
          categoryId: foodMixes.id,
          productPhoto: '/fixtures/products/treats.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Люкс Стандарт – Переноски для собак',
          productPrice: 1100,
          productDescription:
            'Переноски для собак. Прост в применении и эффективен.',
          brandId: dogShow.id,
          categoryId: dogCarriers.id,
          productPhoto: '/fixtures/products/treats.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Люкс Стандарт – Переноски для собак',
          productPrice: 1100,
          productDescription:
            'Переноски для собак. Прост в применении и эффективен.',
          brandId: flexi.id,
          categoryId: dogCarriers.id,
          productPhoto: '/fixtures/products/treats.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Про Стандарт – Сухой корм для кошек',
          productPrice: 1100,
          productDescription:
            'Сухой корм для кошек. Подходит для чувствительных питомцев.',
          brandId: flexi.id,
          categoryId: dryCatFood.id,
          productPhoto: '/fixtures/products/treats.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Про Стандарт – Сухой корм для кошек',
          productPrice: 1100,
          productDescription:
            'Сухой корм для кошек. Подходит для чувствительных питомцев.',
          brandId: friskies.id,
          categoryId: dryCatFood.id,
          productPhoto: '/fixtures/products/treats.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Люкс Стандарт – Влажный корм для кошек',
          productPrice: 1100,
          productDescription:
            'Влажный корм для кошек. Разработан с учетом потребностей животных.',
          brandId: friskies.id,
          categoryId: wetCatFood.id,
          productPhoto: '/fixtures/products/treats.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Люкс Стандарт – Влажный корм для кошек',
          productPrice: 1100,
          productDescription:
            'Влажный корм для кошек. Разработан с учетом потребностей животных.',
          brandId: gourmet.id,
          categoryId: wetCatFood.id,
          productPhoto: '/fixtures/products/cat-food.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Комфорт Стандарт – Шампуни для кошек',
          productPrice: 1100,
          productDescription:
            'Шампуни для кошек. Идеально подходит для повседневного использования.',
          brandId: gourmet.id,
          categoryId: catShampoos.id,
          productPhoto: '/fixtures/products/cat-food.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Комфорт Стандарт – Шампуни для кошек',
          productPrice: 1100,
          productDescription:
            'Шампуни для кошек. Идеально подходит для повседневного использования.',
          brandId: happyCat.id,
          categoryId: catShampoos.id,
          productPhoto: '/fixtures/products/cat-food.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Комфорт Гипоаллергенный – Одежда для кошек',
          productPrice: 1100,
          productDescription:
            'Одежда для кошек. Прочная и надежная конструкция.',
          brandId: happyCat.id,
          categoryId: catClothing.id,
          productPhoto: '/fixtures/products/cat-food.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Комфорт Гипоаллергенный – Одежда для кошек',
          productPrice: 1100,
          productDescription:
            'Одежда для кошек. Прочная и надежная конструкция.',
          brandId: happyDog.id,
          categoryId: catClothing.id,
          productPhoto: '/fixtures/products/cat-food.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Натур Гипоаллергенный – Средства груминга и ухода',
          productPrice: 1100,
          productDescription:
            'Средства груминга и ухода. Разработан с учетом потребностей животных.',
          brandId: happyDog.id,
          categoryId: groomingAndCare.id,
          productPhoto: '/fixtures/products/cat-food.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Натур Гипоаллергенный – Средства груминга и ухода',
          productPrice: 1100,
          productDescription:
            'Средства груминга и ухода. Разработан с учетом потребностей животных.',
          brandId: ROYAL_CANIN.id,
          categoryId: groomingAndCare.id,
          productPhoto: '/fixtures/products/cat-food.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Натур Полнорационный – Игрушки для кошек',
          productPrice: 1100,
          productDescription:
            'Игрушки для кошек. Подходит для чувствительных питомцев.',
          brandId: ROYAL_CANIN.id,
          categoryId: catToys.id,
          productPhoto: '/fixtures/products/vitamins.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Натур Полнорационный – Игрушки для кошек',
          productPrice: 1100,
          productDescription:
            'Игрушки для кошек. Подходит для чувствительных питомцев.',
          brandId: WOLF_OF_WILDERNESS.id,
          categoryId: catToys.id,
          productPhoto: '/fixtures/products/vitamins.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Ультра Полнорационный – Когтеточки',
          productPrice: 1100,
          productDescription:
            'Когтеточки. Помогает поддерживать активность и энергию.',
          brandId: WOLF_OF_WILDERNESS.id,
          categoryId: scratchingPosts.id,
          productPhoto: '/fixtures/products/vitamins.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Ультра Полнорационный – Когтеточки',
          productPrice: 1100,
          productDescription:
            'Когтеточки. Помогает поддерживать активность и энергию.',
          brandId: James_Wellbeloved.id,
          categoryId: scratchingPosts.id,
          productPhoto: '/fixtures/products/vitamins.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Про Повседневный – Пищевые смеси',
          productPrice: 1100,
          productDescription: 'Пищевые смеси. Прочная и надежная конструкция.',
          brandId: James_Wellbeloved.id,
          categoryId: foodMixes.id,
          productPhoto: '/fixtures/products/vitamins.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Про Повседневный – Пищевые смеси',
          productPrice: 1100,
          productDescription: 'Пищевые смеси. Прочная и надежная конструкция.',
          brandId: hills.id,
          categoryId: foodMixes.id,
          productPhoto: '/fixtures/products/vitamins.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Про Универсальный – Миски и поилки',
          productPrice: 1100,
          productDescription:
            'Миски и поилки. Помогает поддерживать активность и энергию.',
          brandId: hills.id,
          categoryId: bowlsAndDrinkers.id,
          productPhoto: '/fixtures/products/vitamins.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Про Универсальный – Миски и поилки',
          productPrice: 1100,
          productDescription:
            'Миски и поилки. Помогает поддерживать активность и энергию.',
          brandId: ArdenGrange.id,
          categoryId: bowlsAndDrinkers.id,
          productPhoto: '/fixtures/products/Dog_Toys.webp',
          existence: true,
          sales: true,
          endDateSales: new Date('2025-05-10T00:00:00.000Z'),
          startDateSales: new Date('2025-05-03T00:00:00.000Z'),
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Комфорт Гипоаллергенный – Палочки и витаминные добавки',
          productPrice: 1100,
          productDescription:
            'Палочки и витаминные добавки. Содержит все необходимые элементы для здоровья питомца.',
          brandId: ArdenGrange.id,
          categoryId: sticksAndSupplements.id,
          productPhoto: '/fixtures/products/Dog_Toys.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Комфорт Гипоаллергенный – Палочки и витаминные добавки',
          productPrice: 1100,
          productDescription:
            'Палочки и витаминные добавки. Содержит все необходимые элементы для здоровья питомца.',
          brandId: Applaws.id,
          categoryId: nestsAndHides.id,
          productPhoto: '/fixtures/products/Dog_Toys.webp',
          existence: true,
          sales: true,
          endDateSales: new Date('2025-05-10T00:00:00.000Z'),
          startDateSales: new Date('2025-05-03T00:00:00.000Z'),
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Ультра Стандарт – Гнезда и укрытия',
          productPrice: 1100,
          productDescription:
            'Гнезда и укрытия. Вкусно и полезно — одобрено питомцами.',
          brandId: Applaws.id,
          categoryId: nestsAndHides.id,
          productPhoto: '/fixtures/products/Dog_Toys.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Комфорт Гипоаллергенный – Минеральные добавки',
          productPrice: 1100,
          productDescription:
            'Минеральные добавки. Вкусно и полезно — одобрено питомцами.',
          brandId: Burns.id,
          categoryId: mineralSupplements.id,
          productPhoto: '/fixtures/products/Dog_Toys.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Комфорт Гипоаллергенный – Минеральные добавки',
          productPrice: 1100,
          productDescription:
            'Минеральные добавки. Вкусно и полезно — одобрено питомцами.',
          brandId: Burns.id,
          categoryId: mineralSupplements.id,
          productPhoto: '/fixtures/products/Dog_Toys.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Комфорт Универсальный – Обогреватели для воды',
          productPrice: 1100,
          productDescription:
            'Обогреватели для воды. Разработан с учетом потребностей животных.',
          brandId: Whiskas.id,
          categoryId: waterHeaters.id,
          productPhoto: '/fixtures/products/treats.webp',
          existence: true,
          sales: true,
          endDateSales: new Date('2025-05-10T00:00:00.000Z'),
          startDateSales: new Date('2025-05-03T00:00:00.000Z'),
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Комфорт Универсальный – Обогреватели для воды',
          productPrice: 1100,
          productDescription:
            'Обогреватели для воды. Разработан с учетом потребностей животных.',
          brandId: Whiskas.id,
          categoryId: waterHeaters.id,
          productPhoto: '/fixtures/products/treats.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName:
            'Зоо Универсальный – Влажные и сухие смеси для кормления',
          productPrice: 1100,
          productDescription:
            'Влажные и сухие смеси. Идеально подходит для повседневного использования.',
          brandId: CFL.id,
          categoryId: wetAndDryFeedMixes.id,
          productPhoto: '/fixtures/products/treats.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName:
            'Зоо Универсальный – Влажные и сухие смеси для кормления',
          productPrice: 1100,
          productDescription:
            'Влажные и сухие смеси. Идеально подходит для повседневного использования.',
          brandId: CFL.id,
          categoryId: wetAndDryFeedMixes.id,
          productPhoto: '/fixtures/products/treats.webp',
          existence: true,
          sales: true,
          endDateSales: new Date('2025-05-10T00:00:00.000Z'),
          startDateSales: new Date('2025-05-03T00:00:00.000Z'),
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Комфорт Гипоаллергенный – Солевые растворы и добавки',
          productPrice: 1100,
          productDescription:
            'Солевые растворы и добавки. Прочная и надежная конструкция.',
          brandId: Cosma.id,
          categoryId: salineSolutionsAndAdditives.id,
          productPhoto: '/fixtures/products/treats.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Комфорт Гипоаллергенный – Солевые растворы и добавки',
          productPrice: 1100,
          productDescription:
            'Солевые растворы и добавки. Прочная и надежная конструкция.',
          brandId: Cosma.id,
          categoryId: salineSolutionsAndAdditives.id,
          productPhoto: '/fixtures/products/treats.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Натур Полнорационный – Корм для рыб',
          productPrice: 1100,
          productDescription: 'Корм для рыб. Прост в применении и эффективен.',
          brandId: purizon.id,
          categoryId: fishFood.id,
          productPhoto: '/fixtures/products/treats.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Натур Полнорационный – Корм для рыб',
          productPrice: 1100,
          productDescription: 'Корм для рыб. Прост в применении и эффективен.',
          brandId: purizon.id,
          categoryId: fishFood.id,
          productPhoto: '/fixtures/products/cat_scratcher.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Комфорт Премиум – Аквариумы и аксессуары',
          productPrice: 1100,
          productDescription:
            'Аквариумы и аксессуары. Прост в применении и эффективен.',
          brandId: RosiesFarm.id,
          categoryId: aquariumsAndAccessories.id,
          productPhoto: '/fixtures/products/cat_scratcher.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Комфорт Премиум – Аквариумы и аксессуары',
          productPrice: 1100,
          productDescription:
            'Аквариумы и аксессуары. Прост в применении и эффективен.',
          brandId: RosiesFarm.id,
          categoryId: aquariumsAndAccessories.id,
          productPhoto: '/fixtures/products/cat_scratcher.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Натур Стандарт – Фильтры для аквариумов',
          productPrice: 1100,
          productDescription:
            'Фильтры для аквариумов. Удобен в использовании дома и в поездке.',
          brandId: Tigerino.id,
          categoryId: aquariumFilters.id,
          productPhoto: '/fixtures/products/cat_scratcher.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Натур Стандарт – Фильтры для аквариумов',
          productPrice: 1100,
          productDescription:
            'Фильтры для аквариумов. Удобен в использовании дома и в поездке.',
          brandId: Tigerino.id,
          categoryId: aquariumFilters.id,
          productPhoto: '/fixtures/products/cat_scratcher.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Люкс Гипоаллергенный – Освещение для аквариумов',
          productPrice: 1100,
          productDescription:
            'Освещение для аквариумов. Прочная и надежная конструкция.',
          brandId: Pedigree.id,
          categoryId: aquariumLighting.id,
          productPhoto: '/fixtures/products/cat_scratcher.webp',
          existence: true,
          sales: true,
          endDateSales: new Date('2025-05-10T00:00:00.000Z'),
          startDateSales: new Date('2025-05-03T00:00:00.000Z'),
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Люкс Гипоаллергенный – Освещение для аквариумов',
          productPrice: 1100,
          productDescription:
            'Освещение для аквариумов. Прочная и надежная конструкция.',
          brandId: Pedigree.id,
          categoryId: aquariumLighting.id,
          productPhoto: '/fixtures/products/cat_scratcher.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Люкс Премиум – Декорации для аквариумов',
          productPrice: 1100,
          productDescription:
            'Декорации для аквариумов. Вкусно и полезно — одобрено питомцами.',
          brandId: SkogsFRO.id,
          categoryId: aquariumDecor.id,
          productPhoto: '/fixtures/products/collars.webp',
          existence: true,
          sales: true,
          endDateSales: new Date('2025-05-10T00:00:00.000Z'),
          startDateSales: new Date('2025-05-03T00:00:00.000Z'),
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Люкс Премиум – Декорации для аквариумов',
          productPrice: 1100,
          productDescription:
            'Декорации для аквариумов. Вкусно и полезно — одобрено питомцами.',
          brandId: SkogsFRO.id,
          categoryId: aquariumDecor.id,
          productPhoto: '/fixtures/products/collars.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Зоо Премиум – Корм для рептилий',
          productPrice: 1100,
          productDescription:
            'Корм для рептилий. Идеально подходит для повседневного использования.',
          brandId: Qushy.id,
          categoryId: reptileFood.id,
          productPhoto: '/fixtures/products/collars.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Зоо Премиум – Корм для рептилий',
          productPrice: 1100,
          productDescription:
            'Корм для рептилий. Идеально подходит для повседневного использования.',
          brandId: Qushy.id,
          categoryId: reptileFood.id,
          productPhoto: '/fixtures/products/collars.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Люкс Стандарт – Террариумы',
          productPrice: 1100,
          productDescription: 'Террариумы. Прост в применении и эффективен.',
          brandId: Mnyams.id,
          categoryId: terrariums.id,
          productPhoto: '/fixtures/products/collars.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Люкс Стандарт – Террариумы',
          productPrice: 1100,
          productDescription: 'Террариумы. Прост в применении и эффективен.',
          brandId: Mnyams.id,
          categoryId: terrariums.id,
          productPhoto: '/fixtures/products/collars.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Макси Гипоаллергенный – Обогреватели для террариумов',
          productPrice: 1100,
          productDescription:
            'Обогреватели. Сбалансированная формула для лучшего самочувствия.',
          brandId: Brit.id,
          categoryId: terrariumHeaters.id,
          productPhoto: '/fixtures/products/collars.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Макси Гипоаллергенный – Обогреватели для террариумов',
          productPrice: 1100,
          productDescription:
            'Обогреватели. Сбалансированная формула для лучшего самочувствия.',
          brandId: Brit.id,
          categoryId: terrariumHeaters.id,
          productPhoto: '/fixtures/products/aquarium_filter.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Мини Полнорационный – Декорации для террариумов',
          productPrice: 1100,
          productDescription:
            'Декорации. Сбалансированная формула для лучшего самочувствия.',
          brandId: Jarvi.id,
          categoryId: terrariumDecor.id,
          productPhoto: '/fixtures/products/aquarium_filter.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Мини Полнорационный – Декорации для террариумов',
          productPrice: 1100,
          productDescription:
            'Декорации. Сбалансированная формула для лучшего самочувствия.',
          brandId: Jarvi.id,
          categoryId: terrariumDecor.id,
          productPhoto: '/fixtures/products/aquarium_filter.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Мини Гипоаллергенный – Термометры и гигрометры',
          productPrice: 1100,
          productDescription:
            'Термометры. Подходит для чувствительных питомцев.',
          brandId: Jarvi.id,
          categoryId: terrariumThermometers.id,
          productPhoto: '/fixtures/products/aquarium_filter.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Мини Гипоаллергенный – Термометры и гигрометры',
          productPrice: 1100,
          productDescription:
            'Термометры. Подходит для чувствительных питомцев.',
          brandId: Jarvi.id,
          categoryId: terrariumThermometers.id,
          productPhoto: '/fixtures/products/aquarium_filter.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Про Полнорационный – Корм для грызунов',
          productPrice: 1100,
          productDescription:
            'Корм для грызунов. Подходит для чувствительных питомцев.',
          brandId: Jarvi.id,
          categoryId: rodentFood.id,
          productPhoto: '/fixtures/products/aquarium_filter.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Про Полнорационный – Корм для грызунов',
          productPrice: 1100,
          productDescription:
            'Корм для грызунов. Подходит для чувствительных питомцев.',
          brandId: ANIMAL_ISLAND.id,
          categoryId: rodentFood.id,
          productPhoto: '/fixtures/products/aquarium_filter.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Макси Стандарт – Клетки для грызунов',
          productPrice: 1100,
          productDescription:
            'Клетки для грызунов. Удобен в использовании дома и в поездке.',
          brandId: ANIMAL_ISLAND.id,
          categoryId: rodentCages.id,
          productPhoto: '/fixtures/products/aquarium_filter.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Макси Стандарт – Клетки для грызунов',
          productPrice: 1100,
          productDescription:
            'Клетки для грызунов. Удобен в использовании дома и в поездке.',
          brandId: ANIMAL_ISLAND.id,
          categoryId: rodentCages.id,
          productPhoto: '/fixtures/products/aquarium_filter.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Про Гипоаллергенный – Игрушки для грызунов',
          productPrice: 1100,
          productDescription: 'Игрушки. Подходит для чувствительных питомцев.',
          brandId: ANIMAL_ISLAND.id,
          categoryId: rodentToys.id,
          productPhoto: '/fixtures/products/rabbit_feeder.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Про Гипоаллергенный – Игрушки для грызунов',
          productPrice: 1100,
          productDescription: 'Игрушки. Подходит для чувствительных питомцев.',
          brandId: ANIMAL_ISLAND.id,
          categoryId: rodentToys.id,
          productPhoto: '/fixtures/products/rabbit_feeder.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Эко Универсальный – Наполнитель для клеток',
          productPrice: 1100,
          productDescription: 'Наполнитель. Прост в применении и эффективен.',
          brandId: Pedigree.id,
          categoryId: rodentBedding.id,
          productPhoto: '/fixtures/products/rabbit_feeder.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Эко Универсальный – Наполнитель для клеток',
          productPrice: 1100,
          productDescription: 'Наполнитель. Прост в применении и эффективен.',
          brandId: Pedigree.id,
          categoryId: rodentBedding.id,
          productPhoto: '/fixtures/products/rabbit_feeder.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Зоо Повседневный – Лакомства для грызунов',
          productPrice: 1100,
          productDescription:
            'Лакомства. Разработан с учетом потребностей животных.',
          brandId: Pedigree.id,
          categoryId: rodentTreats.id,
          productPhoto: '/fixtures/products/rabbit_feeder.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Зоо Повседневный – Лакомства для грызунов',
          productPrice: 1100,
          productDescription:
            'Лакомства. Разработан с учетом потребностей животных.',
          brandId: Pedigree.id,
          categoryId: rodentTreats.id,
          productPhoto: '/fixtures/products/rabbit_feeder.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Натур Премиум – Корм для птиц',
          productPrice: 1100,
          productDescription: 'Корм для птиц. Прост в применении и эффективен.',
          brandId: Burns.id,
          categoryId: birdFood.id,
          productPhoto: '/fixtures/products/rabbit_feeder.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Натур Премиум – Корм для птиц',
          productPrice: 1100,
          productDescription: 'Корм для птиц. Прост в применении и эффективен.',
          brandId: Burns.id,
          categoryId: birdFood.id,
          productPhoto: '/fixtures/products/rabbit_feeder.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Эко Полнорационный – Клетки и вольеры',
          productPrice: 1100,
          productDescription:
            'Клетки. Идеально подходит для повседневного использования.',
          brandId: Burns.id,
          categoryId: birdCagesAndAviaries.id,
          productPhoto: '/fixtures/products/rabbit_feeder.webp',
          existence: true,
          sales: false,
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Эко Полнорационный – Клетки и вольеры',
          productPrice: 1100,
          productDescription:
            'Клетки. Идеально подходит для повседневного использования.',
          brandId: Burns.id,
          categoryId: birdToys.id,
          productPhoto: '/fixtures/products/hay.webp',
          existence: true,
          sales: false,
          productWeight: 10,
          productManufacturer: 'Германия',
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Макси Универсальный – Игрушки для птиц',
          productPrice: 500,
          productDescription:
            'Игрушки. Удобен в использовании дома и в поездке.',
          brandId: Burns.id,
          categoryId: birdToys.id,
          productPhoto: '/fixtures/products/hay.webp',
          existence: true,
          sales: false,
          productWeight: 3.5,
          productManufacturer: 'Германия',
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Макси Универсальный – Игрушки для птиц',
          productPrice: 800,
          productDescription:
            'Игрушки. Удобен в использовании дома и в поездке.',
          brandId: Burns.id,
          categoryId: birdVitamins.id,
          productPhoto: '/fixtures/products/hay.webp',
          existence: true,
          sales: false,
          productWeight: 6,
          productManufacturer: 'Германия',
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Люкс Повседневный – Витамины и добавки для птиц',
          productPrice: 900,
          productDescription:
            'Витамины. Идеально подходит для повседневного использования.',
          brandId: James_Wellbeloved.id,
          categoryId: birdVitamins.id,
          productPhoto: '/fixtures/products/hay.webp',
          existence: true,
          sales: false,
          productWeight: 6.5,
          productManufacturer: 'Германия',
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Про Гипоаллергенный – Поилки и кормушки',
          productPrice: 1000,
          productDescription:
            'Поилки и кормушки. Прочная и надежная конструкция.',
          brandId: James_Wellbeloved.id,
          categoryId: foodMixes.id,
          productPhoto: '/fixtures/products/hay.webp',
          existence: true,
          sales: false,
          productWeight: 8,
          productManufacturer: 'Германия',
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Про Гипоаллергенный – Поилки и кормушки',
          productPrice: 400,
          productDescription:
            'Поилки и кормушки. Прочная и надежная конструкция.',
          brandId: James_Wellbeloved.id,
          categoryId: foodMixes.id,
          productPhoto: '/fixtures/products/hay.webp',
          existence: true,
          sales: false,
          productWeight: 4,
          productManufacturer: 'Германия',
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Сено для лошади',
          productPrice: 350,
          productDescription:
            'Описание для продукта 1. Полезный и качественный товар для домашних животных.',
          brandId: James_Wellbeloved.id,
          categoryId: foodMixes.id,
          productPhoto: '/fixtures/products/hay.webp',
          existence: true,
          sales: false,
          productWeight: 3.35,
          productManufacturer: 'Германия',
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Сено для лошади',
          productPrice: 2100,
          productDescription:
            'Описание для продукта 1. Полезный и качественный товар для домашних животных.',
          brandId: James_Wellbeloved.id,
          categoryId: birdFeedersAndDrinkers.id,
          productPhoto: '/fixtures/products/hay.webp',
          existence: true,
          sales: false,
          productWeight: 17,
          productManufacturer: 'Германия',
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Сено для лошади',
          productPrice: 3500,
          productDescription:
            'Описание для продукта 1. Полезный и качественный товар для домашних животных.',
          brandId: James_Wellbeloved.id,
          categoryId: birdFeedersAndDrinkers.id,
          productPhoto: '/fixtures/products/hay.webp',
          existence: true,
          sales: false,
          productWeight: 20,
          productManufacturer: 'Германия',
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Сено для лошади',
          productPrice: 1500,
          productDescription:
            'Описание для продукта 1. Полезный и качественный товар для домашних животных.',
          brandId: James_Wellbeloved.id,
          categoryId: scratchingPosts.id,
          productPhoto: '/fixtures/products/hay.webp',
          existence: true,
          sales: false,
          productWeight: 10,
          productManufacturer: 'Германия',
        },
      }),
      this.prisma.products.create({
        data: {
          productName: 'Сено для лошади',
          productPrice: 2100,
          productDescription:
            'Описание для продукта 1. Полезный и качественный товар для домашних животных.',
          brandId: ROYAL_CANIN.id,
          categoryId: scratchingPosts.id,
          productPhoto: '/fixtures/products/hay.webp',
          existence: true,
          sales: false,
          productWeight: 12,
          productManufacturer: 'Германия',
        },
      }),
    ]);

    const [firstProd, secondProd, thirdProd, fourthProd, fifthProd, sixthProd] =
      products;

    await Promise.all([
      this.prisma.order.create({
        data: {
          userId: miranaClient.id,
          status: 'Confirmed',
          address: 'г. Бишкек, ул. Ленина 123',
          guestPhone: miranaClient.phone,
          guestEmail: miranaClient.email,
          guestName: miranaClient.firstName,
          guestLastName: miranaClient.secondName,
          paymentMethod: 'ByCard',
          deliveryMethod: 'Delivery',
          orderComment: 'Позвонить перед доставкой',
          useBonus: true,
          bonusUsed: 100,
          items: {
            create: [
              {
                quantity: 2,
                orderAmount: 2400,
                productId: firstProd.id,
              },
              {
                quantity: 1,
                orderAmount: 2500,
                productId: secondProd.id,
              },
            ],
          },
        },
      }),

      this.prisma.order.create({
        data: {
          userId: ilonClient.id,
          status: 'Pending',
          address: 'г. Ош, ул. Гагарина 99',
          guestPhone: ilonClient.phone,
          guestEmail: ilonClient.email,
          guestName: ilonClient.firstName,
          guestLastName: ilonClient.secondName,
          paymentMethod: 'ByCash',
          deliveryMethod: 'PickUp',
          items: {
            create: [
              {
                quantity: 3,
                orderAmount: 1500,
                productId: thirdProd.id,
              },
            ],
          },
        },
      }),

      this.prisma.order.create({
        data: {
          userId: michaelClient.id,
          status: 'Delivered',
          address: 'г. Кара-Балта, ул. Муратова 17',
          guestPhone: michaelClient.phone,
          guestEmail: michaelClient.email,
          guestName: michaelClient.firstName,
          guestLastName: michaelClient.secondName,
          paymentMethod: 'ByCard',
          deliveryMethod: 'Delivery',
          orderComment: 'Пожалуйста, не забудьте пакет.',
          items: {
            create: [
              {
                quantity: 1,
                orderAmount: 4500,
                productId: fourthProd.id,
              },
            ],
          },
        },
      }),

      this.prisma.order.create({
        data: {
          userId: cristianoClient.id,
          status: 'Shipped',
          address: 'г. Бишкек, ул. Футбольная 7',
          guestPhone: cristianoClient.phone,
          guestEmail: cristianoClient.email,
          guestName: cristianoClient.firstName,
          guestLastName: cristianoClient.secondName,
          paymentMethod: 'ByCash',
          deliveryMethod: 'Delivery',
          useBonus: true,
          bonusUsed: 50,
          items: {
            create: [
              {
                quantity: 1,
                orderAmount: 500,
                productId: fifthProd.id,
              },
              {
                quantity: 2,
                orderAmount: 1000,
                productId: sixthProd.id,
              },
            ],
          },
        },
      }),

      this.prisma.order.create({
        data: {
          userId: miranaClient.id,
          status: 'Confirmed',
          address: 'г. Бишкек, ул. Ленина 123',
          guestPhone: miranaClient.phone,
          guestEmail: miranaClient.email,
          guestName: miranaClient.firstName,
          guestLastName: miranaClient.secondName,
          paymentMethod: 'ByCard',
          deliveryMethod: 'Delivery',
          orderComment: 'Позвонить перед доставкой',
          useBonus: true,
          bonusUsed: 100,
          items: {
            create: [
              {
                quantity: 2,
                orderAmount: 2400,
                productId: firstProd.id,
              },
              {
                quantity: 1,
                orderAmount: 2500,
                productId: secondProd.id,
              },
            ],
          },
        },
      }),

      this.prisma.order.create({
        data: {
          userId: ilonClient.id,
          status: 'Pending',
          address: 'г. Ош, ул. Гагарина 99',
          guestPhone: ilonClient.phone,
          guestEmail: ilonClient.email,
          guestName: ilonClient.firstName,
          guestLastName: ilonClient.secondName,
          paymentMethod: 'ByCash',
          deliveryMethod: 'PickUp',
          items: {
            create: [
              {
                quantity: 3,
                orderAmount: 1500,
                productId: thirdProd.id,
              },
            ],
          },
        },
      }),

      this.prisma.order.create({
        data: {
          userId: michaelClient.id,
          status: 'Delivered',
          address: 'г. Кара-Балта, ул. Муратова 17',
          guestPhone: michaelClient.phone,
          guestEmail: michaelClient.email,
          guestName: michaelClient.firstName,
          guestLastName: michaelClient.secondName,
          paymentMethod: 'ByCard',
          deliveryMethod: 'Delivery',
          orderComment: 'Пожалуйста, не забудьте пакет.',
          items: {
            create: [
              {
                quantity: 1,
                orderAmount: 4500,
                productId: fourthProd.id,
              },
            ],
          },
        },
      }),

      // Заказ от cristianoClient
      this.prisma.order.create({
        data: {
          userId: cristianoClient.id,
          status: 'Shipped',
          address: 'г. Бишкек, ул. Футбольная 7',
          guestPhone: cristianoClient.phone,
          guestEmail: cristianoClient.email,
          guestName: cristianoClient.firstName,
          guestLastName: cristianoClient.secondName,
          paymentMethod: 'ByCash',
          deliveryMethod: 'Delivery',
          useBonus: true,
          bonusUsed: 50,
          items: {
            create: [
              {
                quantity: 1,
                orderAmount: 500,
                productId: fifthProd.id,
              },
              {
                quantity: 2,
                orderAmount: 1000,
                productId: sixthProd.id,
              },
            ],
          },
        },
      }),

      this.prisma.order.create({
        data: {
          userId: miranaClient.id,
          status: 'Confirmed',
          address: 'г. Бишкек, ул. Ленина 123',
          guestPhone: miranaClient.phone,
          guestEmail: miranaClient.email,
          guestName: miranaClient.firstName,
          guestLastName: miranaClient.secondName,
          paymentMethod: 'ByCard',
          deliveryMethod: 'Delivery',
          orderComment: 'Позвонить перед доставкой',
          useBonus: true,
          bonusUsed: 100,
          items: {
            create: [
              {
                quantity: 2,
                orderAmount: 2400,
                productId: firstProd.id,
              },
              {
                quantity: 1,
                orderAmount: 2500,
                productId: secondProd.id,
              },
            ],
          },
        },
      }),

      this.prisma.order.create({
        data: {
          userId: ilonClient.id,
          status: 'Pending',
          address: 'г. Ош, ул. Гагарина 99',
          guestPhone: ilonClient.phone,
          guestEmail: ilonClient.email,
          guestName: ilonClient.firstName,
          guestLastName: ilonClient.secondName,
          paymentMethod: 'ByCash',
          deliveryMethod: 'PickUp',
          items: {
            create: [
              {
                quantity: 3,
                orderAmount: 1500,
                productId: thirdProd.id,
              },
            ],
          },
        },
      }),

      this.prisma.order.create({
        data: {
          userId: michaelClient.id,
          status: 'Delivered',
          address: 'г. Кара-Балта, ул. Муратова 17',
          guestPhone: michaelClient.phone,
          guestEmail: michaelClient.email,
          guestName: michaelClient.firstName,
          guestLastName: michaelClient.secondName,
          paymentMethod: 'ByCard',
          deliveryMethod: 'Delivery',
          orderComment: 'Пожалуйста, не забудьте пакет.',
          items: {
            create: [
              {
                quantity: 1,
                orderAmount: 4500,
                productId: fourthProd.id,
              },
            ],
          },
        },
      }),

      // Заказ от cristianoClient
      this.prisma.order.create({
        data: {
          userId: cristianoClient.id,
          status: 'Shipped',
          address: 'г. Бишкек, ул. Футбольная 7',
          guestPhone: cristianoClient.phone,
          guestEmail: cristianoClient.email,
          guestName: cristianoClient.firstName,
          guestLastName: cristianoClient.secondName,
          paymentMethod: 'ByCash',
          deliveryMethod: 'Delivery',
          useBonus: true,
          bonusUsed: 50,
          items: {
            create: [
              {
                quantity: 1,
                orderAmount: 500,
                productId: fifthProd.id,
              },
              {
                quantity: 2,
                orderAmount: 1000,
                productId: sixthProd.id,
              },
            ],
          },
        },
      }),

      this.prisma.order.create({
        data: {
          userId: miranaClient.id,
          status: 'Confirmed',
          address: 'г. Бишкек, ул. Ленина 123',
          guestPhone: miranaClient.phone,
          guestEmail: miranaClient.email,
          guestName: miranaClient.firstName,
          guestLastName: miranaClient.secondName,
          paymentMethod: 'ByCard',
          deliveryMethod: 'Delivery',
          orderComment: 'Позвонить перед доставкой',
          useBonus: true,
          bonusUsed: 100,
          items: {
            create: [
              {
                quantity: 2,
                orderAmount: 2400,
                productId: firstProd.id,
              },
              {
                quantity: 1,
                orderAmount: 2500,
                productId: secondProd.id,
              },
            ],
          },
        },
      }),

      this.prisma.order.create({
        data: {
          userId: ilonClient.id,
          status: 'Pending',
          address: 'г. Ош, ул. Гагарина 99',
          guestPhone: ilonClient.phone,
          guestEmail: ilonClient.email,
          guestName: ilonClient.firstName,
          guestLastName: ilonClient.secondName,
          paymentMethod: 'ByCash',
          deliveryMethod: 'PickUp',
          items: {
            create: [
              {
                quantity: 3,
                orderAmount: 1500,
                productId: thirdProd.id,
              },
            ],
          },
        },
      }),

      this.prisma.order.create({
        data: {
          userId: michaelClient.id,
          status: 'Delivered',
          address: 'г. Кара-Балта, ул. Муратова 17',
          guestPhone: michaelClient.phone,
          guestEmail: michaelClient.email,
          guestName: michaelClient.firstName,
          guestLastName: michaelClient.secondName,
          paymentMethod: 'ByCard',
          deliveryMethod: 'Delivery',
          orderComment: 'Пожалуйста, не забудьте пакет.',
          items: {
            create: [
              {
                quantity: 1,
                orderAmount: 4500,
                productId: fourthProd.id,
              },
            ],
          },
        },
      }),

      // Заказ от cristianoClient
      this.prisma.order.create({
        data: {
          userId: cristianoClient.id,
          status: 'Shipped',
          address: 'г. Бишкек, ул. Футбольная 7',
          guestPhone: cristianoClient.phone,
          guestEmail: cristianoClient.email,
          guestName: cristianoClient.firstName,
          guestLastName: cristianoClient.secondName,
          paymentMethod: 'ByCash',
          deliveryMethod: 'Delivery',
          useBonus: true,
          bonusUsed: 50,
          items: {
            create: [
              {
                quantity: 1,
                orderAmount: 500,
                productId: fifthProd.id,
              },
              {
                quantity: 2,
                orderAmount: 1000,
                productId: sixthProd.id,
              },
            ],
          },
        },
      }),

      this.prisma.order.create({
        data: {
          userId: miranaClient.id,
          status: 'Confirmed',
          address: 'г. Бишкек, ул. Ленина 123',
          guestPhone: miranaClient.phone,
          guestEmail: miranaClient.email,
          guestName: miranaClient.firstName,
          guestLastName: miranaClient.secondName,
          paymentMethod: 'ByCard',
          deliveryMethod: 'Delivery',
          orderComment: 'Позвонить перед доставкой',
          useBonus: true,
          bonusUsed: 100,
          items: {
            create: [
              {
                quantity: 2,
                orderAmount: 2400,
                productId: firstProd.id,
              },
              {
                quantity: 1,
                orderAmount: 2500,
                productId: secondProd.id,
              },
            ],
          },
        },
      }),

      this.prisma.order.create({
        data: {
          userId: ilonClient.id,
          status: 'Pending',
          address: 'г. Ош, ул. Гагарина 99',
          guestPhone: ilonClient.phone,
          guestEmail: ilonClient.email,
          guestName: ilonClient.firstName,
          guestLastName: ilonClient.secondName,
          paymentMethod: 'ByCash',
          deliveryMethod: 'PickUp',
          items: {
            create: [
              {
                quantity: 3,
                orderAmount: 1500,
                productId: thirdProd.id,
              },
            ],
          },
        },
      }),

      this.prisma.order.create({
        data: {
          userId: michaelClient.id,
          status: 'Delivered',
          address: 'г. Кара-Балта, ул. Муратова 17',
          guestPhone: michaelClient.phone,
          guestEmail: michaelClient.email,
          guestName: michaelClient.firstName,
          guestLastName: michaelClient.secondName,
          paymentMethod: 'ByCard',
          deliveryMethod: 'Delivery',
          orderComment: 'Пожалуйста, не забудьте пакет.',
          items: {
            create: [
              {
                quantity: 1,
                orderAmount: 4500,
                productId: fourthProd.id,
              },
            ],
          },
        },
      }),

      // Заказ от cristianoClient
      this.prisma.order.create({
        data: {
          userId: cristianoClient.id,
          status: 'Shipped',
          address: 'г. Бишкек, ул. Футбольная 7',
          guestPhone: cristianoClient.phone,
          guestEmail: cristianoClient.email,
          guestName: cristianoClient.firstName,
          guestLastName: cristianoClient.secondName,
          paymentMethod: 'ByCash',
          deliveryMethod: 'Delivery',
          useBonus: true,
          bonusUsed: 50,
          items: {
            create: [
              {
                quantity: 1,
                orderAmount: 500,
                productId: fifthProd.id,
              },
              {
                quantity: 2,
                orderAmount: 1000,
                productId: sixthProd.id,
              },
            ],
          },
        },
      }),

      this.prisma.order.create({
        data: {
          userId: miranaClient.id,
          status: 'Confirmed',
          address: 'г. Бишкек, ул. Ленина 123',
          guestPhone: miranaClient.phone,
          guestEmail: miranaClient.email,
          guestName: miranaClient.firstName,
          guestLastName: miranaClient.secondName,
          paymentMethod: 'ByCard',
          deliveryMethod: 'Delivery',
          orderComment: 'Позвонить перед доставкой',
          useBonus: true,
          bonusUsed: 100,
          items: {
            create: [
              {
                quantity: 2,
                orderAmount: 2400,
                productId: firstProd.id,
              },
              {
                quantity: 1,
                orderAmount: 2500,
                productId: secondProd.id,
              },
            ],
          },
        },
      }),

      this.prisma.order.create({
        data: {
          userId: ilonClient.id,
          status: 'Pending',
          address: 'г. Ош, ул. Гагарина 99',
          guestPhone: ilonClient.phone,
          guestEmail: ilonClient.email,
          guestName: ilonClient.firstName,
          guestLastName: ilonClient.secondName,
          paymentMethod: 'ByCash',
          deliveryMethod: 'PickUp',
          items: {
            create: [
              {
                quantity: 3,
                orderAmount: 1500,
                productId: thirdProd.id,
              },
            ],
          },
        },
      }),

      this.prisma.order.create({
        data: {
          userId: michaelClient.id,
          status: 'Delivered',
          address: 'г. Кара-Балта, ул. Муратова 17',
          guestPhone: michaelClient.phone,
          guestEmail: michaelClient.email,
          guestName: michaelClient.firstName,
          guestLastName: michaelClient.secondName,
          paymentMethod: 'ByCard',
          deliveryMethod: 'Delivery',
          orderComment: 'Пожалуйста, не забудьте пакет.',
          items: {
            create: [
              {
                quantity: 1,
                orderAmount: 4500,
                productId: fourthProd.id,
              },
            ],
          },
        },
      }),

      // Заказ от cristianoClient
      this.prisma.order.create({
        data: {
          userId: cristianoClient.id,
          status: 'Shipped',
          address: 'г. Бишкек, ул. Футбольная 7',
          guestPhone: cristianoClient.phone,
          guestEmail: cristianoClient.email,
          guestName: cristianoClient.firstName,
          guestLastName: cristianoClient.secondName,
          paymentMethod: 'ByCash',
          deliveryMethod: 'Delivery',
          useBonus: true,
          bonusUsed: 50,
          items: {
            create: [
              {
                quantity: 1,
                orderAmount: 500,
                productId: fifthProd.id,
              },
              {
                quantity: 2,
                orderAmount: 1000,
                productId: sixthProd.id,
              },
            ],
          },
        },
      }),

      this.prisma.order.create({
        data: {
          userId: miranaClient.id,
          status: 'Confirmed',
          address: 'г. Бишкек, ул. Ленина 123',
          guestPhone: miranaClient.phone,
          guestEmail: miranaClient.email,
          guestName: miranaClient.firstName,
          guestLastName: miranaClient.secondName,
          paymentMethod: 'ByCard',
          deliveryMethod: 'Delivery',
          orderComment: 'Позвонить перед доставкой',
          useBonus: true,
          bonusUsed: 100,
          items: {
            create: [
              {
                quantity: 2,
                orderAmount: 2400,
                productId: firstProd.id,
              },
              {
                quantity: 1,
                orderAmount: 2500,
                productId: secondProd.id,
              },
            ],
          },
        },
      }),

      this.prisma.order.create({
        data: {
          userId: ilonClient.id,
          status: 'Pending',
          address: 'г. Ош, ул. Гагарина 99',
          guestPhone: ilonClient.phone,
          guestEmail: ilonClient.email,
          guestName: ilonClient.firstName,
          guestLastName: ilonClient.secondName,
          paymentMethod: 'ByCash',
          deliveryMethod: 'PickUp',
          items: {
            create: [
              {
                quantity: 3,
                orderAmount: 1500,
                productId: thirdProd.id,
              },
            ],
          },
        },
      }),

      this.prisma.order.create({
        data: {
          userId: michaelClient.id,
          status: 'Delivered',
          address: 'г. Кара-Балта, ул. Муратова 17',
          guestPhone: michaelClient.phone,
          guestEmail: michaelClient.email,
          guestName: michaelClient.firstName,
          guestLastName: michaelClient.secondName,
          paymentMethod: 'ByCard',
          deliveryMethod: 'Delivery',
          orderComment: 'Пожалуйста, не забудьте пакет.',
          items: {
            create: [
              {
                quantity: 1,
                orderAmount: 4500,
                productId: fourthProd.id,
              },
            ],
          },
        },
      }),

      // Заказ от cristianoClient
      this.prisma.order.create({
        data: {
          userId: cristianoClient.id,
          status: 'Shipped',
          address: 'г. Бишкек, ул. Футбольная 7',
          guestPhone: cristianoClient.phone,
          guestEmail: cristianoClient.email,
          guestName: cristianoClient.firstName,
          guestLastName: cristianoClient.secondName,
          paymentMethod: 'ByCash',
          deliveryMethod: 'Delivery',
          useBonus: true,
          bonusUsed: 50,
          items: {
            create: [
              {
                quantity: 1,
                orderAmount: 500,
                productId: fifthProd.id,
              },
              {
                quantity: 2,
                orderAmount: 1000,
                productId: sixthProd.id,
              },
            ],
          },
        },
      }),

      this.prisma.order.create({
        data: {
          userId: miranaClient.id,
          status: 'Confirmed',
          address: 'г. Бишкек, ул. Ленина 123',
          guestPhone: miranaClient.phone,
          guestEmail: miranaClient.email,
          guestName: miranaClient.firstName,
          guestLastName: miranaClient.secondName,
          paymentMethod: 'ByCard',
          deliveryMethod: 'Delivery',
          orderComment: 'Позвонить перед доставкой',
          useBonus: true,
          bonusUsed: 100,
          items: {
            create: [
              {
                quantity: 2,
                orderAmount: 2400,
                productId: firstProd.id,
              },
              {
                quantity: 1,
                orderAmount: 2500,
                productId: secondProd.id,
              },
            ],
          },
        },
      }),

      this.prisma.order.create({
        data: {
          userId: ilonClient.id,
          status: 'Pending',
          address: 'г. Ош, ул. Гагарина 99',
          guestPhone: ilonClient.phone,
          guestEmail: ilonClient.email,
          guestName: ilonClient.firstName,
          guestLastName: ilonClient.secondName,
          paymentMethod: 'ByCash',
          deliveryMethod: 'PickUp',
          items: {
            create: [
              {
                quantity: 3,
                orderAmount: 1500,
                productId: thirdProd.id,
              },
            ],
          },
        },
      }),

      this.prisma.order.create({
        data: {
          userId: michaelClient.id,
          status: 'Delivered',
          address: 'г. Кара-Балта, ул. Муратова 17',
          guestPhone: michaelClient.phone,
          guestEmail: michaelClient.email,
          guestName: michaelClient.firstName,
          guestLastName: michaelClient.secondName,
          paymentMethod: 'ByCard',
          deliveryMethod: 'Delivery',
          orderComment: 'Пожалуйста, не забудьте пакет.',
          items: {
            create: [
              {
                quantity: 1,
                orderAmount: 4500,
                productId: fourthProd.id,
              },
            ],
          },
        },
      }),

      // Заказ от cristianoClient
      this.prisma.order.create({
        data: {
          userId: cristianoClient.id,
          status: 'Shipped',
          address: 'г. Бишкек, ул. Футбольная 7',
          guestPhone: cristianoClient.phone,
          guestEmail: cristianoClient.email,
          guestName: cristianoClient.firstName,
          guestLastName: cristianoClient.secondName,
          paymentMethod: 'ByCash',
          deliveryMethod: 'Delivery',
          useBonus: true,
          bonusUsed: 50,
          items: {
            create: [
              {
                quantity: 1,
                orderAmount: 500,
                productId: fifthProd.id,
              },
              {
                quantity: 2,
                orderAmount: 1000,
                productId: sixthProd.id,
              },
            ],
          },
        },
      }),
    ]);

    await Promise.all([
      this.prisma.statistic.create({
        data: {
          date: new Date(),
          pickUpStatistic: 423,
          deliveryStatistic: 324,
          paymentByCard: 4563,
          paymentByCash: 7566,
          bonusUsage: 1232,
          canceledOrderCount: 422,
          totalOrders: 131414,
        },
      }),
    ]);

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
