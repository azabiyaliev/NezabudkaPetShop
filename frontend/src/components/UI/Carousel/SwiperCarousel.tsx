import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { apiUrl } from "../../../globalConstants.ts";
import { fetchPhoto } from "../../../store/photoCarousel/photoCarouselThunk.ts";
import { selectPhotoCarousel } from "../../../store/photoCarousel/photoCarouselSlice.ts";
import { Box } from "@mui/joy";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./swiper-custom.css";
import { Button, Container } from '@mui/material';
import theme from '../../../globalStyles/globalTheme.ts';

const SwiperCarousel = () => {
  const dispatch = useAppDispatch();
  const carousel = useAppSelector(selectPhotoCarousel);

  useEffect(() => {
    dispatch(fetchPhoto()).unwrap();
  }, [dispatch]);

  const images = useMemo(() => carousel || [], [carousel]);

  if (!images.length) return null;

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
      }}
    >
      <Swiper
        modules={[Pagination, Navigation, Autoplay]}
        slidesPerView={1}
        spaceBetween={30}
        speed={500}
        loop={true}
        grabCursor={true}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        className="pet-shop-swiper"
        style={{
          overflow: "hidden",
          "--swiper-pagination-color": "rgb(35, 120, 3)",
          "--swiper-navigation-color": "rgb(35, 120, 3)",
        } as React.CSSProperties}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
              }}
            >
              <img
                src={`${apiUrl}/${image.photo}`}
                alt={`Slide ${index}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                onClick={() => image.link && (window.location.href = image.link)}
              />

                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0,0,0,0.4)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    flexDirection: "column",
                    color: "#fff",
                    textAlign: "left",
                    px: 6,
                    pointerEvents: "none",
                  }}
                >
                  <Container maxWidth="xl" sx={{ px: 6, pt: 10 }}>
                    <h1 style={{ fontSize: "3rem", margin: 0 }}>Заголовок</h1>
                    <p style={{ fontSize: "1.5rem", maxWidth: "600px", marginTop: "1rem" }}>
                      Описание для слайда — может быть любой рекламный текст.
                    </p>
                    <Button
                      onClick={() => window.location.href = "/catalog"}
                      sx={{
                        mt: 2,
                        width: "240px",
                        fontSize: "1.2rem",
                        py: 1.5,
                        backgroundColor: theme.colors.black,
                        boxShadow: "0px 14px 40px rgba(0, 0, 0, 1)",
                        borderRadius: "40px",
                        '&:hover': {
                          backgroundColor: theme.colors.black,
                          boxShadow: "0px 14px 40px rgba(0, 0, 0, 1)",
                        },
                      }}
                      variant="contained"
                      color="success"
                      style={{ pointerEvents: "auto" }}
                    >
                      В каталог
                    </Button>
                  </Container>
                </Box>
            </div>
          </SwiperSlide>


        ))}
      </Swiper>
    </Box>
  );
};

export default SwiperCarousel;
