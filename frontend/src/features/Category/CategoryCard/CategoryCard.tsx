import { useAppSelector } from '../../../app/hooks.ts';
import { selectCategories } from '../../../store/categories/categoriesSlice.ts';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../../../globalConstants.ts';
import theme from '../../../globalStyles/globalTheme.ts';
import { Box } from '@mui/material';


const CategoryCard = () => {
  const categories = useAppSelector(selectCategories);
  const navigate = useNavigate();

  const filteredCategories = categories.filter(category => category.image !== null);


  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 4,
        justifyContent: 'center',
        mb: '100px',
      }}
    >
      {filteredCategories.map((category) => (
        <Box
          key={category.id}
          onClick={() => navigate(`/all-products/${category.id}`)}
          sx={{ cursor: 'pointer' }}
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
        </Box>
      ))}
    </Box>
  );
};

export default CategoryCard;
