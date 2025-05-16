const fs = require('fs');

const generateMockData = () => {
  const brands = Array.from({ length: 10 }, (_, i) => ({
    title: `Бренд ${i + 1}`,
    logo: `https://example.com/logo${i + 1}.png`,
    description: `Описание бренда ${i + 1}`,
  }));

  const categories = Array.from({ length: 10 }, (_, i) => ({
    title: `Категория ${i + 1}`,
  }));

  const products = Array.from({ length: 100 }, (_, i) => ({
    productName: `Продукт ${i + 1}`,
    productPhoto: `https://example.com/product${i + 1}.png`,
    productPrice: Math.floor(Math.random() * 10000) + 100,
    productDescription: `Описание продукта ${i + 1}`,
    brandTitle: brands[i % brands.length].title,
    categoryTitle: categories[i % categories.length].title,
    existence: true,
    sales: false,
    promoPercentage: null,
    promoPrice: null,
    productComment: '',
    productWeight: Math.random() * 10,
    productSize: 'M',
    productAge: '1+',
    productFeedClass: 'Premium',
    productManufacturer: 'Завод корма',
    startDateSales: null,
    endDateSales: null,
  }));

  const mockData = {
    brands,
    categories,
    products,
  };

  fs.writeFileSync('1c-mock-data.json', JSON.stringify(mockData, null, 2), 'utf-8');
  console.log('✅ Файл 1c-mock-data.json успешно создан!');
};

generateMockData();
