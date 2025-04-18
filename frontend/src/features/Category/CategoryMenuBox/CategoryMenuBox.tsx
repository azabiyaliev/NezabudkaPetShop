import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { selectCategories } from "../../../store/categories/categoriesSlice.ts";
import "./CategoryMenuBox.css";
import paw from "../../.../../../assets/paw-solid-svgrepo-com.svg";
import { fetchCategoriesThunk } from '../../../store/categories/categoriesThunk.ts';
import { useNavigate } from 'react-router-dom';

const CategoryMenuBox = () => {
  const categories = useAppSelector(selectCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>("Собаки");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

      <div className="subcategory-content">
        { currentCategory && (
          <div className="subcategory-menu-desktop">
            {currentCategory.subcategories?.map((sub) => (
              <a key={sub.id} href="#" className="nav-category-link" onClick={() => navigate(`/all-products/${sub.id}`)}>
                <img src={paw} alt="paw icon" className="paw-icon" />
                {sub.title}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryMenuBox;
