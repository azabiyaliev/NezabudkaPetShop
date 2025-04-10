import React from "react";
import { Box, List, ListItem, ListItemDecorator } from "@mui/joy";
import { ICart } from "../../../../../types";
import Typography from "@mui/joy/Typography";
import StarBorderIcon from '@mui/icons-material/StarBorder';


interface Props {
  products: ICart[];
  bonusUsed: number;
}

const TotalPrice: React.FC<Props> = ({ products, bonusUsed }) => {
  const productsToBuy: { price: number; amount: number }[] = products.map(
    (product) => {
      if (product.product) {
        return {
          price: product.product.productPrice,
          amount: product.quantity,
        };
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

  const deliveryPrice = 250;
  const totalPriceBeforeBonus: number = totalPriceProduct + deliveryPrice;
  const finalTotalPrice: number = totalPriceBeforeBonus - bonusUsed;

  return (
    <Box
      sx={{
        width: "600px",
        height: "300px",
        padding: "2rem",
        borderRadius: "20px",
        "@media (max-width: 1115px)": {
          width: "700px",
        },
        "@media (max-width: 820px)": {
          width: "600px",
        },
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
          fontFamily: "Nunito, sans-serif",
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
          {finalTotalPrice.toLocaleString()} сом
        </span>
      </Typography>
      <Box
        sx={{
          borderTop: "1px solid lightgray",
          margin: "20px 0",
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
                fontFamily: "Nunito, sans-serif",
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
                {totalPriceProduct.toLocaleString()} сом
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
              <img
                src="https://img.icons8.com/ios-glyphs/30/737373/percentage.png"
                alt="percentage"
              />
            </ListItemDecorator>
            <Typography
              sx={{
                width: "100%",
                fontFamily: "Nunito, sans-serif",
                fontSize: "18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                "@media (max-width: 570px)": {
                  fontSize: "md",
                },
              }}
            >
              Налоги:
              <span
                style={{
                  color: "rgba(250, 179, 1, 1)",
                  fontWeight: "bold",
                }}
              >
                0 сом
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
                fontFamily: "Nunito, sans-serif",
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
                 {bonusToReceive.toLocaleString()} бонусов
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
              <img
                src="https://img.icons8.com/external-icongeek26-outline-icongeek26/64/737373/external-goods-transportation-icongeek26-outline-icongeek26-1.png"
                alt="external-goods-transportation-icongeek26-outline-icongeek26-1"
              />
            </ListItemDecorator>
            <Typography
              sx={{
                width: "100%",
                fontFamily: "Nunito, sans-serif",
                fontSize: "18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                "@media (max-width: 570px)": {
                  fontSize: "md",
                },
              }}
            >
              Доставка:
              <span
                style={{
                  color: "rgba(250, 179, 1, 1)",
                  fontWeight: "bold",
                }}
              >
                250 сом
              </span>
            </Typography>
          </ListItem>
          { bonusUsed > 0&& (
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
                  fontFamily: "Nunito, sans-serif",
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
                  -{bonusUsed.toLocaleString()} бонусов
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
