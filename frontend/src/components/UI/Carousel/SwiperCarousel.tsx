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
        padding: "20px",
        width: "100%",
        position: "relative",
        marginTop: "30px",
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
          borderRadius: "20px",
          overflow: "hidden",
          "--swiper-pagination-color": "rgb(35, 120, 3)",
          "--swiper-navigation-color": "rgb(35, 120, 3)",
        } as React.CSSProperties}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div
              onClick={() => image.link && (window.location.href = image.link)}
              style={{
                cursor: "pointer",
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
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default SwiperCarousel;
