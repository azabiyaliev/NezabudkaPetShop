import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  IconButton,
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
} from '../../../store/categories/categoriesThunk.ts';

import NewCategory from "../NewCategory/NewCategory.tsx";
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import EditCategory from '../../../components/Forms/CategoryForm/EditCategory.tsx';
import EditSubcategory from '../../../components/Forms/CategoryForm/EditSubcategory.tsx';
import SubcategoryForm from '../../../components/Forms/SubcategoryForm/SubcategoryForm.tsx';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import ListItemButton from '@mui/material/ListItemButton';
import { ICategories, Subcategory } from '../../../types';
import { DndProvider, getBackendOptions, MultiBackend, NodeModel, Tree } from '@minoru/react-dnd-treeview';
import './ManageCategories.css'

const SUCCESSFUL_CATEGORY_DELETE = "Удаление прошло успешно!";
const ERROR_CATEGORY_DELETE = "Ошибка при удалении подкатегории!";
const WARNING_CATEGORY_DELETE = "Категория не пуста или используется в данный момент, не стоит удалять!";


const ManageCategories = () => {
  const categories = useAppSelector(selectCategories);
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [openSubModal, setOpenSubModal] = useState(false);
  const [openAddSubModal, setOpenAddSubModal] = useState(false);
  const [parentCategoryId, setParentCategoryId] = useState<number | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<{
    id: number;
    title: string;
    parentId: number;
  } | null>(null);


  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

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

  const handleSubEditClose = () => {
    setOpenSubModal(false);
    setSelectedSubCategory(null);
  };


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

  const handleAddSubcategory = (categoryId: number) => {
    setParentCategoryId(categoryId);
    setOpenAddSubModal(true);
  };

  const handleCloseAddSubcategory = () => {
    setOpenAddSubModal(false);
    setParentCategoryId(null);
  };

  const transformCategoriesToTree = useCallback(
    (categories: ICategories[] | Subcategory[], parent: number = 0): NodeModel[] => {
      return categories.flatMap((category) => {
        const node: NodeModel = {
          id: category.id,
          parent: parent,
          text: category.title,
          droppable: true,
          data: {
            id: category.id,
            title: category.title,
            subcategories: category.subcategories || [],
          },
        };

        const children = category.subcategories?.length
          ? transformCategoriesToTree(category.subcategories, category.id)
          : [];

        return [node, ...children];
      });
    },
    []
  );

  useEffect(() => {
    if (categories.length) {
      const tree = transformCategoriesToTree(categories);
      setTreeData(tree);
    }
  }, [categories, transformCategoriesToTree]);

  const [treeData, setTreeData] = useState<NodeModel[]>([]);
  const handleDrop = (newTree: NodeModel[]) => setTreeData(newTree);

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <NavLink
          to="/private_account"
          style={{
            color: "green",
            textDecoration: "none",
            fontWeight: "bold",
            marginTop: "20px",
            padding: "2px",
          }}
        >
          <ArrowBackIcon />
          Назад...
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

        <Box>
          <DndProvider backend={MultiBackend} options={getBackendOptions()}>
            <div className="categories-ul">
              <Tree
                tree={treeData}
                rootId={0}
                onDrop={handleDrop}
                render={(node, { depth, isOpen, onToggle }) => {
                  const category = node.data as ICategories;
                  return (
                    <div
                      style={{
                        marginInlineStart: depth * 20,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ListItemButton onClick={onToggle} sx={{ flex: 1 }}>
                        {node.droppable && (
                          <ArrowDropDownOutlinedIcon
                            sx={{
                              transform: isOpen
                                ? "rotate(0deg)"
                                : "rotate(-90deg)",
                              transition: "transform 0.2s",
                              marginRight: "20px",
                            }}
                          />
                        )}
                        <ListItemText primary={node.text} />
                      </ListItemButton>

                      <Tooltip title="Редактировать категорию">
                        <IconButton
                          onClick={() =>
                            handleOpen({
                              id: category.id,
                              title: category.title,
                            })
                          }
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Удалить категорию">
                        <IconButton
                          onClick={() => onDelete(String(category.id))}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Добавить подкатегорию">
                        <IconButton
                          onClick={() => handleAddSubcategory(category.id)}
                          color="success"
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  );
                }}
              />
            </div>
          </DndProvider>
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

        <Modal
          open={openSubModal}
          onClose={handleSubEditClose}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ bgcolor: "white", p: 4, borderRadius: 2 }}>
            {selectedSubCategory && (
              <EditSubcategory subcategory={selectedSubCategory} />
            )}
          </Box>
        </Modal>

        <Modal
          open={openAddSubModal}
          onClose={handleCloseAddSubcategory}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ bgcolor: "white", p: 4, borderRadius: 2, width: 400 }}>
            {parentCategoryId && (
              <SubcategoryForm categoryId={parentCategoryId} />
            )}
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default ManageCategories;
