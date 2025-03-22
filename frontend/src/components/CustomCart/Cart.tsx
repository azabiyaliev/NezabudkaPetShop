import Table from '@mui/joy/Table';
import { ICart } from '../../types';
import React from 'react';
import { apiUrl } from '../../globalConstants.ts';
import { Box } from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import { Add, Remove } from '@mui/icons-material';

interface Props {
  carts: ICart[];
}

const Cart:React.FC<Props> = ({carts}) => {
  const tableName = ['Цена', 'Количество', 'Итого'];
  return (
    <Table
      aria-label="table with ellipsis texts"
      noWrap
      sx={{ mx: 'auto', width: '70%', textAlign: 'center' }}
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
        <tr>
          <td style={{
            fontSize: '15px'
          }}>
            <ClearOutlinedIcon fontSize="small"/>
          </td>
          <td>
            <Box sx={{
              display: 'flex',
              alignItems: 'center'
            }}>
              <Box>
                <img
                  style={{
                    width: '70px',
                    height: '80px'
                  }}
                  src={apiUrl + product.product.productPhoto}
                  alt={product.product.productName}
                />
              </Box>
              <Box sx={{marginLeft: '20px'}}>
                <Typography>
                  {product.product.productName}
                </Typography>
              </Box>
            </Box>
            {/*<img src={apiUrl + "/" + product.product.productPhoto} alt={product.product.productName}*/}
            {/*     style={{*/}
            {/*       width: '90px',*/}
            {/*       height: '60px',*/}
            {/*       margin: '10px 0'*/}
            {/*     }}/>*/}
          </td>
          <td style={{
            fontSize: '18px'
          }}>
            <Typography level="h2" sx={{ fontSize: 'md', color: 'rgba(250, 179, 1, 1)' }}>
              {product.product.productPrice.toLocaleString()} сом
            </Typography>
          </td>
          <td style={{
            textAlign: 'center'
          }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                pt: 4,
                mb: 2,
              }}
            >
              <IconButton
                size="sm"
                variant="outlined"
                // onClick={() => setCount((c) => c - 1)}
              >
                <Remove />
              </IconButton>
              <Typography textColor="text.secondary" sx={{ fontWeight: 'md' }}>
                {product.quantity}
              </Typography>
              <IconButton
                size="sm"
                variant="outlined"
                // onClick={() => setCount((c) => c + 1)}
              >
                <Add />
              </IconButton>
            </Box>
          </td>
          <td>

          </td>
        </tr>
      ))}
      {/*{brands.map((brand, index) => (*/}
      {/*  <Brand key={brand.id || index} brand={brand} index={index}/>*/}
      {/*))}*/}
      </tbody>
    </Table>
  );
};

export default Cart;