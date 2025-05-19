import React from 'react';
import { Box, List, ListItem, ListItemDecorator } from '@mui/joy';
import { ICartItem } from '../../../../../types';
import Typography from '@mui/joy/Typography';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useAppSelector } from '../../../../../app/hooks.ts';
import { selectUser } from '../../../../../store/users/usersSlice.ts';
import { SPACING } from '../../../../../globalStyles/stylesObjects.ts';

interface Props {
  products: ICartItem[];
  bonusUsed: number;
}

const TotalPrice: React.FC<Props> = ({ products, bonusUsed }) => {
  const user = useAppSelector(selectUser);

  const productsToBuy: { price: number; amount: number }[] = products.map(
    (product) => {
      if (product.product) {
        if (product.product.sales) {
          return {
            price: product.product.promoPrice,
            amount: product.quantity,
          };
        } else {
          return {
            price: product.product.productPrice,
            amount: product.quantity,
          };
        }
      } else {
        return { price: 0, amount: 0 };
      }
    },
  );

  const totalPriceProduct: number = productsToBuy.reduce(
    (acc: number, item: { price: number; amount: number }) => {
      return acc + item.price * item.amount;
    },
    0,
  );


  const bonusToReceive = totalPriceProduct * 0.01
  const finalTotalPrice: number = totalPriceProduct - bonusUsed;

  return (
    <Box
      sx={{
        padding: SPACING.xs,
        "@media (max-width: 720px)": {
          width: "520px",
        },
        "@media (max-width: 570px)": {
          width: "80%",
        },
        "@media (max-width: 540px)": {
          padding: "1rem",
          width: "90%",
        },
        "@media (max-width: 500px)": {
          width: "95%",
        },
        "@media (max-width: 470px)": {
          width: "100%",
        },
      }}
    >
      <Typography
        sx={{
          fontSize: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 600,
          "@media (max-width: 570px)": {
            fontSize: "18px",
          },
        }}
      >
        Итого:
        <span
          style={{
            color: "rgba(250, 179, 1, 1)",
            fontWeight: "bold",
          }}
        >
          {finalTotalPrice.toLocaleString('ru-RU').replace(/,/g, ' ')} сом
        </span>
      </Typography>
      <Box
        sx={{
          borderTop: "1px solid lightgray",
        }}
      >
        <List aria-labelledby="decorated-list-demo">
          <ListItem>
            <ListItemDecorator
              sx={{
                "& img": {
                  width: 30,
                  height: 30,
                  objectFit: "cover",
                },
                "@media (max-width: 550px)": {
                  "& img": {
                    width: 20,
                    height: 20,
                  },
                },
                "@media (max-width: 410px)": {
                  display: "none",
                },
              }}
            >
              <img
                src="https://img.icons8.com/quill/100/737373/overview-pages-3.png"
                alt="overview-pages-3"
              />
            </ListItemDecorator>
            <Typography
              sx={{
                width: "100%",
                fontSize: "18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                "@media (max-width: 570px)": {
                  fontSize: "md",
                },
              }}
            >
              Стоимость товаров:
              <span
                style={{
                  color: "rgba(250, 179, 1, 1)",
                  fontWeight: "bold",
                }}
              >
                {totalPriceProduct.toLocaleString('ru-RU').replace(/,/g, ' ')} сом
              </span>
            </Typography>
          </ListItem>

          <ListItem>
            <ListItemDecorator
              sx={{
                "& img": {
                  width: 30,
                  height: 30,
                  objectFit: "cover",
                },
                "@media (max-width: 550px)": {
                  "& img": {
                    width: 20,
                    height: 20,
                  },
                },
                "@media (max-width: 410px)": {
                  display: "none",
                },
              }}
            >
              <StarBorderIcon sx={{color:"gray", width:"30px", height:"30px"}} />
            </ListItemDecorator>
            <Typography
              sx={{
                width: "100%",
                fontSize: "18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                "@media (max-width: 570px)": {
                  fontSize: "md",
                },
              }}
            >
              Вы получите:
              <span
                style={{
                  color: "rgba(250, 179, 1, 1)",
                  fontWeight: "bold",
                }}
              >
                 {bonusToReceive.toLocaleString('ru-RU')} бонуса
              </span>
            </Typography>
          </ListItem>

          {user?.role === "client" && bonusUsed > 0 && (
            <ListItem>
              <ListItemDecorator
                sx={{
                  "@media (max-width: 410px)": {
                    display: "none",
                  },
                }}
              >
                <StarBorderIcon sx={{ color: "green", width: "30px", height: "30px" }} />
              </ListItemDecorator>
              <Typography
                sx={{
                  width: "100%",
                  fontSize: "18px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  "@media (max-width: 570px)": {
                    fontSize: "md",
                  },
                }}
              >
                Использовано бонусов:
                <span
                  style={{
                    color: "green",
                    fontWeight: "bold",
                  }}
                >
                  -{bonusUsed.toLocaleString('ru-RU').replace(/,/g, ' ')} бонусов
                </span>
              </Typography>
            </ListItem>
          )}
        </List>
      </Box>
    </Box>
  );
};

export default TotalPrice;
