import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { selectCategories } from "../../../store/categories/categoriesSlice.ts";
import "./CategoryMenuBox.css";
import paw from "../../.../../../assets/paw-solid-svgrepo-com.svg";
import { fetchCategoriesThunk } from '../../../store/categories/categoriesThunk.ts';
import { Subcategory } from '../../../types';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';


const CategoryMenuBox = () => {
  const categories = useAppSelector(selectCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>("Собаки");
  const dispatch = useAppDispatch();
  const [hoveredSubcategory, setHoveredSubcategory] = useState<Subcategory | null>(null);
  const [hoveredNestedSubcategory, setHoveredNestedSubcategory] = useState<Subcategory | null>(null);

  const handleCategoryClick = (categoryTitle: string) => {
    setSelectedCategory(categoryTitle);
  };

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  const currentCategory = categories.find(
    (cat) => cat.title === selectedCategory,
  );

  return (
    <div className="menu-box mt-5 col-lg-3 col-md-4 d-none d-md-block">
      <ul className="nav category-nav">
        <li className="nav-item-category">
          <a
            href="#"
            className={selectedCategory === "Собаки" ? "active" : ""}
            onClick={() => handleCategoryClick("Собаки")}
          >
            Собаки
          </a>
        </li>
        <li className="nav-item-category">
          <a
            href="#"
            className={selectedCategory === "Кошки" ? "active" : ""}
            onClick={() => handleCategoryClick("Кошки")}
          >
            Кошки
          </a>
        </li>
        <li className="nav-item-category">
          <a
            href="#"
            className={selectedCategory === "Другие питомцы" ? "active" : ""}
            onClick={() => handleCategoryClick("Другие питомцы")}
          >
            Другие питомцы
          </a>
        </li>
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
              <img src={paw} alt="paw icon" className="paw-icon" />
              {sub.title}
            </a>

            {hoveredSubcategory?.id === sub.id &&
              sub.subcategories &&
              sub.subcategories.length > 0 && (
                <div className="nested-subcategories">
                  {sub.subcategories.map((nested) => (
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
                            {nested.subcategories.map((third) => (
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
    </div>
  );
};

export default CategoryMenuBox;
