import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { selectEditSite } from '../../../store/editionSite/editionSiteSlice.ts';
import { fetchSite } from '../../../store/editionSite/editionSiteThunk.ts';
import { apiUrl } from '../../../globalConstants.ts';
import { useNavigate } from 'react-router-dom';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const siteImage = useAppSelector(selectEditSite);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchSite()).unwrap()
  }, [dispatch]);

  const images = siteImage?.PhotoByCarousel || [];

  const currentImage = images[currentIndex]?.photo;

  const clickByPhoto = () => {
    navigate('/sale')
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '20px',
        width: '100%',
        position: 'relative',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: "pointer",
      }}
    >
      <div style={{ position: 'relative', width: '70%', height: '400px',marginLeft: 'auto', }}>
        <div
          onClick={clickByPhoto}
          style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
            borderRadius: '4px',
          }}
        >
          <img
            src={`${apiUrl}/${currentImage}`}
            alt={`Slide ${currentIndex}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease-in-out',
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '10px',
          }}
        >
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              style={{
                backgroundColor: currentIndex === index ? 'rgb(33, 33, 33)' : 'white',
                border: '1px solid lightgray',
                borderRadius: '50%',
                width: '12px',
                height: '12px',
                margin: '0 5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
