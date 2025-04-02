import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { apiUrl } from "../../../globalConstants.ts";
import { useNavigate } from "react-router-dom";
import { fetchPhoto } from '../../../store/photoCarousel/photoCarouselThunk.ts';
import { selectPhotoCarousel } from '../../../store/photoCarousel/photoCarouselSlice.ts';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Box } from '@mui/joy';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [isHovered, setIsHovered] = useState(false); // Состояние для отслеживания наведения мыши
  const carousel = useAppSelector(selectPhotoCarousel);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    dispatch(fetchPhoto()).unwrap();
  }, [dispatch]);

  const images = carousel || [];
  const currentImage = images[currentIndex]?.photo;

  useEffect(() => {
    if (isAutoScroll) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 2500);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isAutoScroll, currentIndex, images.length]);

  const clickByPhoto = () => {
    const link = carousel[currentIndex]?.link || "/sale";
    navigate(link);
  };

  const toggleAutoScroll = () => {
    setIsAutoScroll((prev) => !prev);
  };

  return (
    <Box
      sx={{
        padding: "20px",
        width: "100%",
        position: "relative",
        cursor: "pointer",
        marginTop: "30px",
        "@media (max-width: 990px)": { padding: "10px", }
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          marginLeft: "40px",
          "@media (max-width: 990px)": {marginLeft: "0px", }
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
          <button
            onClick={toggleAutoScroll}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              color: "rgb(35, 120, 3)",
              cursor: "pointer",
              marginRight: "10px",
              marginTop:"-2px",
              background: "none",
              border: "none",
              padding: "0",
              position: "relative",
            }}
          >
            {isAutoScroll ? <PauseIcon /> : <PlayArrowIcon />}
            {isHovered && isAutoScroll && (
              <span
                style={{
                  position: "absolute",
                  bottom: "-14px",
                  left: "15px",
                  backgroundColor: "whitesmoke",
                  color: "black",
                  borderRadius: "10px",
                  padding: "2px 5px",
                  fontSize: "10px",
                }}
              >
                Пауза
              </span>
            )}
            {isHovered && !isAutoScroll && (
              <span
                style={{
                  position: "absolute",
                  bottom: "-14px",
                  left: "15px",
                  backgroundColor: "whitesmoke",
                  color: "black",
                  borderRadius: "10px",
                  padding: "2px 5px",
                  fontSize: "10px",
                }}
              >
                Играть
              </span>
            )}
          </button>
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
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
