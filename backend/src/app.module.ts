import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SeedService } from './seed/seed.service';
import { PrismaService } from './prisma/prisma.service';
import { BrandsController } from './brands/brands.controller';
import { PrismaModule } from './prisma/prisma.module';
import { BrandsModule } from './brands/brands.module';
import { BrandsService } from './brands/brands.service';
import { EditionSiteModule } from './editionsite/editionsite.module';
import { EditionSiteController } from './editionsite/editionsite.controller';
import { EditionSiteService } from './editionsite/editionsite.service';
import { CategoryModule } from './category/category.module';
import { CategoryService } from './category/category.service';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule } from '@nestjs/config';
import { SeedModule } from './seed/seed.module';
import { ReviewsModule } from './reviews/reviews.module';
import { PhotoCarouselController } from './photo_carousel/photo_carousel.controller';
import { PhotoCarouselModule } from './photo_carousel/photo_carousel.module';
import { PhotoCarouselService } from './photo_carousel/photo_carousel.service';
import { FavoritesModule } from './favorites/favorites.module';
import { FavoritesService } from './favorites/favorites.service';
import { FavoritesController } from './favorites/favorites.controller';
import { TelegramModule } from './telegram/telegram.module';
import { TelegramService } from './telegram/telegram.service';
import { OrdersService } from './orders/orders.service';
import { TelegramController } from './telegram/telegram.controller';
import { CartController } from './cart/cart.controller';
import { CartModule } from './cart/cart.module';
import { CartService } from './cart/cart.service';
import { CartItemsModule } from './cart-items/cart-items.module';
import { CartItemsController } from './cart-items/cart-items.controller';
import { CartItemsService } from './cart-items/cart-items.service';
import { CompanyPageModule } from './company_page/company_page.module';
import { CompanyPageController } from './company_page/company_page.controller';
import { CompanyPageService } from './company_page/company_page.service';
import { BonusPageModule } from './bonus_program_page/bonus_program_pg.module';
import { BonusProgramService } from './bonus_program_page/bonus_program_pg.service';
import { BonusPageController } from './bonus_program_page/bonus_program_pg.controller';
import { DeliveryPageModule } from './delivery_page/delivery_page.module';
import { DeliveryPageController } from './delivery_page/delivery_page.conrtoller';
import { DeliveryPageService } from './delivery_page/delivery_page.service';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    BrandsModule,
    EditionSiteModule,
    CategoryModule,
    ProductsModule,
    OrdersModule,
    SeedModule,
    ConfigModule.forRoot(),
    ReviewsModule,
    PhotoCarouselModule,
    FavoritesModule,
    TelegramModule,
    CompanyPageModule,
    CartModule,
    CartItemsModule,
    BonusPageModule,
    DeliveryPageModule,
  ],
  controllers: [
    AppController,
    BrandsController,
    EditionSiteController,
    PhotoCarouselController,
    FavoritesController,
    TelegramController,
    CompanyPageController,
    CartController,
    CartItemsController,
    BonusPageController,
    DeliveryPageController,
  ],
  providers: [
    AppService,
    SeedService,
    PrismaService,
    BrandsService,
    EditionSiteService,
    CategoryService,
    PhotoCarouselService,
    FavoritesService,
    TelegramService,
    OrdersService,
    CompanyPageService,
    CartService,
    CartItemsService,
    BonusProgramService,
    DeliveryPageService,
  ],
})
export class AppModule {}
