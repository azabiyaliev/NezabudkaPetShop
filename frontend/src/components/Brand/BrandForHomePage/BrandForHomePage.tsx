import { IBrand } from '../../../types';
import React, { useState } from 'react';
import { apiUrl } from '../../../globalConstants.ts';

interface Props {
  brands: IBrand[];
}

const BrandForHomePage: React.FC<Props> = ({ brands }) => {
  const [scrollIndex, setScrollIndex] = useState(0);

  const handlePrev = () => {
    setScrollIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setScrollIndex((prevIndex) => Math.min(prevIndex + 1, brands.length - 8));
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '90%',
        overflow: 'hidden',
      }}
    >
      <div style={{ width: '100%'}}>
        <div
          className="carousel-wrapper"
          style={{
            display: 'flex',
            transition: 'transform 0.3s ease',
            transform: `translateX(-${scrollIndex * 120}px)`,
          }}
        >
          {brands.map((brand, index) => (
            <div key={brand.id || `brand-${index}`} className="brand-item" style={{margin: '0 10px', padding: '20px 0'}}>
              <img
                src={apiUrl + "/" + brand.logo}
                className="d-block"
                alt={brand.title}
                style={{width: '80px', height: '50px', marginLeft: '20px'}}
              />
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={handlePrev}
        style={{
          position: 'absolute',
          top: '50%',
          left: '10px',
          zIndex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          border: 'none',
          transform: 'translateY(-50%)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        &#10094;
      </button>
      <button
        type="button"
        onClick={handleNext}
        style={{
          position: 'absolute',
          top: '50%',
          right: '10px',
          zIndex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          border: 'none',
          transform: 'translateY(-50%)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        &#10095;
      </button>
    </div>
  );
};

export default BrandForHomePage;
