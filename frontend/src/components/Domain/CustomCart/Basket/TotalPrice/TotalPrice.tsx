import React from 'react';
import { Box, List, ListItem, ListItemDecorator } from '@mui/joy';
import { ICart } from '../../../../../types';
import Typography from '@mui/joy/Typography';

interface Props {
  products: ICart[];
}

const TotalPrice:React.FC<Props> = ({products}) => {

  const productsToBuy: {price: number, amount: number}[] = products.map((product) => {
    if (product.product) {
      return {price: product.product.productPrice, amount: product.quantity};
    } else {
      return { price: 0, amount: 0 };
    }
  });

  const totalPriceProduct: number = productsToBuy.reduce((acc: number, item: { price: number, amount: number }) => {
    return acc + (item.price * item.amount);
  }, 0);

  const totalPrice: number = productsToBuy.reduce((acc: number, item: { price: number, amount: number }) => {
    return acc + (item.price * item.amount);
  }, 250);

  return (
    <Box sx={{
      border: '1px solid #e5e2dc',
      width: '400px',
      height: '300px',
      padding: '2rem',
      borderRadius: '20px'
    }}>
      <Typography sx={{
        fontFamily: 'Nunito, sans-serif',
        fontSize: '18px'
      }}>Итого:</Typography>
      <Typography
        level="h2"
        sx={{
          fontSize: '25px',
          mb: 0.5,
          fontFamily: 'Nunito, sans-serif',
          color: 'rgba(250, 179, 1, 1)',
      }}>
        {totalPrice.toLocaleString()} сом
      </Typography>
      <Box sx={{
        borderTop: '1px solid lightgray',
        margin: '20px 0'
      }}>
        <List aria-labelledby="decorated-list-demo">
          <ListItem>
            <ListItemDecorator>
              <img width="30" height="30"
                   src="https://img.icons8.com/quill/100/737373/overview-pages-3.png"
                   alt="overview-pages-3"/>
            </ListItemDecorator>
            <Typography sx={{
              width: '100%',
              fontFamily: 'Nunito, sans-serif',
              fontSize: '18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              Стоимость товаров:
              <span
                style={{
                  color: 'rgba(250, 179, 1, 1)',
                  fontWeight: 'bold'
                }}
              >{totalPriceProduct.toLocaleString()} сом</span>
            </Typography>
          </ListItem>
          <ListItem>
            <ListItemDecorator>
              <img width="30" height="30"
                   src="https://img.icons8.com/ios-glyphs/30/737373/percentage.png"
                   alt="percentage"/>
            </ListItemDecorator>
            <Typography sx={{
              width: '100%',
              fontFamily: 'Nunito, sans-serif',
              fontSize: '18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>Налоги:
              <span
                style={{
                  color: 'rgba(250, 179, 1, 1)',
                  fontWeight: 'bold'
                }}
              >0 сом</span>
            </Typography>
          </ListItem>
          <ListItem>
            <ListItemDecorator>
              <img width="30" height="30"
                   src="https://img.icons8.com/external-icongeek26-outline-icongeek26/64/737373/external-goods-transportation-icongeek26-outline-icongeek26-1.png"
                   alt="external-goods-transportation-icongeek26-outline-icongeek26-1"/>
            </ListItemDecorator>
            <Typography sx={{
              width: '100%',
              fontFamily: 'Nunito, sans-serif',
              fontSize: '18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>Доставка:
              <span
                style={{
                  color: 'rgba(250, 179, 1, 1)',
                  fontWeight: 'bold'
                }}
              >250 сом</span>
            </Typography>
          </ListItem>
        </List>
      </Box>

    </Box>
  );
};

export default TotalPrice;