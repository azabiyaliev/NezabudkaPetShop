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
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowRightOutlinedIcon from "@mui/icons-material/ArrowRightOutlined";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../../store/users/usersSlice.ts";
import AdminBar from '../../features/Admin/AdminProfile/AdminBar.tsx';

interface Props {
  openMenu: boolean;
  closeMenu: () => void;
}

const CategoryNavMenu: React.FC<Props> = ({ openMenu, closeMenu }) => {
  const categories = useAppSelector(selectCategories);
  const dispatch = useAppDispatch();
  const [openCategory, setOpenCategory] = useState<number | null>(null);
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const can = usePermission(user);
  const [isAdminBarOpen, setIsAdminBarOpen] = useState(false);

  const toggleAdminBar = () => setIsAdminBarOpen(!isAdminBarOpen);

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  const toggleCategory = (categoryId: number) => {
    setOpenCategory((prev) => (prev === categoryId ? null : categoryId));
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
            p: { md: 3, sm: 0 },
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
          overflow: "auto",
        }}
      >
        {user && can(["admin", "superAdmin"]) && (
          <>
            <ModalClose onClick={toggleAdminBar} />
            <Divider />
            <Box
              sx={{
                p: 2,
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
            <DialogTitle
              sx={{ fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
            >
              Все категории
            </DialogTitle>
            <ModalClose onClick={closeMenu} />
            <Divider />
            {categories.length === 0 ? (
              <Typography
                level="h2"
                sx={{
                  fontSize: "xl",
                  margin: "20px auto",
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 600,
                }}
              >
                Кажется категорий пока нет :(
              </Typography>
            ) : (
              <List>
                {categories.map((category) => (
                  <Box key={category.id}>
                    <ListItem
                      disablePadding
                      sx={{ borderBottom: 1, borderBottomColor: "grey.300" }}
                    >
                      <ListItemButton
                        onClick={() => toggleCategory(category.id)}
                        sx={{
                          textAlign: "center",
                          backgroundColor: "transparent",
                          padding: "8px 16px",
                          color: "#343332",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderRadius: "4px",
                          fontSize: "13px",
                          "&:hover": {
                            backgroundColor: "#dce5d9",
                          },
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography
                              sx={{ fontWeight: 600, color: "#343332" }}
                            >
                              {category.title}
                            </Typography>
                          }
                        />
                        {openCategory === category.id ? (
                          <ArrowDropDownOutlinedIcon />
                        ) : (
                          <ArrowRightOutlinedIcon />
                        )}
                      </ListItemButton>
                    </ListItem>
                    <Collapse
                      in={openCategory === category.id}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding sx={{ pl: 4 }}>
                        {category.subcategories?.length ? (
                          category.subcategories.map((subcategory) => (
                            <ListItem
                              key={subcategory.id}
                              sx={{ padding: "4px 16px" }}
                            >
                              <ListItemButton
                                onClick={() => {
                                  closeMenu();
                                  navigate(`/all-products/${subcategory.id}`);
                                }}
                              >
                                <ListItemText primary={subcategory.title} />
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
                    </Collapse>
                  </Box>
                ))}
              </List>
            )}
          </>
        ) : null}
      </Sheet>
    </Drawer>
  );
};

export default CategoryNavMenu;
