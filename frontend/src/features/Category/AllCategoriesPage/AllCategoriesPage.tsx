import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { selectCategories } from '../../../store/categories/categoriesSlice.ts';
import { useEffect, useState } from 'react';
import { deleteCategory, fetchCategoriesThunk } from '../../../store/categories/categoriesThunk.ts';
import { Box, Card, Typography, Grid, Modal, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditCategory from '../../../components/Forms/CategoryForm/EditCategory.tsx';
import { selectUser } from '../../../store/users/usersSlice.ts';
import AdminBar from '../../Admin/AdminProfile/AdminBar.tsx';

const AllCategoriesPage = () => {
  const categories = useAppSelector(selectCategories);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
    console.log("Updated user:", user);
  }, [dispatch, user]);

  if( user) {
    console.log(user.role);
  }

  const handleOpen = (category: { id: string; title: string }) => {
    setSelectedCategory(category);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCategory(null);
  };

  const onDelete = async (id: string) => {
    await dispatch(deleteCategory(id));
    dispatch(fetchCategoriesThunk());
  };


  return (
    <>
      <Box sx={{ display: 'flex', margin: '30px 0' }}>
        <AdminBar />
        <Box sx={{ maxWidth: 1400, mx: 'auto', mt: 4, p: 2 }}>
          <Grid container spacing={3} justifyContent="center">
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
                <Card
                  sx={{
                    minHeight: 150,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    position: 'relative',
                    boxShadow: 3,
                    borderRadius: 2,
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <Typography variant="h6" textAlign="center">
                    {category.title}
                  </Typography>

                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      right: 8,
                    }}
                  >
                    {user && user.role === 'admin' && (
                      <>
                        <IconButton
                          onClick={() => handleOpen({ ...category, id: String(category.id) })}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>

                        <IconButton
                          onClick={() => onDelete(String(category.id))}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </Box>
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
      </Box>

    </>
  );
};

export default AllCategoriesPage;