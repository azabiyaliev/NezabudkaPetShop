import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  IconButton,
  ListItemText,
  Modal,
  Typography,
  Tooltip,
  ListItemButton,
} from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { DndProvider, getBackendOptions, MultiBackend, NodeModel, Tree } from '@minoru/react-dnd-treeview';

import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { selectCategories } from '../../../store/categories/categoriesSlice.ts';
import {
  deleteCategory,
  fetchCategoriesThunk,
  fetchOneCategoryThunk,
  updateSubcategoryParentThunk,
} from "../../../store/categories/categoriesThunk.ts";
import { selectUser } from '../../../store/users/usersSlice.ts';
import { ICategories, Subcategory } from '../../../types';
import NewCategory from "../NewCategory/NewCategory.tsx";
import SubcategoryForm from '../../../components/Forms/SubcategoryForm/SubcategoryForm.tsx';
import { toast } from 'react-toastify';
import './ManageCategories.css';
import EditCategory from '../../../components/Forms/CategoryForm/EditCategory.tsx';
import { COLORS } from '../../../globalStyles/stylesObjects.ts';
import styles from './styles.module.css';

const SUCCESSFUL_CATEGORY_DELETE = "Удаление прошло успешно!";
const ERROR_CATEGORY_DELETE = "Ошибка при удалении подкатегории!";
const WARNING_CATEGORY_DELETE = "Категория не пуста или используется в данный момент, не стоит удалять!";

const ManageCategories = () => {
  const categories = useAppSelector(selectCategories);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [openAddSubModal, setOpenAddSubModal] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);

  const [parentCategoryId, setParentCategoryId] = useState<number | null>(null);
  const [treeData, setTreeData] = useState<NodeModel[]>([]);

  const [fetchedCategory, setFetchedCategory] = useState<ICategories | null>(null);

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  const handleOpenCategory = (id: string) => {

    dispatch(fetchOneCategoryThunk(id))
      .unwrap()
      .then((category) => {
        setFetchedCategory(category as ICategories);
        setOpenCategoryModal(true);
      })
      .catch(() => {
        toast.error("Ошибка при получении категории", { position: 'top-center' });
      });
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
        toast.warning(WARNING_CATEGORY_DELETE, { position: "top-center" });
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

  const handleDrop = async (newTree: NodeModel[]) => {
    setTreeData(newTree);

    for (const node of newTree) {
      const originalNode = treeData.find((n) => n.id === node.id);
      if (originalNode && originalNode.parent !== node.parent) {
        const subcategoryId = node.id as number;
        const newParentId = node.parent === 0 ? null : (node.parent as number);

        if (!user) return null;

        try {
          await dispatch(
            updateSubcategoryParentThunk({
              subcategoryId,
              newParentId,
              token: user.token,
            }),
          );
          toast.success('Положение подкатегории успешно сохранено', {
            position: 'top-center',
          });
        } catch (error) {
          console.error('Ошибка при сохранении положения подкатегории:', error);
          toast.error('Ошибка при сохранении положения подкатегории', {
            position: 'top-center',
          });
          setTreeData(treeData);
          return;
        }
      }
    }

    await dispatch(fetchCategoriesThunk());
  };

  type Props = {
    node: NodeModel;
    depth: number;
  }

  const Placeholder: React.FC<Props> = (props) => {
    const left = props.depth * 24;

    return (
      <Box
        sx={{
          backgroundColor: '#1967d2',
          height: '2px',
          position: 'absolute',
          right: 0,
          transform: 'translateY(-50%)',
          top: 0,
          left: left,
        }}
      />
    );
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h4" textAlign="center" sx={{ mt: 2 }}>
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
          положение в иерархии.
        </Typography>

        <Box>
          <DndProvider backend={MultiBackend} options={getBackendOptions()}>
            <div className="categories-ul">
              <Tree
                tree={treeData}
                rootId={0}
                onDrop={handleDrop}
                dragPreviewRender={({ item }) => {
                  return (
                    <Box
                      sx={{
                        padding: '8px 16px',
                        backgroundColor: '#fefefe',
                        border: '2px solid #1976d2',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        color: COLORS.info,
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        maxWidth: '300px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.text}
                    </Box>
                  );
                }}
                classes={{
                  dropTarget: styles.dropTarget
                }}
                placeholderRender={(node, { depth }) => (
                  <Placeholder node={node} depth={depth} />
                )}
                render={(node, { depth, isOpen, onToggle }) => {
                  const category = node.data as ICategories;
                  const isSubcategory = depth > 0;

                  return (
                    <div
                      className={isSubcategory ? 'subcategory-item' : 'category-item'}
                      style={{
                        marginInlineStart: depth * 20,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <ListItemButton onClick={onToggle} sx={{ flex: 1 }}>
                        {node.droppable && (
                          <ArrowDropDownOutlinedIcon
                            sx={{
                              transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                              transition: 'transform 0.2s',
                              marginRight: '20px',
                            }}
                          />
                        )}
                        <ListItemText
                          primary={node.text}
                          sx={{
                            fontSize: isSubcategory ? '0.9rem' : '1rem',
                            fontWeight: isSubcategory ? 'normal' : 'bold',
                          }}
                        />
                      </ListItemButton>

                      <Tooltip title="Показать категорию">
                        <IconButton onClick={() => handleOpenCategory(String(category.id))}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Удалить категорию">
                        <IconButton onClick={() => onDelete(String(category.id))} color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Добавить подкатегорию">
                        <IconButton onClick={() => handleAddSubcategory(category.id)} color="success">
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
          open={openAddSubModal}
          onClose={handleCloseAddSubcategory}
          sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Box sx={{ bgcolor: "white", p: 4, borderRadius: 2, width: 400 }}>
            {parentCategoryId && (
              <SubcategoryForm categoryId={parentCategoryId} onClose={handleCloseAddSubcategory} />
            )}
          </Box>
        </Modal>

        <Modal
          open={openCategoryModal}
          onClose={() => {
            setOpenCategoryModal(false);
            setFetchedCategory(null);
          }}
          sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Box sx={{ bgcolor: "white", p: 4, borderRadius: 2, width: 500 }}>
            {fetchedCategory && (
              <EditCategory
                category={{
                  id: fetchedCategory.id,
                  title: fetchedCategory.title,
                  icon: fetchedCategory.icon as string | undefined,
                  image: fetchedCategory.image as string | undefined,
                }}
                onClose={() => {
                  setOpenCategoryModal(false);
                  setFetchedCategory(null);
                }}
              />
            )}
            {!fetchedCategory && openCategoryModal && (
              <Typography>Загрузка данных категории...</Typography>
            )}
          </Box>
        </Modal>

      </Box>
    </>
  );
};

export default ManageCategories;