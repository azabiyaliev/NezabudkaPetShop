import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector, usePermission } from '../../../app/hooks.ts';
import { selectCategories } from "../../../store/categories/categoriesSlice.ts";
import "./CategoryMenuBox.css";
import { fetchCategoriesThunk } from '../../../store/categories/categoriesThunk.ts';
import { Subcategory } from '../../../types';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, IconButton, Modal } from '@mui/material';
import CategoryIcons from '../../../components/Forms/CategoryIcons/CategoryIcons.tsx';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Tooltip from '@mui/material/Tooltip';
import { selectUser } from '../../../store/users/usersSlice.ts';
import { apiUrl } from '../../../globalConstants.ts';

const CategoryMenuBox = () => {
  const categories = useAppSelector(selectCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>("Собаки");
  const dispatch = useAppDispatch();
  const [hoveredSubcategory, setHoveredSubcategory] = useState<Subcategory | null>(null);
  const [hoveredNestedSubcategory, setHoveredNestedSubcategory] = useState<Subcategory | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);
  const [openIconForm, setOpenIconForm] = useState(false);

  const user = useAppSelector(selectUser);
  const can = usePermission(user);

  const handleCategoryClick = (categoryTitle: string) => {
    setSelectedCategory(categoryTitle);
  };

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  const currentCategory = categories.find(
    (cat) => cat.title === selectedCategory,
  );

  const handleCloseIconForm = () => {
    setOpenIconForm(false);
  };

  const handleOpenIconForm = (e: React.FormEvent, subId: number) => {
    e.preventDefault();
    setSelectedSubcategoryId(subId);
    setOpenIconForm(true);
  };

  return (
    <div className="menu-box mt-5 col-lg-3 col-md-4 d-none d-md-block">
      <ul className="nav category-nav">
        {["Собаки", "Кошки", "Другие питомцы"].map((catTitle) => (
          <li className="nav-item-category" key={catTitle}>
            <a
              href="#"
              className={selectedCategory === catTitle ? "active" : ""}
              onClick={() => handleCategoryClick(catTitle)}
            >
              {catTitle}
            </a>
          </li>
        ))}
      </ul>

      <div className="subcategory-menu-desktop">
        {currentCategory?.subcategories?.map((sub) => (
          <div
            key={sub.id}
            className="subcategory-item-in-box"
            onMouseEnter={() => setHoveredSubcategory(sub)}
            onMouseLeave={() => {
              setHoveredSubcategory(null);
              setHoveredNestedSubcategory(null);
            }}
            style={{ position: "relative" }}
          >
            <a href="#" className="nav-category-link">
              {user && can(["admin", "superAdmin"]) && (
                <Tooltip title="Добавить иконку">
                  <IconButton onClick={(e) => handleOpenIconForm(e, sub.id)}>
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Tooltip>
              )}
              <img
                alt={sub.title}
                src={`${apiUrl}/${sub.icon}`}
                style={{ width: "30px", height: "30px" }}
              />
              {sub.title}
            </a>

            {hoveredSubcategory?.id === sub.id &&
              sub.subcategories &&
              sub.subcategories.length > 0 && (
                <div className="nested-subcategories">
                  {sub.subcategories?.map((nested) => (
                    <div
                      key={nested.id}
                      className="nested-subcategory-item"
                      onMouseEnter={() => setHoveredNestedSubcategory(nested)}
                      onMouseLeave={() => setHoveredNestedSubcategory(null)}
                      style={{ position: "relative" }}
                    >
                      <a
                        href="#"
                        className="nav-category-link d-flex justify-content-between align-items-center"
                      >
                        <span>{nested.title}</span>
                        {nested.subcategories &&
                          nested.subcategories.length > 0 && (
                            <KeyboardArrowRightIcon fontSize="small" />
                          )}
                      </a>

                      {hoveredNestedSubcategory?.id === nested.id &&
                        nested.subcategories &&
                        nested.subcategories.length > 0 && (
                          <div className="third-level-subcategories">
                            {nested.subcategories?.map((third) => (
                              <a
                                key={third.id}
                                href="#"
                                className="nav-category-link"
                              >
                                {third.title}
                              </a>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>

      <Modal
        open={openIconForm}
        onClose={handleCloseIconForm}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ bgcolor: "white", p: 4, borderRadius: 2, width: 400 }}>
          {selectedSubcategoryId !== null && (
            <CategoryIcons
              subcategoryId={selectedSubcategoryId}
              onClose={handleCloseIconForm}
            />
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default CategoryMenuBox;
