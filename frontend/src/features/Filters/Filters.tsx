import { Box, Typography, Checkbox, FormControlLabel, FormGroup, TextField, Button, Divider, Slider, Switch } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectProductsByCategory } from '../../store/products/productsSlice';
import axiosApi from '../../axiosApi';
import {
  getFilteredProducts,
  getFilteredProductsWithoutCategory,
  getProductsByCategory
} from '../../store/products/productsThunk';

// Интерфейс для опций фильтров
interface FilterOptions {
  brands: string[];
  sizes: string[];
  ages: string[];
  weights: number[];
  foodClasses: string[];
  manufacturers: string[];
}

// Интерфейс для выбранных фильтров
interface SelectedFilters {
  brands: string[];
  sizes: string[];
  ages: string[];
  weights: number[];
  foodClasses: string[];
  manufacturers: string[];
  existence: boolean | null;
  sales: boolean | null;
  minPrice: number | null;
  maxPrice: number | null;
}

const Filters = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const allProducts = useAppSelector(selectProductsByCategory);
  
  // Состояние для опций фильтра
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    brands: [],
    sizes: [],
    ages: [],
    weights: [],
    foodClasses: [],
    manufacturers: [],
  });
  
  // Состояние для ценового диапазона
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  
  // Состояние для выбранных фильтров
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    brands: [],
    sizes: [],
    ages: [],
    weights: [],
    foodClasses: [],
    manufacturers: [],
    existence: null,
    sales: null,
    minPrice: null,
    maxPrice: null,
  });
  
  // Загрузка опций фильтра при изменении категории
  useEffect(() => {
    if (!id) return;
    
    const fetchFilterOptions = async () => {
      try {
        // Запрос к API для получения всех возможных значений фильтров
        const response = await axiosApi.get(`/products/categories/${id}/filter-options`);
        const options = response.data;
        
        // Устанавливаем опции фильтров из ответа сервера
        setFilterOptions({
          brands: options.brands || [],
          sizes: options.sizes || [],
          ages: options.ages || [],
          weights: options.weights || [],
          foodClasses: options.foodClasses || [],
          manufacturers: options.manufacturers || [],
        });
        
        // Если в ответе есть диапазон цен, устанавливаем его
        if (options.priceRange) {
          setPriceRange([options.priceRange.min, options.priceRange.max]);
        } else {
          // В противном случае, вычисляем диапазон на основе имеющихся товаров
          const prices = allProducts.map(p => p.productPrice);
          const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
          const maxPrice = prices.length > 0 ? Math.max(...prices) : 5000;
          setPriceRange([minPrice, maxPrice]);
        }
      } catch (error) {
        console.error('Ошибка при загрузке опций фильтра:', error);
        
        // В случае ошибки, создаем опции на основе имеющихся продуктов
        const uniqueBrands = [...new Set(allProducts.filter(p => p.brand?.title).map(p => p.brand.title))];
        const uniqueSizes = [...new Set(allProducts.filter(p => p.productSize).map(p => p.productSize as string))];
        const uniqueAges = [...new Set(allProducts.filter(p => p.productAge).map(p => p.productAge as string))];
        const uniqueWeights = [...new Set(allProducts.filter(p => p.productWeight).map(p => p.productWeight as number))];
        const uniqueFoodClasses = [...new Set(allProducts.filter(p => p.productFeedClass).map(p => p.productFeedClass as string))];
        const uniqueManufacturers = [...new Set(allProducts.filter(p => p.productManufacturer).map(p => p.productManufacturer as string))];
        
        // Находим минимальную и максимальную цену
        const prices = allProducts.map(p => p.productPrice);
        const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 5000;
        
        // Устанавливаем диапазон цен
        setPriceRange([minPrice, maxPrice]);
        
        // Устанавливаем опции фильтров
        setFilterOptions({
          brands: uniqueBrands,
          sizes: uniqueSizes,
          ages: uniqueAges,
          weights: uniqueWeights,
          foodClasses: uniqueFoodClasses,
          manufacturers: uniqueManufacturers,
        });
      }
    };
    
    fetchFilterOptions();
  }, [id]);
  
  // Обработчик изменения чекбоксов фильтров

  const handleFilterChange = (filterType: keyof SelectedFilters, value: string | boolean | number | null) => {
    setSelectedFilters(prev => {
      const currentValues = prev[filterType];

      let updatedFilters: SelectedFilters;

      if (Array.isArray(currentValues)) {
        const arrayValues = currentValues as string[];

        updatedFilters = {
          ...prev,
          [filterType]: arrayValues.includes(value as string)
            ? arrayValues.filter(v => v !== value)
            : [...arrayValues, value as string],
        } as SelectedFilters;
      } else {
        updatedFilters = {
          ...prev,
          [filterType]: value as boolean | number | null,
        };
      }
      setTimeout(() => applyFilters(updatedFilters), 0);

      return updatedFilters;
    });
  };

  // Обработчик изменения диапазона цен
  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setPriceRange(newValue as [number, number]);

      const updatedFilters = {
        ...selectedFilters,
        minPrice: newValue[0],
        maxPrice: newValue[1]
      };

      setTimeout(() => applyFilters(updatedFilters), 300);
    }
  };

  // Обработчик изменения полей ввода цен
  const handlePriceInputChange = (type: 'min' | 'max', value: number) => {
    if (type === 'min') {
      setPriceRange([value, priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], value]);
    }

    // Применяем фильтры с небольшой задержкой, чтобы избежать частых запросов при быстром вводе
    const updatedFilters = {
      ...selectedFilters,
      minPrice: type === 'min' ? value : priceRange[0],
      maxPrice: type === 'max' ? value : priceRange[1]
    };
    
    setTimeout(() => applyFilters(updatedFilters), 500);
  };

  type FiltersToApply = Partial<Pick<SelectedFilters,
    'brands' | 'sizes' | 'ages' | 'weights' | 'foodClasses' | 'manufacturers' | 'existence' | 'sales' | 'minPrice' | 'maxPrice'
  >>;

  const applyFilters = (filters: SelectedFilters = selectedFilters) => {
    const filtersToApply: FiltersToApply = {};

    if (filters.brands.length > 0) filtersToApply.brands = filters.brands;
    if (filters.sizes.length > 0) filtersToApply.sizes = filters.sizes;
    if (filters.ages.length > 0) filtersToApply.ages = filters.ages;
    if (filters.weights.length > 0) filtersToApply.weights = filters.weights;
    if (filters.foodClasses.length > 0) filtersToApply.foodClasses = filters.foodClasses;
    if (filters.manufacturers.length > 0) filtersToApply.manufacturers = filters.manufacturers;
    if (filters.existence !== null) filtersToApply.existence = filters.existence;
    if (filters.sales !== null) filtersToApply.sales = filters.sales;

    if (filters.minPrice !== null) filtersToApply.minPrice = filters.minPrice;
    if (filters.maxPrice !== null) filtersToApply.maxPrice = filters.maxPrice;

    if (id) {
      dispatch(getFilteredProducts({
        categoryId: Number(id),
        filters: filtersToApply
      }));
    } else {
      dispatch(getFilteredProductsWithoutCategory(filtersToApply));
    }
  };

  // Сброс фильтров
  const resetFilters = () => {
    setSelectedFilters({
      brands: [],
      sizes: [],
      ages: [],
      weights: [],
      foodClasses: [],
      manufacturers: [],
      existence: null,
      sales: null,
      minPrice: null,
      maxPrice: null,
    });
    
    // Загружаем все товары категории заново
    if (id) {
      dispatch(getProductsByCategory(Number(id)));
    }
  };
  
  return (
    <Box sx={{ mt: 2, p: 2, bgcolor: '#f8f8f8', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Фильтры
      </Typography>
      
      {/* Цена */}
      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Цена</Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={priceRange[1] > 5000 ? priceRange[1] : 5000}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            size="small"
            label="От"
            type="number"
            value={priceRange[0]}
            onChange={(e) => handlePriceInputChange('min', Number(e.target.value))}
            inputProps={{ min: 0 }}
            sx={{ width: '45%' }}
          />
          <TextField
            size="small"
            label="До"
            type="number"
            value={priceRange[1]}
            onChange={(e) => handlePriceInputChange('max', Number(e.target.value))}
            inputProps={{ min: priceRange[0] }}
            sx={{ width: '45%' }}
          />
        </Box>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Наличие и акции */}
      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Наличие и акции</Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={selectedFilters.existence === true}
                onChange={() => handleFilterChange('existence', selectedFilters.existence === true ? null : true)}
              />
            }
            label="В наличии"
          />
          <FormControlLabel
            control={
              <Switch
                checked={selectedFilters.sales === true}
                onChange={() => handleFilterChange('sales', selectedFilters.sales === true ? null : true)}
              />
            }
            label="Со скидкой"
          />
        </FormGroup>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Бренды */}
      {filterOptions.brands.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>Бренд</Typography>
          <FormGroup>
            {filterOptions.brands.map(brand => (
              <FormControlLabel
                key={brand}
                control={
                  <Checkbox
                    checked={selectedFilters.brands.includes(brand)}
                    onChange={() => handleFilterChange('brands', brand)}
                    size="small"
                  />
                }
                label={brand}
              />
            ))}
          </FormGroup>
          <Divider sx={{ my: 2 }} />
        </Box>
      )}
      
      {/* Размер */}
      {filterOptions.sizes.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>Размер</Typography>
          <FormGroup>
            {filterOptions.sizes.map(size => (
              <FormControlLabel
                key={size}
                control={
                  <Checkbox
                    checked={selectedFilters.sizes.includes(size)}
                    onChange={() => handleFilterChange('sizes', size)}
                    size="small"
                  />
                }
                label={size}
              />
            ))}
          </FormGroup>
          <Divider sx={{ my: 2 }} />
        </Box>
      )}
      
      {/* Возраст */}
      {filterOptions.ages.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>Возраст</Typography>
          <FormGroup>
            {filterOptions.ages.map(age => (
              <FormControlLabel
                key={age}
                control={
                  <Checkbox
                    checked={selectedFilters.ages.includes(age)}
                    onChange={() => handleFilterChange('ages', age)}
                    size="small"
                  />
                }
                label={age}
              />
            ))}
          </FormGroup>
          <Divider sx={{ my: 2 }} />
        </Box>
      )}
      
      {/* Вес */}
      {filterOptions.weights.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>Вес</Typography>
          <FormGroup>
            {filterOptions.weights.map(weight => (
              <FormControlLabel
                key={weight}
                control={
                  <Checkbox
                    checked={selectedFilters.weights.includes(weight)}
                    onChange={() => handleFilterChange('weights', weight)}
                    size="small"
                  />
                }
                label={`${weight} г`}
              />
            ))}
          </FormGroup>
          <Divider sx={{ my: 2 }} />
        </Box>
      )}
      
      {/* Класс корма */}
      {filterOptions.foodClasses.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>Класс корма</Typography>
          <FormGroup>
            {filterOptions.foodClasses.map(foodClass => (
              <FormControlLabel
                key={foodClass}
                control={
                  <Checkbox
                    checked={selectedFilters.foodClasses.includes(foodClass)}
                    onChange={() => handleFilterChange('foodClasses', foodClass)}
                    size="small"
                  />
                }
                label={foodClass}
              />
            ))}
          </FormGroup>
          <Divider sx={{ my: 2 }} />
        </Box>
      )}
      
      {/* Производитель */}
      {filterOptions.manufacturers.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>Производитель</Typography>
          <FormGroup>
            {filterOptions.manufacturers.map(manufacturer => (
              <FormControlLabel
                key={manufacturer}
                control={
                  <Checkbox
                    checked={selectedFilters.manufacturers.includes(manufacturer)}
                    onChange={() => handleFilterChange('manufacturers', manufacturer)}
                    size="small"
                  />
                }
                label={manufacturer}
              />
            ))}
          </FormGroup>
        </Box>
      )}
      
      {/* Кнопка сброса фильтров */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button 
          variant="outlined" 
          onClick={resetFilters}
          fullWidth
        >
          Сбросить
        </Button>
      </Box>
    </Box>
  );
};

export default Filters;