import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { selectCategories } from '../../../store/categories/categoriesSlice.ts';
import { useEffect, useState } from 'react';
import { deleteCategory, fetchCategoriesThunk } from '../../../store/categories/categoriesThunk.ts';
import {
  Box,
  Typography,
  Modal,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  TableCell
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditCategory from '../../../components/Forms/CategoryForm/EditCategory.tsx';
import { selectUser } from '../../../store/users/usersSlice.ts';
import AdminBar from '../../Admin/AdminProfile/AdminBar.tsx';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast } from 'react-toastify';

const AllCategoriesPage = () => {
  const categories = useAppSelector(selectCategories);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch, user]);

  const handleOpen = (category: { id: string; title: string }) => {
    setSelectedCategory(category);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCategory(null);
  };

  const onDelete = async (id: string) => {
    const categoryToDelete = categories.find((category) => String(category.id) === id);

    if (categoryToDelete && categoryToDelete.subcategories && categoryToDelete.subcategories.length > 0) {
      toast.warning('Категория не пуста или используется в данный момент, не стоит удалять!', { position: 'top-center' });
      return;
    }

    await dispatch(deleteCategory(id));
    dispatch(fetchCategoriesThunk());
  };


  return (
    <>
      <Box sx={{display: 'flex', margin: '30px 0'}}>
        <AdminBar/>
        <Box
          sx={{
            maxWidth: 1400,
            mx: 'auto',
            mt: 4,
            p: 2,
            border: 1,
            borderRadius: 5,
            borderColor: 'grey.300',
          }}
        >
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
            <tr>
              <TableCell sx={{fontWeight: 'bold'}} align="right">Категории</TableCell>
              <TableCell sx={{fontWeight: 'bold'}} align="right">Подкатегории</TableCell>
              <TableCell sx={{fontWeight: 'bold'}} align="right">Действия</TableCell>
            </tr>
            </thead>
            <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <TableCell component="th" scope="row">
                  {category.title}
                </TableCell>
                <td>
                  {category.subcategories && category.subcategories.length > 0 && (
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon/>} aria-controls="panel1a-content"
                                        id="panel1a-header">
                        <Typography variant="body2">Подкатегории</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List>
                          {category.subcategories.map((sub, index) => (
                            <ListItem key={index}
                                      sx={{display: 'flex', justifyContent: 'space-between', padding: '8px 16px'}}>
                              <Typography sx={{fontSize: '0.8rem', color: 'text.secondary'}}>
                                {sub.title}
                              </Typography>
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  )}
                  {category.subcategories && category.subcategories.length === 0 && (
                    <Typography variant="body2" color="textSecondary">Нет подкатегорий</Typography>
                  )}
                </td>
                <td>
                  {user && user.role === 'admin' && (
                    <Box sx={{display: 'flex', gap: 1}}>
                      <IconButton onClick={() => handleOpen({...category, id: String(category.id)})} color="primary">
                        <EditIcon/>
                      </IconButton>
                      <IconButton onClick={() => onDelete(String(category.id))} color="error">
                        <DeleteIcon/>
                      </IconButton>
                    </Box>
                  )}
                </td>
              </tr>
            ))}
            </tbody>
          </table>

          <Modal open={open} onClose={handleClose}
                 sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Box sx={{bgcolor: 'white', p: 4, borderRadius: 2}}>
              {selectedCategory && <EditCategory category={selectedCategory}/>}
            </Box>
          </Modal>
        </Box>
      </Box>
    </>
  );
};

export default AllCategoriesPage;
