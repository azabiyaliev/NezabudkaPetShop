import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { apiUrl } from "../../../globalConstants.ts";
import { fetchPhoto } from "../../../store/photoCarousel/photoCarouselThunk.ts";
import { selectPhotoCarousel } from "../../../store/photoCarousel/photoCarouselSlice.ts";
import { Box } from "@mui/joy";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

// Импорт стилей Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './swiper-custom.css';

// Дефолтные параметры для свайпера
const swiperDefaults = {
  slidesPerView: 1,
  spaceBetween: 30,
  speed: 500,
  loop: true,
  loopAdditionalSlides: 3,
  grabCursor: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  pagination: { 
    clickable: true,
    dynamicBullets: true,
  },
  navigation: true,
  centeredSlides: true,
  threshold: 10,
  preventClicksPropagation: true,
};

const SwiperCarousel = () => {
  const carousel = useAppSelector(selectPhotoCarousel);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchPhoto()).unwrap();
  }, [dispatch]);

  const images = carousel || [];

  const handleClickPhoto = (link: string | undefined) => {
    if (link) {
      window.location.href = link;
    }
  };

  return (
    <Box
      sx={{
        padding: "20px",
        width: "100%",
        position: "relative",
        marginTop: "30px",
        "@media (max-width: 990px)": { padding: "10px" },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          marginLeft: "40px",
          "@media (max-width: 990px)": { marginLeft: "0px" },
        }}
      >
        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          pagination={swiperDefaults.pagination}
          navigation={swiperDefaults.navigation}
          autoplay={swiperDefaults.autoplay}
          loop={swiperDefaults.loop}
          loopAdditionalSlides={swiperDefaults.loopAdditionalSlides}
          grabCursor={swiperDefaults.grabCursor}
          slidesPerView={swiperDefaults.slidesPerView}
          spaceBetween={swiperDefaults.spaceBetween}
          speed={swiperDefaults.speed}
          centeredSlides={swiperDefaults.centeredSlides}
          threshold={swiperDefaults.threshold}
          preventClicksPropagation={swiperDefaults.preventClicksPropagation}
          style={{ 
            borderRadius: "20px", 
            overflow: "hidden",
            "--swiper-pagination-color": "rgb(35, 120, 3)",
            "--swiper-navigation-color": "rgb(35, 120, 3)",
          } as React.CSSProperties}
          className="pet-shop-swiper"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div 
                onClick={() => handleClickPhoto(image.link)}
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
    </Box>
  );
};

export default SwiperCarousel; 