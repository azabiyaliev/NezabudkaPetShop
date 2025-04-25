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
import { Button, Container, Typography } from '@mui/material';
import theme from '../../../globalStyles/globalTheme.ts';

const SwiperCarousel = () => {
  const dispatch = useAppDispatch();
  const carousel = useAppSelector(selectPhotoCarousel);

  console.log(carousel)

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
                  <Container maxWidth="xl" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                    <Typography
                      sx={{
                        fontSize: {
                          xs: theme.fonts.size.lg,  // маленькие экраны
                          sm: theme.fonts.size.xl,
                          md: theme.fonts.size.xxl,
                        },
                        mb: theme.spacing.lg,
                        fontWeight: theme.fonts.weight.bold,
                      }}
                    >
                      {image.title}
                    </Typography>

                    <Typography
                      component="p"
                      sx={{
                        fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
                        maxWidth: { xs: '100%', md: '600px' },
                        marginTop: '1rem',
                        mx: { xs: 'auto', md: 0 },
                      }}
                    >
                      {image.description}
                    </Typography>

                    <Button
                      onClick={() => (window.location.href = '/catalog')}
                      sx={{
                        mt: 5,
                        width: { xs: '100%', sm: '240px' },
                        fontSize: { xs: '1rem', sm: '1.2rem' },
                        py: 1.5,
                        backgroundColor: theme.colors.black,
                        boxShadow: '0px 14px 40px rgba(0, 0, 0, 1)',
                        borderRadius: '40px',
                        '&:hover': {
                          backgroundColor: theme.colors.black,
                          boxShadow: '0px 14px 40px rgba(0, 0, 0, 1)',
                        },
                        mx: { xs: 'auto', md: 0 },
                      }}
                      variant="contained"
                      color="success"
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
