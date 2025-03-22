import { Box, Typography, Divider, CardMedia } from '@mui/material';
import '../css/product.css'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { useEffect } from 'react';
import { getOneProduct } from '../../../features/products/productsThunk.ts';
import { useParams } from 'react-router-dom';
import { selectProduct } from '../../../features/products/productsSlice.ts';
import { apiUrl } from '../../../globalConstants.ts';


const ProductPage = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const product = useAppSelector(selectProduct);

  useEffect(() => {
    dispatch(getOneProduct(Number(id)))
  }, [dispatch, id]);

  if (!product) {
    return <Typography sx={{ padding: 4 }}>Загрузка товара...</Typography>;
  }

  return (
    <Box className='product-box'>
      <Box className='product-grid'>
        <Box sx={{width: '35%'}}>
          <CardMedia
            component="img"
            image={apiUrl + "/" + product.productPhoto}
            alt="A Pro Сухой корм"
            sx={{ width: "80%"}}
          />
        </Box>
        <Box sx={{width: '65%'}} >
          <Typography sx={{fontSize: '15px'}} gutterBottom>
            Главная / Собаки / Сухой корм / A Pro
          </Typography>
          <Typography variant="h5" fontWeight="normal">
            {product.productName}
          </Typography>

          <Typography variant="h6" color="orange" mt={1}>
            {product.existence ? "Есть" : 'Нет в наличии'}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box component="ul" className="product-specs">
            <li><strong>Бренд</strong> A Pro</li>
            <li><strong>Страна-производитель</strong> Таиланд</li>
            <li><strong>Класс корма</strong> Эконом</li>
            <li><strong>Вес</strong> 20 кг</li>
            <li><strong>Форма выпуска</strong> Крокет</li>
            <li><strong>Возраст собаки</strong> Взрослые</li>
            <li><strong>Размер собаки</strong> Маленькие породы, Средние породы, Крупные породы</li>
          </Box>
          <Typography variant="body2" mt={2}>
            Артикул: 6936363902146
          </Typography>
          <Typography variant="body2" mt={1}>
            Поделиться: 📘 🐦 📌 💼 ✈️
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductPage;
