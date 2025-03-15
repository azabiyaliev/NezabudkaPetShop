import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { selectCategories } from '../../../features/categories/categoriesSlice.ts';
import { useEffect, useState } from 'react';
import { fetchCategoriesThunk } from '../../../features/categories/categoriesThunk.ts';
import { Box, Card, Typography, Grid, Modal, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EditCategory from '../../../components/CategoryForm/EditCategory.tsx';

const AllCategoriesPage = () => {
  const categories = useAppSelector(selectCategories);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  console.log(categories)

  const handleOpen = (category: { id: string; title: string }) => {
    setSelectedCategory(category);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCategory(null);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, p: 2 }}>
      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={category.id}>
            <Card sx={{
              height: 120,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              position: 'relative'
            }}>
              <Typography variant="h6" textAlign="center" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                {category.title}
              </Typography>
              <IconButton
                onClick={() => handleOpen({ ...category, id: String(category.id) })}
                color="primary"
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8
                }}
              >
                <EditIcon />
              </IconButton>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal open={open} onClose={handleClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 2 }}>
          {selectedCategory && <EditCategory category={selectedCategory} />}
        </Box>
      </Modal>
    </Box>
  );
};

export default AllCategoriesPage;