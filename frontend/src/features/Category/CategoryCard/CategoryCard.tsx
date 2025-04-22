import { useAppSelector } from '../../../app/hooks.ts';
import { selectCategories } from '../../../store/categories/categoriesSlice.ts';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

import catImg from '../../../assets/category-animals/7.png';
import dogImg from '../../../assets/category-animals/10.png';
import birdImg from '../../../assets/category-animals/3.png';
import fishImg from '../../../assets/category-animals/4.png';
import bunnyImg from '../../../assets/category-animals/6.png';
import { useNavigate } from 'react-router-dom';

const titleToImage: Record<string, string> = {
  'Собаки': dogImg,
  'Кошки': catImg,
  'птицы': birdImg,
  'Маленькие питомцы': bunnyImg,
  'рыбки': fishImg,
};

const titleToColor: Record<string, string> = {
  'Собаки': '#FFD3B6',
  'Кошки': '#FFABAB',
  'птицы': '#B5EAD7',
  'Маленькие питомцы': '#E2F0CB',
  'рыбки': '#A2D2FF',
};

const CategoryCard = () => {
  const categories = useAppSelector(selectCategories);
  const navigate = useNavigate();

  const filteredCategories = categories.filter(
    (category) => category.title !== 'Другие питомцы'
  );

  return (
    <div className="d-flex flex-wrap gap-4 justify-content-center">
      {filteredCategories.map((category) => {
        const image = titleToImage[category.title];
        const color = titleToColor[category.title];

        if (!image) return null;

        return (
          <div
            key={category.id}
            onClick={() => navigate(`/all-products/${category.id}`)}>
            <Card
              sx={{
                width: 200,
                backgroundColor: color,
                borderRadius: 4,
              }}
            >
              <CardActionArea sx={{ borderRadius: 4 }}>
                <CardMedia
                  component="img"
                  height="160"
                  image={image}
                  alt={category.title}
                  sx={{ borderRadius: '20px' }}
                />
              </CardActionArea>
            </Card>
            <Typography
              sx={{
                textAlign: 'center',
                fontSize: '18px',
                marginTop: 2,
                fontWeight: 500,
              }}
              gutterBottom
              variant="h5"
              component="div"
            >
              {category.title}
            </Typography>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryCard;
