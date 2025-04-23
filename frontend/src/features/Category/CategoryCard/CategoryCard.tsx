import { useAppSelector } from '../../../app/hooks.ts';
import { selectCategories } from '../../../store/categories/categoriesSlice.ts';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../../../globalConstants.ts';
import theme from '../../../globalStyles/globalTheme.ts';

const CategoryCard = () => {
  const categories = useAppSelector(selectCategories);
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-wrap gap-4 justify-content-center">
      {categories.map((category) => (
        <div
          key={category.id}
          onClick={() => navigate(`/all-products/${category.id}`)}
          style={{ cursor: 'pointer' }}
        >
          <Card
            sx={{
              width: 250,
              height: 200,
              backgroundColor: theme.colors.background,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding:theme.spacing.xs
            }}
          >
            <Typography
              sx={{
                fontSize: theme.fonts.size.lg,
                fontWeight: theme.fonts.weight.medium,
                color: theme.colors.text
              }}
              component="div"
            >
              {category.title}
            </Typography>
              <CardMedia
              component="img"
              sx={{
                mt:theme.spacing.xxl,
                pt:theme.spacing.xs,
                pl:theme.spacing.xs,
                height: 180,
                width: 180,
                objectFit: 'cover',
              }}
              image={`${apiUrl}/${category.image}`}
              alt={category.title}
            />
          </Card>
        </div>
      ))}
    </div>
  );
};

export default CategoryCard;
