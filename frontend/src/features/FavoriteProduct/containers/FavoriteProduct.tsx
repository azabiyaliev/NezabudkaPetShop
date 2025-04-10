import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { useEffect, useState } from "react";
import { getFavoriteProducts } from "../../../store/favoriteProducts/favoriteProductsThunks.ts";
import { selectedFavorite } from "../../../store/favoriteProducts/favoriteProductsSlice.ts";
import { Box, Typography } from "@mui/material";
import OneProductCard from "../../Product/components/OneProductCard.tsx";
import { selectUser } from "../../../store/users/usersSlice.ts";
import {
  clearLocalFavoriteProducts,
  getLocalFavoriteProducts
} from '../../../store/favoriteProducts/favoriteProductLocal.ts';
import axiosApi from "../../../axiosApi.ts";
import { ProductResponse } from "../../../types";
import image from "../../../assets/image_transparent.png";
import { Breadcrumbs, Link } from "@mui/material";
import { useNavigate } from 'react-router-dom';


const FavoriteProduct = () => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(selectedFavorite);
  const user = useAppSelector(selectUser);
  const [localFavorites, setLocalFavorites] = useState<ProductResponse[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const localFavoriteProducts = getLocalFavoriteProducts()
      if (localFavoriteProducts) {
        axiosApi.post('/favorites/merge', { productIds: localFavoriteProducts })
          .then(() => {
            clearLocalFavoriteProducts();
            dispatch(getFavoriteProducts());
          });
      }
    } else {
      const favoriteId = getLocalFavoriteProducts();
      const fetchLocalFavorites = async () => {
        const response = await axiosApi.get(`favorites/by-id`, {
          params: { favoriteId: favoriteId.join(",") },
        });
        setLocalFavorites(response.data);
      };
      void fetchLocalFavorites();
    }
  }, [user, dispatch]);
  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ margin: '20px 0' }}>
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate("/")}
          sx={{ cursor: "pointer" }}
        >
          Главная
        </Link>
        <Typography color="text.primary">Избранное</Typography>
      </Breadcrumbs>

      <Typography
        variant="h4"
        sx={{
          margin: "20px 0",
          fontFamily: "Nunito, sans-serif",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Избранное
      </Typography>
      <Box  sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        {user ? (
          favorites.length === 0 ? (
            <Box sx={{ textAlign: 'center', margin: '30px 0'}}>
              <img
                width="200"
                height="200"
                src={image}
                alt="shopping-cart-emoji"
              />
              <Typography
                variant="h4"
                sx={{
                  margin: "20px 0",
                  fontFamily: "Nunito, sans-serif",
                }}
              >
                Здесь появятся ваши любимые товары
              </Typography>
            </Box>
          ) : (
            favorites.map((fav) => (
              <Box key={fav.id}>
                <OneProductCard product={fav.product} />
              </Box>
            ))
          )
        ) : localFavorites.length === 0 ? (
          <Box sx={{ textAlign: 'center', margin: '30px 0'}}>
            <img width="200"
                 height="200"
                 src={image}
                 alt="shopping-cart-emoji"
            />
            <Typography
              variant="h4"
              sx={{
                margin: "20px 0",
                fontFamily: "Nunito, sans-serif",
              }}
            >
              Здесь появятся ваши любимые товары
            </Typography>
          </Box>
        ) : (
          localFavorites.map((item) => (
            <Box key={item.id}>
              <OneProductCard product={item} />
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default FavoriteProduct;
