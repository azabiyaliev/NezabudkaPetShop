import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { selectOneCategory } from "../../../store/categories/categoriesSlice.ts";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchOneCategoryThunk } from "../../../store/categories/categoriesThunk.ts";

const OneCategory = () => {
  const category = useAppSelector(selectOneCategory);
  const dispatch = useAppDispatch();
  const { title } = useParams<{ title: string }>();

  useEffect(() => {
    if (title) {
      dispatch(fetchOneCategoryThunk(title));
    }
  }, [dispatch, title]);

  console.log(category);
  return <div></div>;
};

export default OneCategory;
