import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { selectCategories } from "../../../store/categories/categoriesSlice.ts";
import "./CategoryMenuBox.css";
import paw from "../../.../../../assets/paw-solid-svgrepo-com.svg";
import { fetchCategoriesThunk } from '../../../store/categories/categoriesThunk.ts';
import { Subcategory } from '../../../types';


const CategoryMenuBox = () => {
  const categories = useAppSelector(selectCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>("Собаки");
  const dispatch = useAppDispatch();
  const [hoveredSubcategory, setHoveredSubcategory] = useState<Subcategory | null>(null);

  const handleCategoryClick = (categoryTitle: string) => {
    setSelectedCategory(categoryTitle);
  };

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  const currentCategory = categories.find(
    (cat) => cat.title === selectedCategory,
  );

  console.log(categories);

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
            onMouseLeave={() => setHoveredSubcategory(null)}
            style={{position: "relative"}}
          >
            <a href="#" className="nav-category-link">
              <img src={paw} alt="paw icon" className="paw-icon"/>
              {sub.title}
            </a>

            {hoveredSubcategory?.id === sub.id &&
              sub.subcategories &&
              sub.subcategories.length > 0 && (
                <div className="nested-subcategories">
                  {sub.subcategories.map((nested) => (
                    <a key={nested.id} href="#" className="nav-category-link">
                      {nested.title}
                    </a>
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
