import { useAppSelector } from '../../../app/hooks.ts';
import { selectCategories } from '../../../store/categories/categoriesSlice.ts';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../../../globalConstants.ts';
import theme from '../../../globalStyles/globalTheme.ts';

const CategoryCard = () => {
  const categories = useAppSelector(selectCategories);
  const navigate = useNavigate();

  const filteredCategories = categories.filter(category => category.image !== null);

  return (
    <Grid
      container
      spacing={3}
      justifyContent="center"
    >
      {filteredCategories.map((category) => (
        <Grid
          key={category.id}
          item
          xs={6}
          sm={6}
          md={5}
          lg={4}
          xl={3}
          sx={{
            display: 'flex',
            justifyContent: 'center',
        }}
          onClick={() => navigate(`/all-products/${category.id}`)}

        >
          <Card
            sx={{
              width: '100%',
              maxWidth: 340,
              height: 210,
              backgroundColor: theme.colors.background,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row-reverse',
              justifyContent: 'space-between',
              cursor: 'pointer',
              "@media (max-width: 780px)": {
                flexDirection: 'column-reverse',
                height: 'auto',
                alignItems: 'center',
                justifyContent: 'center',
                pt:2
              },
            }}
          >
            <CardMedia
              component="img"
              sx={{
                height: 190,
                width: 190,
                objectFit: 'cover',
                alignSelf: 'flex-end',
                "@media (max-width: 780px)": {
                  width: 150,
                  height: 150,
                },
                "@media (max-width: 400px)": {
                  width: 140,
                  height: 140,
                },
              }}
              image={`${apiUrl}/${category.image}`}
              alt={category.title}
            />
            <Typography
              sx={{
                fontSize: theme.fonts.size.xl,
                fontWeight: theme.fonts.weight.medium,
                color: theme.colors.text,
                textAlign: 'center',
                pl:theme.spacing.sm,
                "@media (max-width: 670px)": {
                  fontSize: theme.fonts.size.xl,
                  pl:0,
                },
                "@media (max-width: 400px)": {
                  fontSize: theme.fonts.size.lg,
                },
              }}
              component="div"
            >
              {category.title}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CategoryCard;
