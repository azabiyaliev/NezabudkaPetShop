import { ProductsService } from '../products.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductsDto } from '../../dto/createProductsDto';
import { Readable } from 'node:stream';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;

  const mockPrisma = {
    products: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    productCategory: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    const mockCreateProductDto: CreateProductsDto = {
      productName: 'Testing product',
      productPhoto: '_23.jpg',
      productPrice: 500,
      productDescription: 'test description',
      brandId: 1,
      existence: 'true',
      categoryId: [4, 23, 55],
      sales: true,
      startDateSales: new Date(2025, 3, 28),
      endDateSales: new Date(2025, 4, 2),
      productManufacturer: 'test manufacturer',
      productSize: 'test size',
      productWeight: 1.5,
      productAge: '1+',
      productFeedClass: 'Premium',
      promoPercentage: 50,
      isBestseller: 'false',
    };

    it('should create new product', async () => {
      const mockProduct = {
        id: 1,
        ...mockCreateProductDto,
        sales: true,
        existence: true,
        promoPrice: 250,
        productCategory: mockCreateProductDto.categoryId.map((id) => ({
          category: { id, title: `Category ${id}` },
        })),
      };

      mockPrisma.products.create.mockResolvedValue(mockProduct);

      const result = await service.addProduct(mockCreateProductDto);

      expect(result).toEqual(mockProduct);
      expect(mockPrisma.products.create).toHaveBeenCalledWith({
        data: {
          productName: mockCreateProductDto.productName,
          productPhoto: mockCreateProductDto.productPhoto,
          productPrice: mockCreateProductDto.productPrice,
          productDescription: mockCreateProductDto.productDescription,
          brandId: mockCreateProductDto.brandId,
          existence: true,
          sales: true,
          startDateSales: mockCreateProductDto.startDateSales,
          endDateSales: mockCreateProductDto.endDateSales,
          productManufacturer: mockCreateProductDto.productManufacturer,
          productSize: mockCreateProductDto.productSize,
          productWeight: mockCreateProductDto.productWeight,
          productAge: mockCreateProductDto.productAge,
          productFeedClass: mockCreateProductDto.productFeedClass,
          promoPercentage: mockCreateProductDto.promoPercentage,
          promoPrice: 250,
          isBestseller: false,
          productCategory: {
            create: mockCreateProductDto.categoryId.map((id: number) => ({
              category: { connect: { id } },
            })),
          },
        },
        include: {
          brand: true,
          productCategory: {
            include: {
              category: { select: { id: true, title: true } },
            },
          },
        },
      });
    });
  });

  describe('updateProduct', () => {
    const mockDto: CreateProductsDto = {
      productName: 'Updated Product',
      productDescription: 'Updated Description',
      productPrice: 100,
      productPhoto: 'old_photo.jpg',
      brandId: 1,
      categoryId: [1, 2],
      existence: 'true',
      sales: true,
      startDateSales: new Date(2025, 4, 1),
      endDateSales: new Date(2025, 4, 30),
      productAge: 'Adult',
      productSize: 'Large',
      productManufacturer: 'Manufacturer',
      productFeedClass: 'Premium',
      productWeight: 2.5,
      promoPercentage: 10,
      isBestseller: 'false',
    };

    const mockFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'new_photo.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 1024,
      destination: '/tmp',
      filename: 'new_photo.jpg',
      path: '/tmp/new_photo.jpg',
      stream: new Readable(),
      buffer: Buffer.from('test'),
    };

    it('should update product', async () => {
      const existProduct = {
        id: 1,
        productName: 'Existing Product',
        productDescription: 'Existing Description',
        productPrice: 100,
        productPhoto: 'existing_photo.jpg',
        brandId: 1,
        categoryId: [1, 2],
        existence: true,
        sales: true,
        startDateSales: new Date(2025, 4, 30),
        endDateSales: new Date(2025, 5, 30),
      };

      const updatedProduct = {
        id: 1,
        productName: 'Updated Product',
        productDescription: 'Updated Description',
        productPrice: 100,
        promoPrice: 90,
        productPhoto: '/products/new_photo.jpg',
        brandId: 1,
        existence: true,
        sales: true,
        startDateSales: new Date(2025, 4, 1),
        endDateSales: new Date(2025, 4, 30),
        productAge: 'Adult',
        productSize: 'Large',
        productManufacturer: 'Manufacturer',
        productFeedClass: 'Premium',
        productWeight: 2.5,
        promoPercentage: 10,
        isBestseller: false,
        productCategory: [
          { category: { id: 1, title: 'Category 1' } },
          { category: { id: 2, title: 'Category 2' } },
        ],
        brand: { id: 1, name: 'Brand' },
      };

      mockPrisma.products.findUnique.mockResolvedValue(existProduct);
      mockPrisma.products.update.mockResolvedValue(updatedProduct);

      const result = await service.changeProductInfo(1, mockDto, mockFile);

      expect(result).toEqual(updatedProduct);
      expect(mockPrisma.products.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          productName: mockDto.productName,
          productDescription: mockDto.productDescription,
          productPrice: mockDto.productPrice,
          promoPrice: 90,
          productPhoto: '/products/new_photo.jpg',
          brandId: mockDto.brandId,
          existence: true,
          sales: true,
          startDateSales: mockDto.startDateSales,
          endDateSales: mockDto.endDateSales,
          productAge: mockDto.productAge,
          productSize: mockDto.productSize,
          productManufacturer: mockDto.productManufacturer,
          productFeedClass: mockDto.productFeedClass,
          productWeight: mockDto.productWeight,
          promoPercentage: mockDto.promoPercentage,
          isBestseller: false,
          productCategory: {
            deleteMany: {},
            create: mockDto.categoryId.map((id: number) => ({
              category: { connect: { id } },
            })),
          },
        },
        include: {
          brand: true,
          productCategory: {
            include: {
              category: { select: { id: true, title: true } },
            },
          },
        },
      });
    });
  });
});
