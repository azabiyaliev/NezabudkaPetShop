import  { useEffect, useRef, useState } from "react";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText, Modal,
  Typography,
} from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { selectCategories } from "../../../store/categories/categoriesSlice.ts";
import {
  deleteCategory,
  fetchCategoriesThunk,
  updateCategoriesThunk,
} from '../../../store/categories/categoriesThunk.ts';
import NewCategory from "../NewCategory/NewCategory.tsx";
import { styled } from "@mui/styles";
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import EditCategory from '../../../components/Forms/CategoryForm/EditCategory.tsx';

const SUCCESSFUL_CATEGORY_DELETE = "Удаление прошло успешно!";
const ERROR_CATEGORY_DELETE = "Ошибка при удалении подкатегории!";
const WARNING_CATEGORY_DELETE = "Категория не пуста или используется в данный момент, не стоит удалять!";

const ManageCategories = () => {
  const categories = useAppSelector(selectCategories);
  const dispatch = useAppDispatch();

  const [currentCategory, setCurrentCategory] = useState(categories);

  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    title: string;
  } | null>(null);

  const dragSub = useRef<{
    categoryId: number;
    subcategoryIndex: number;
  } | null>(null);
  const draggedOverSub = useRef<number | null>(null);

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  useEffect(() => {
    setCurrentCategory(categories);
  }, [categories]);

  console.log(categories);

  const handleOpen = (category: { id: number; title: string; }) => {
    setSelectedCategory({
      ...category,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCategory(null);
  };

  const handlerSort = () => {
    if (dragSub.current && draggedOverSub.current !== null) {
      const { categoryId, subcategoryIndex } = dragSub.current;

      const updatedCategories = currentCategory.map((category) => {
        if (category.id === categoryId && category.subcategories) {
          const subCategoriesClone = [...category.subcategories];

          const draggedSubCategory = subCategoriesClone[subcategoryIndex];
          subCategoriesClone.splice(subcategoryIndex, 1);
          subCategoriesClone.splice(
            draggedOverSub.current!,
            0,
            draggedSubCategory,
          );

          return { ...category, subcategories: subCategoriesClone };
        }
        return category;
      });

      setCurrentCategory(updatedCategories);

      dispatch(updateCategoriesThunk(updatedCategories));
    }
  };

  const HoverCard = styled(ListItem)({
    cursor: "pointer",
    transition: "transform 0.3s ease-in-out",
    "&:hover": {
      transform: "translate(8px) scale(1)",
    },
  });

  const onDelete = async (id: string) => {
    try {
      const categoryToDelete = categories.find(
        (category) => String(category.id) === id,
      );

      if (
        categoryToDelete &&
        categoryToDelete.subcategories &&
        categoryToDelete.subcategories.length > 0
      ) {
        toast.warning(
          WARNING_CATEGORY_DELETE,
          { position: "top-center" },
        );
        return;
      }

      await dispatch(deleteCategory(id));
      await dispatch(fetchCategoriesThunk());

      toast.success(SUCCESSFUL_CATEGORY_DELETE, { position: 'top-center' });
    } catch (error) {
      console.log(error);
      toast.error(ERROR_CATEGORY_DELETE, { position: 'top-center' });
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <NavLink
          to="/private_account"
          style={{
            color: 'green',
            textDecoration: 'none',
            fontWeight: 'bold',
            marginTop: '20px',
            padding: '2px',
          }}>
          <ArrowBackIcon/>
          Вернуться назад...
        </NavLink>
        <Typography variant="h4" textAlign="left" sx={{ mt: 2 }}>
          Управление категориями
        </Typography>

        <NewCategory />

        <Typography sx={{ fontSize: "18px" }} textAlign="left" mt={2}>
          Категории (перетащите для изменения иерархии)
        </Typography>

        <Typography
          sx={{ fontSize: "13px", mt: 1, color: "#757575" }}
          textAlign="left"
        >
          Перетащите категорию (подкатегорию), чтобы изменить её порядок или
          положение в иерархии. Для создания подкатегории, перетащите категорию
          в подсвеченную область другой категории.
        </Typography>

        <Box sx={{ mt: 4 }}>
          {currentCategory.map((category) => (
            <Box key={category.id} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                <Typography sx={{ fontWeight: "bold"}}>
                  {category.title}
                </Typography>

                <Tooltip title="Редактировать подкатегорию" placement="top">
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() =>
                      handleOpen({ ...category, id: Number(category.id) })
                    }
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Удалить подкатегорию" placement="top">
                  <IconButton
                    onClick={() => onDelete(String(category.id))}
                    edge="end"
                    aria-label="delete"
                    sx={{ ml: 1 }}
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Добавить подкатегорию" placement="top">
                  <IconButton
                    onClick={() => onDelete(String(category.id))}
                    edge="end"
                    aria-label="delete"
                    sx={{ ml: 1 }}
                    color="success"
                  >
                    <AddIcon sx={{ mr: 1 }} />
                  </IconButton>
                </Tooltip>
              </Box>

              {category.subcategories && category.subcategories.length > 0 ? (
                <List sx={{ pl: 2, borderRadius: 1 }}>
                  {category.subcategories.map((sub, index) => (
                    <HoverCard key={sub.id}>
                      <ListItem
                        onDragStart={() => {
                          dragSub.current = {
                            categoryId: category.id,
                            subcategoryIndex: index,
                          };
                        }}
                        onDragEnter={() => {
                          draggedOverSub.current = index;
                        }}
                        onDragEnd={handlerSort}
                        onDragOver={(e) => e.preventDefault()}
                        draggable={true}
                        sx={{ my: 1, bgcolor: "#f1f1f1", borderRadius: 1 }}
                        secondaryAction={
                          <>
                            <IconButton edge="end" aria-label="edit">
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => onDelete(String(sub.id))}
                              edge="end"
                              aria-label="delete"
                              sx={{ ml: 1 }}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </>
                        }
                      >
                        <ListItemText primary={sub.title} />
                      </ListItem>
                    </HoverCard>
                  ))}
                </List>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ pl: 2 }}
                >
                  Нет подкатегорий
                </Typography>
              )}
            </Box>
          ))}
        </Box>
        <Modal
          open={open}
          onClose={handleClose}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ bgcolor: "white", p: 4, borderRadius: 2 }}>
            {selectedCategory && <EditCategory category={selectedCategory} />}
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default ManageCategories;
