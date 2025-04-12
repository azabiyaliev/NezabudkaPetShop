import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { historyProduct } from '../../../types';
import { Link, useParams } from "react-router-dom";
import { selectProduct } from '../../../store/products/productsSlice.ts';
import { useEffect } from 'react';
import { getOneProduct } from '../../../store/products/productsThunk.ts';
import { addProductToHistory } from '../../../store/historyProduct/historyProductSlice.ts';
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { apiUrl } from '../../../globalConstants.ts';

const HistoryProduct = () => {
  const viewedProducts = useAppSelector((state) => state.history.history);
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const product = useAppSelector(selectProduct);

  useEffect(() => {
    dispatch(getOneProduct(Number(id)));
  }, [dispatch, id]);

  useEffect(() => {
    if (product && product.id !== undefined) {
      dispatch(addProductToHistory({
        productId: product.id,
        product: product
      }));
    }
  }, [dispatch, product]);

  return (
    <div>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom sx={{mb:5}}>
          История просмотров
        </Typography>
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'flex-start',
        }}>
          {viewedProducts
            .filter((item): item is historyProduct => !!item.product && !!item.product.productName)
            .map((item) => (
              <Card
                key={item.productId}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '10px',
                  width: 233,
                  height: 270,
                  borderRadius: 3,
                  boxShadow: 3,
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 6,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                  },
                }}
              >
                <Link to={`/product/${item.productId}`} style={{ textDecoration: 'none' }}>
                  <CardMedia
                    component="img"
                    image={apiUrl + '/' + item.product.productPhoto}
                    alt={item.product.productName}
                    sx={{
                      objectFit: 'cover',
                      width: "200px",
                      height: "150px",
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      margin: '0 auto',
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom noWrap sx={{color:"darkgreen"}}>
                      {item.product.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.product.existence ? 'В наличии' : 'Нет в наличии'}
                    </Typography>
                    <Typography variant="body2" color="text.primary" mt={1}>
                      Цена: {item.product.productPrice} ₽
                    </Typography>
                  </CardContent>
                </Link>
              </Card>
            ))}
        </Box>
      </Box>
    </div>
  );
};

export default HistoryProduct;