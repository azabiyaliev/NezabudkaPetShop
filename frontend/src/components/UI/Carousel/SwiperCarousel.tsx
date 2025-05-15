import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { apiUrl } from "../../../globalConstants.ts";
import { fetchPhoto } from "../../../store/photoCarousel/photoCarouselThunk.ts";
import { selectPhotoCarousel } from "../../../store/photoCarousel/photoCarouselSlice.ts";
import { Box } from "@mui/joy";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "./swiper-custom.css";
import { Button, Container, Typography } from "@mui/material";
import theme from "../../../globalStyles/globalTheme.ts";

const SwiperCarousel = () => {
  const dispatch = useAppDispatch();
  const carousel = useAppSelector(selectPhotoCarousel);

  useEffect(() => {
    dispatch(fetchPhoto()).unwrap();
  }, [dispatch]);

  const images = useMemo(() => carousel || [], [carousel]);

  if (!images.length) return null;

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        spaceBetween={0}
        speed={500}
        loop
        centeredSlides={false}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        pagination={{
          clickable: false,
          dynamicBullets: true,
        }}
        allowTouchMove={false}
        simulateTouch={false}
        className="pet-shop-swiper"
        style={{
          overflow: "hidden",
          "--swiper-pagination-color": "#fff",
        } as React.CSSProperties}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div style={{ width: "100%", height: "100%", position: "relative" }}>
              <img
                src={`${apiUrl}/${image.photo}`}
                alt={`Slide ${index}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "rgba(0,0,0,0.4)",
                  zIndex: 1,
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  flexDirection: "column",
                  color: "#fff",
                  textAlign: "left",
                  px: 6,
                  zIndex: 2,
                }}
              >
                <Container
                  maxWidth="xl"
                  sx={{ textAlign: { xs: "center", md: "left" } }}
                >
                  <Typography
                    sx={{
                      fontSize: {
                        xs: theme.fonts.size.lg,
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
                      fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
                      maxWidth: { xs: "100%", md: "600px" },
                      marginTop: "1rem",
                      mx: { xs: "auto", md: 0 },
                    }}
                  >
                    {image.description}
                  </Typography>

                  {image.link && (
                    <Button
                      onClick={() => (window.location.href = image.link)}
                      sx={{
                        mt: 5,
                        maxWidth: "240px",
                        width: { xs: "100%", sm: "240px" },
                        fontSize: { xs: "1rem", sm: "1.2rem" },
                        py: 1.5,
                        backgroundColor: theme.colors.primary,
                        boxShadow: "0px 14px 40px rgba(0, 0, 0, 1)",
                        borderRadius: "40px",
                        "&:hover": {
                          backgroundColor: theme.colors.DARK_GREEN,
                          boxShadow: "0px 14px 40px rgba(0, 0, 0, 1)",
                        },
                        mx: { xs: "auto", md: 0 },
                        display: "inline-block",
                        textAlign: "center",
                      }}
                      variant="contained"
                      color="success"
                    >
                       <span
                         style={{
                           display: "block",
                           whiteSpace: "nowrap",
                           overflow: "hidden",
                           textOverflow: "ellipsis",
                         }}
                         title={image.title}
                       >
                             {image.title}
                        </span>
                    </Button>
                  )}
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
