import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { apiUrl } from "../../../globalConstants.ts";
import { fetchPhoto } from "../../../store/photoCarousel/photoCarouselThunk.ts";
import { selectPhotoCarousel } from "../../../store/photoCarousel/photoCarouselSlice.ts";
import { Box } from "@mui/joy";

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carousel = useAppSelector(selectPhotoCarousel);
  const dispatch = useAppDispatch();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    dispatch(fetchPhoto()).unwrap();
  }, [dispatch]);

  const images = carousel || [];
  const currentImage = images[currentIndex]?.photo;

  useEffect(() => {
    startAutoScroll();

    return () => {
      stopAutoScroll();
    };
  }, [images.length]);

  const startAutoScroll = () => {
    stopAutoScroll();
    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
  };

  const stopAutoScroll = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleDotClick = (index: number) => {
    stopAutoScroll();
    setCurrentIndex(index);
    startAutoScroll();
  };

  const clickByPhoto = () => {
    const link = carousel[currentIndex]?.link;
    if (link) {
      window.location.href = link; // переход в этой же вкладке
    }
  };

  return (
    <Box
      sx={{
        padding: "20px",
        width: "100%",
        position: "relative",
        cursor: "pointer",
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
        <div
          onClick={clickByPhoto}
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            position: "relative",
            borderRadius: "20px",
          }}
        >
          <img
            src={`${apiUrl}/${currentImage}`}
            alt={`Slide ${currentIndex}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.5s ease-in-out",
            }}
          />
        </div>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
            alignItems: "center",
          }}
        >
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              style={{
                backgroundColor:
                  currentIndex === index ? "rgb(35, 120, 3)" : "white",
                border: "1px solid rgb(35, 120, 3)",
                borderRadius: "50%",
                width: "12px",
                height: "12px",
                margin: "0 5px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
            ></button>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Carousel;
