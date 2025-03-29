import Table from '@mui/joy/Table';
import { ICart } from '../../../../types';
import React from 'react';
import Cart from './Cart/Cart.tsx';
import Typography from '@mui/joy/Typography';

interface Props {
  carts: ICart[];
}

const Carts:React.FC<Props> = ({carts}) => {
  const tableName = ['Цена', 'Количество', 'Итого'];

  const checkProductInCart: number[] = carts.map((product) => {
    return product.quantity;
  });

  const amount: number = checkProductInCart.reduce((acc: number, i: number) => {
    acc = acc + i;
    return acc;
  }, 0);

  const productsToBuy: {price: number, amount: number}[] = carts.map((product) => {
    if (product.product) {
      return {price: product.product.productPrice, amount: product.quantity};
    } else {
      return { price: 0, amount: 0 };
    }
  });

  const totalPrice: number = productsToBuy.reduce((acc: number, item: { price: number, amount: number }) => {
    return acc + (item.price * item.amount);
  }, 0);

  return (
    <Table
      aria-label="table with ellipsis texts"
      noWrap
      sx={{mx: 'auto', width: '100%', textAlign: 'center', margin: '40px 0'}}
    >
      <thead>
      <tr>
        <th style={{width: '50px', textAlign: 'center', fontSize: '16px'}}></th>
        <th style={{width: '40%', textAlign: 'center', fontSize: '16px'}}>Товар</th>
        {tableName.map((name, index) => (
          <th style={{textAlign: 'center', fontSize: '16px'}} key={name + index}>{name}</th>
        ))}
      </tr>
      </thead>
      <tbody>
      {carts.map((product) => (
        <Cart productCart={product} key={product.product.id}/>
      ))}
      </tbody>
      <tfoot>
      <tr>
        <td scope="row"></td>
        <td scope="row" style={{fontSize: '16px'}}><b>Итого:</b></td>
        <td scope="row"></td>
        <td scope="row" style={{fontSize: '16px'}}><b>{amount} шт.</b></td>
        <td scope="row">
          <Typography level="h2" sx={{fontSize: 'lg', color: 'rgba(250, 179, 1, 1)'}}>
            {totalPrice.toLocaleString()} сом
          </Typography>
        </td>
      </tr>
      </tfoot>
    </Table>
  );
};

export default Carts;