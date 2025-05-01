import React from 'react';
import { Box, List, ListItem, ListItemDecorator } from '@mui/joy';
import { ICartItem } from '../../../../../types';
import Typography from '@mui/joy/Typography';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useAppSelector } from '../../../../../app/hooks.ts';
import { selectUser } from '../../../../../store/users/usersSlice.ts';
import { DeliveryMethod } from '../../../../../features/Order/OrderForm.tsx';

interface Props {
  products: ICartItem[];
  bonusUsed: number;
  deliveryZone: string;
  deliveryMethod: string;
  onDeliveryZoneChange: (zone: string) => void;
}

const deliveryZones = [
  { name: 'Первомайский', price: 350, color: '#4CAF50' },
  { name: 'Октябрьский', price: 400, color: '#FF69B4' },
  { name: 'Ленинский', price: 300, color: '#FFA500' },
  { name: 'Свердловский', price: 450, color: '#FF8C00' },
];

const TotalPrice: React.FC<Props> = ({ products, bonusUsed, deliveryZone, deliveryMethod, onDeliveryZoneChange }) => {
  const user = useAppSelector(selectUser);
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

  const selectedZone = deliveryZones.find(zone => zone.name === deliveryZone) || deliveryZones[0];

  const bonusToReceive = totalPriceProduct * 0.01

  const deliveryPrice = deliveryMethod === DeliveryMethod.PickUp ? 0 : selectedZone.price;
  const totalPriceBeforeBonus: number = totalPriceProduct + deliveryPrice;
  const finalTotalPrice: number = totalPriceBeforeBonus - bonusUsed;

  return (
    <Box
      sx={{
        padding: "15px",
        borderRadius: "20px",
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
      {deliveryMethod !== DeliveryMethod.PickUp && (
        <Box sx={{
          p: 3,
          borderRadius: '12px',
          backgroundColor: 'background.level1',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
          mb: 3
        }}>
          <Typography sx={{ mb: 2, fontWeight: 600 }}>Зоны доставки</Typography>

          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'center'
          }}>
            {deliveryZones.map(zone => (
              <Box
                key={zone.name}
                onClick={() => onDeliveryZoneChange(zone.name)}
                sx={{
                  p: 2,
                  border: '2px solid',
                  borderColor: deliveryZone === zone.name ? 'primary.500' : 'transparent',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: zone.color,
                  color: '#000',
                  fontWeight: 600,
                  minWidth: '100px',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Typography fontWeight="md">{zone.name}</Typography>
                <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                  {zone.price} сом
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

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

          {deliveryMethod !== DeliveryMethod.PickUp && (
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

              <Typography sx={{ flexGrow: 1 }}>Доставка ({selectedZone.name}):</Typography>
              <Typography fontWeight="bold" sx={{ color: "rgba(250, 179, 1, 1)" }}>
                {deliveryPrice.toLocaleString()} сом
              </Typography>
            </ListItem>
          )}

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

          {/* Показываем блок с доставкой только если способ доставки не самовывоз */}
          {deliveryMethod !== 'самовывоз' && (
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
                  {deliveryPrice.toLocaleString()} сом
                </span>
              </Typography>
            </ListItem>
          )}

          {user?.role === "client" && bonusUsed > 0&& (
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
