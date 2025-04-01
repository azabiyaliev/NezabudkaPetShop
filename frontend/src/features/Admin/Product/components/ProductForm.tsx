import { ProductRequest } from "../../../../types";
import React, { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks.ts";
import { brandsFromSlice } from "../../../../store/brands/brandsSlice.ts";
import { getBrands } from "../../../../store/brands/brandsThunk.ts";
import { selectCategories } from "../../../../store/categories/categoriesSlice.ts";
import { fetchCategoriesThunk } from "../../../../store/categories/categoriesThunk.ts";
import TiptapEditor from "../../../../components/UI/TiptapEditor/TiptapEditor.tsx";
import { orange } from "@mui/material/colors";
import FormControl from "@mui/material/FormControl";
import FileInput from "../../../../components/FileInput/FileInput.tsx";

interface Props {
  onSubmit: (product: ProductRequest) => void;
  editProduct?: ProductRequest;
  isProduct?: boolean;
}

const initialState = {
  productName: "",
  productPhoto: null,
  productPrice: 0,
  productDescription: "",
  existence: false,
  sales: false,
  brandId: "",
  categoryId: "",
};

const ProductForm: React.FC<Props> = ({
  onSubmit,
  editProduct = initialState,
  isProduct = false,
}) => {
  const [form, setForm] = useState<ProductRequest>(editProduct || initialState);
  const dispatch = useAppDispatch();
  const brands = useAppSelector(brandsFromSlice);
  const categories = useAppSelector(selectCategories);

  const handleDescriptionChange = (html: string) => {
    setForm((prevState) => ({
      ...prevState,
      productDescription: html,
    }));
  };

  useEffect(() => {
    dispatch(getBrands()).unwrap();
    dispatch(fetchCategoriesThunk()).unwrap();
  }, [dispatch]);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitFormHandler = (e: FormEvent) => {
    e.preventDefault();
    if (!form.productName.trim()) {
      return toast.warning("Необходимо название товара!");
    }

    if (!form.productPrice || form.productPrice <= 0) {
      return toast.warning("Цена должна быть больше 0!");
    }

    if (!form.productDescription.trim()) {
      return toast.warning("Необходимо добавить описание товара!");
    }

    if (!form.brandId) {
      return toast.warning("Необходимо выбрать бренд!");
    }

    if (!form.categoryId) {
      return toast.warning("Необходимо выбрать категорию!");
    }

    if (!form.productPhoto) {
      return toast.warning("Необходимо изображение товара!");
    }

    onSubmit({ ...form });

    if (!isProduct) {
      setForm(initialState);
      return;
    }
  };

  const selectChangeHandler = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));
  };

  const fileEventChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    if (files) {
      setForm((prevState) => ({
        ...prevState,
        [name]: files[0] || null,
      }));
    }
  };

  return (
    <form onSubmit={submitFormHandler}>
      <Typography variant={"h5"} sx={{ mt: 4, textAlign: "center" }}>
        {!isProduct ? "Добавление товара" : "Редактирование товара"}
      </Typography>
      <Box
        sx={{
          width: "100%",
          marginTop: 5,
          mx: "auto",
          p: 2,
        }}
      >
        <Grid container direction="column" spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              sx={{
                width: "100%",
                "& label.Mui-focused": { color: orange[500] },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ccc" },
                  "&:hover fieldset": { borderColor: orange[500] },
                  "&.Mui-focused fieldset": { borderColor: orange[500] },
                },
              }}
              id="productName"
              name="productName"
              label="Название"
              required
              value={form.productName}
              onChange={inputChangeHandler}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              sx={{
                width: "100%",
                "& label.Mui-focused": { color: orange[500] },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ccc" },
                  "&:hover fieldset": { borderColor: orange[500] },
                  "&.Mui-focused fieldset": { borderColor: orange[500] },
                },
              }}
              type="number"
              id="productPrice"
              name="productPrice"
              label="Цена"
              required
              value={form.productPrice}
              onChange={inputChangeHandler}
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TiptapEditor
              content={form.productDescription}
              onChange={handleDescriptionChange}
            />
          </Grid>
          {brands.length === 0 ? (
            <Typography>Брендов пока нет</Typography>
          ) : (
            <Grid size={{ xs: 12 }}>
              <FormControl
                fullWidth
                sx={{
                  "& label.Mui-focused": { color: orange[500] },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ccc" },
                    "&:hover fieldset": { borderColor: orange[500] },
                    "&.Mui-focused fieldset": { borderColor: orange[500] },
                  },
                }}
              >
                <InputLabel id="brand">Бренд</InputLabel>
                <Select
                  labelId="brandId"
                  id="brandId"
                  value={form.brandId}
                  name="brandId"
                  label="Бренд"
                  onChange={selectChangeHandler}
                >
                  <MenuItem value="" disabled>
                    Выберите бренд
                  </MenuItem>
                  {brands.map((brand) => (
                    <MenuItem key={brand.id} value={brand.id}>
                      {brand.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          {categories.length === 0 ? (
            <Typography>Категорий пока нет</Typography>
          ) : (
            <Grid size={{ xs: 12 }}>
              <FormControl
                fullWidth
                sx={{
                  "& label.Mui-focused": { color: orange[500] },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ccc" },
                    "&:hover fieldset": { borderColor: orange[500] },
                    "&.Mui-focused fieldset": { borderColor: orange[500] },
                  },
                }}
              >
                <InputLabel id="category">Категория</InputLabel>
                <Select
                  labelId="categoryId"
                  id="categoryId"
                  value={form.categoryId}
                  name="categoryId"
                  label="Категория"
                  onChange={selectChangeHandler}
                >
                  <MenuItem value="" disabled>
                    Выберите категорию
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid size={{ xs: 12 }}>
            <FileInput
              name="productPhoto"
              label="Выберите изображение"
              onGetFile={fileEventChangeHandler}
            />
          </Grid>
          <Grid>
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    "&.Mui-checked": {
                      color: orange[500],
                    },
                  }}
                  checked={form.existence}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      existence: e.target.checked,
                    }))
                  }
                />
              }
              label="Есть в наличии"
            />

            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    "&.Mui-checked": {
                      color: orange[500],
                    },
                  }}
                  checked={form.sales}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, sales: e.target.checked }))
                  }
                />
              }
              label="Участвует в акции"
            />
          </Grid>
          <Grid>
            <Button
              type="submit"
              sx={{ color: "#ff9800", width: "100%" }}
              variant="outlined"
              color="inherit"
            >
              {!isProduct ? "Добавить" : "Сохранить"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
};

export default ProductForm;
