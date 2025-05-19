import React, { useEffect, useState } from "react";
import Drawer from "@mui/joy/Drawer";
import Sheet from "@mui/joy/Sheet";
import DialogTitle from "@mui/joy/DialogTitle";
import ModalClose from "@mui/joy/ModalClose";
import Divider from "@mui/joy/Divider";
import {
  useAppDispatch,
  useAppSelector,
  usePermission,
} from "../../app/hooks.ts";
import { selectCategories } from "../../store/categories/categoriesSlice.ts";
import { fetchCategoriesThunk } from "../../store/categories/categoriesThunk.ts";
import Typography from "@mui/joy/Typography";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import { selectUser } from "../../store/users/usersSlice.ts";
import AdminBar from '../../features/Admin/AdminProfile/AdminBar.tsx';
import { ICategories, Subcategory } from '../../types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { COLORS } from '../../globalStyles/stylesObjects.ts';

interface Props {
  openMenu: boolean;
  closeMenu: () => void;
}

const CategoryNavMenu: React.FC<Props> = ({ openMenu, closeMenu }) => {
  const categories = useAppSelector(selectCategories);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const can = usePermission(user);
  const [isAdminBarOpen, setIsAdminBarOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);


  const [currentCategory, setCurrentCategory] = useState<{
    id: number;
    title: string;
    subcategories: Subcategory[] | [];
  } | null>(null);

  const handleCategoryClick = (category: ICategories) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentCategory({
        id: category.id,
        title: category.title,
        subcategories: category.subcategories || [],
      });
      setIsAnimating(false);
    }, 150);
  };

  const handleBackClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentCategory(null);
      setIsAnimating(false);
    }, 150);
  };


  const toggleAdminBar = () => setIsAdminBarOpen(!isAdminBarOpen);

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);


  const handleSubcategoryClick = (subcategoryId: number) => {
    closeMenu();
    navigate(`/all-products/${subcategoryId}`);
  };

  return (
    <Drawer
      anchor="left"
      size="md"
      variant="plain"
      open={openMenu}
      onClose={closeMenu}
      slotProps={{
        content: {
          sx: {
            bgcolor: "transparent",
            boxShadow: "none",
            width: 400,
            "@media (max-width: 400px)": {
              width: 300,
            },
          },
        },
      }}
    >
      <Sheet
        sx={{
          borderRadius: "md",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "100%",
          overflow: "hidden",
          "@media (max-width: 1390px)": {
            paddingRight: 0,
          },
        }}
      >
        {user && can(["admin", "superAdmin"]) && (
          <>
            <ModalClose onClick={toggleAdminBar} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <AdminBar />
            </Box>
          </>
        )}

        {!user || !can(["admin", "superAdmin"]) ? (
          <>
            <Box
              sx={{
                position: "relative",
                overflow: "hidden",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  width: "100%",
                  top: 0,
                  left: currentCategory
                    ? isAnimating
                      ? "-100%"
                      : "-100%"
                    : isAnimating
                      ? "0%"
                      : "0%",
                  transition: "left 0.3s ease-in-out",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <DialogTitle
                    sx={{
                      fontFamily: "Nunito, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    Все категории
                  </DialogTitle>
                  <ModalClose
                    onClick={closeMenu}
                    sx={{ position: "static", marginRight: "10px" }}
                  />
                </Box>

                <Divider />

                <Box
                  sx={{
                    overflowY: "auto",
                    flexGrow: 1,
                  }}
                >
                  <List>
                    {categories.length === 0 ? (
                      <Typography
                        level="h2"
                        sx={{
                          fontSize: "xl",
                          margin: "20px 5px",
                          fontFamily: "Nunito, sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        Кажется категорий пока нет :(
                      </Typography>
                    ) : (
                      categories.map((category) => (
                        <ListItem key={category.id} disablePadding>
                          <ListItemButton
                            onClick={() => handleCategoryClick(category)}
                            sx={{
                              textAlign: "left",
                              padding: "10px 16px",
                              color: "#343332",
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: "13px",
                              "&:hover": {
                                backgroundColor: "#dce5d9",
                              },
                            }}
                          >
                            <ListItemText
                              primary={
                                <Typography
                                  sx={{ fontWeight: 500, color: "#343332" }}
                                >
                                  {category.title}
                                </Typography>
                              }
                            />
                            <KeyboardArrowRightIcon sx={{ color: COLORS.text }} />
                          </ListItemButton>
                        </ListItem>
                      ))
                    )}
                  </List>
                </Box>
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  width: "100%",
                  top: 0,
                  left: currentCategory
                    ? isAnimating
                      ? "0%"
                      : "0%"
                    : isAnimating
                      ? "100%"
                      : "100%",
                  transition: "left 0.3s ease-in-out",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                {currentCategory && (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <IconButton onClick={handleBackClick}>
                        <ArrowBackIcon />
                      </IconButton>
                      <DialogTitle
                        sx={{
                          fontFamily: "Nunito, sans-serif",
                          fontWeight: 600,
                          marginLeft: "20px",
                          marginRight: "auto",
                        }}
                      >
                        {currentCategory.title}
                      </DialogTitle>
                      <ModalClose
                        onClick={closeMenu}
                        sx={{ position: "static", marginRight: "10px" }}
                      />
                    </Box>

                    <Divider />

                    <Box
                      sx={{
                        overflowY: "auto",
                        flexGrow: 1,
                      }}
                    >
                      <List>
                        {currentCategory.subcategories.length > 0 ? (
                          currentCategory.subcategories.map((subcategory) => (
                            <ListItem key={subcategory.id} disablePadding>
                              <ListItemButton
                                onClick={() => handleSubcategoryClick(subcategory.id)}
                                sx={{
                                  textAlign: "left",
                                  padding: "8px 16px",
                                  color: "#343332",
                                  display: "flex",
                                  justifyContent: "center",
                                  fontSize: "13px",
                                  "&:hover": {
                                    backgroundColor: "#dce5d9",
                                  },
                                }}
                              >
                                <ListItemText
                                  primary={
                                    <Typography
                                      sx={{ fontWeight: 500, color: "#343332" }}
                                    >
                                      {subcategory.title}
                                    </Typography>
                                  }
                                />
                              </ListItemButton>
                            </ListItem>
                          ))
                        ) : (
                          <Typography
                            sx={{
                              fontSize: "13px",
                              padding: "8px 16px",
                              color: "#656565",
                            }}
                          >
                            Тут пока нет подкатегорий :)
                          </Typography>
                        )}
                      </List>
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          </>
        ) : null}
      </Sheet>
    </Drawer>
  );
};

export default CategoryNavMenu;
