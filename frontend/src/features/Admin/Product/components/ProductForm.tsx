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
import QuillEditor from "../../../../components/UI/QuillEditor/QuillEditor.tsx";
import { orange } from "@mui/material/colors";
import FormControl from "@mui/material/FormControl";
import FileInput from "../../../../components/FileInput/FileInput.tsx";
import { addProductLoading } from "../../../../store/products/productsSlice.ts";


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
  subcategoryId: "",
  startDateSales: null,
  endDateSales: null,
  productSize: "",
  productAge: "",
  productWeight: 0,
  productFeedClass: "",
  productManufacturer: "",
};

const ProductForm: React.FC<Props> = ({
  onSubmit,
  editProduct = initialState,
  isProduct = false,
}) => {
  const [form, setForm] = useState<ProductRequest>(editProduct || initialState);
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const dispatch = useAppDispatch();
  const brands = useAppSelector(brandsFromSlice);
  const categories = useAppSelector(selectCategories);
  const loading = useAppSelector(addProductLoading);
  const selectedCategory = categories.find(
    (category) => category.id === Number(form.categoryId),
  );
  useEffect(() => {
    dispatch(getBrands()).unwrap();
    dispatch(fetchCategoriesThunk()).unwrap();
  }, [dispatch]);

  useEffect(() => {
    if (categories.length > 0 && form.categoryId) {
      const categoryWithSub = categories.find((cat) =>
        cat.subcategories?.some((sub) => sub.id === Number(form.categoryId)),
      );

      if (categoryWithSub) {
        setForm((prev) => ({
          ...prev,
          categoryId: String(categoryWithSub.id),
          subcategoryId: prev.subcategoryId || prev.categoryId,
        }));
      }
    }
  }, [categories, form.categoryId]);

  useEffect(() => {
    if (editProduct) {
      const formatDate = (dateStr: Date | null | undefined | string): string =>
        dateStr ? new Date(dateStr).toISOString().split("T")[0] : "";

      const sanitizeString = (val: unknown): string => {
        if (val === null || val === undefined || val === 'null') {
          return '';
        }
        return String(val);
      };

      setForm({
        ...editProduct,
        startDateSales: formatDate(editProduct.startDateSales),
        endDateSales: formatDate(editProduct.endDateSales),
        productSize: sanitizeString(editProduct.productSize),
        productAge: sanitizeString(editProduct.productAge),
        productFeedClass: sanitizeString(editProduct.productFeedClass),
        productManufacturer: sanitizeString(editProduct.productManufacturer),
        productWeight: editProduct.productWeight ?? 0,
      });
    }
  }, [editProduct]);

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

    if (!form.categoryId) {
      return toast.warning("Необходимо выбрать категорию!");
    }

    if (!form.productPhoto) {
      return toast.warning("Необходимо изображение товара!");
    }

    if (form.sales) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const startDate = new Date(form.startDateSales!);
      startDate.setHours(0, 0, 0, 0);

      if (!form.startDateSales || !form.endDateSales) {
        return toast.warning("Укажите даты начала и окончания акции!");
      }

      if (form.startDateSales > form.endDateSales) {
        return toast.warning("Дата окончания не может быть раньше начала!");
      }

      if (startDate < now) {
        return toast.warning("Дата начало акции не может раньше сегодняшнего дня!")
      }
    }

    const categoryIdToSend = form.subcategoryId
      ? form.subcategoryId
      : form.categoryId;
    onSubmit({
      ...form,
      categoryId: categoryIdToSend,
      sales: Boolean(form.sales),
      existence: Boolean(form.existence),
      startDateSales: form.startDateSales || null,
      endDateSales: form.endDateSales || null,
      productAge: form.productAge?.trim() || null,
      productSize: form.productSize?.trim() || null,
      productManufacturer: form.productManufacturer?.trim() || null,
      productFeedClass: form.productFeedClass?.trim() || null,
      productWeight: form.productWeight || null,
    });

    if (!isProduct) {
      setForm(initialState);
      return;
    }
  };

  const selectChangeHandler = (e: SelectChangeEvent) => {
    const { name, value } = e.target;

    setForm((prevState) => ({
      ...prevState,
      [name]: value,
      ...(name === "categoryId" ? { subcategoryId: "" } : {}),
    }));
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

  const toggleAdvancedFields = () => {
    setShowAdvancedFields((prev) => !prev);
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
            <QuillEditor
              value={form.productDescription}
              onChange={(html) =>
                setForm((prev) => ({
                  ...prev,
                  productDescription: html,
                }))
              }
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
                  value={form.brandId ?? ""}
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
                <InputLabel id="categoryId">Категория</InputLabel>
                <Select
                  labelId="categoryId"
                  id="categoryId"
                  value={
                    categories.some((cat) => cat.id === Number(form.categoryId))
                      ? form.categoryId
                      : form.category
                        ? String(form.category?.parentId)
                        : ""
                  }
                  name="categoryId"
                  label="categoryId"
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
          {Array.isArray(selectedCategory?.subcategories) && selectedCategory?.subcategories?.length > 0 && (
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
                <InputLabel id="subcategoryId">Подкатегория</InputLabel>
                <Select
                  labelId="subcategoryId"
                  id="subcategoryId"
                  value={form.subcategoryId}
                  name="subcategoryId"
                  label="Подкатегория"
                  onChange={selectChangeHandler}
                >
                  <MenuItem value="" disabled>
                    Выберите подкатегорию
                  </MenuItem>
                  {categories.find((cat) => cat.id === Number(form.categoryId))?.subcategories?.map((subcategory) => (
                    <MenuItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.title}
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
          <Grid size={{ xs: 12 }}>
            <Button
              onClick={toggleAdvancedFields}
              sx={{ mt: 2, mb: 2, color: orange[500] }}
            >
              {showAdvancedFields ? "Скрыть дополнительные поля" : "Показать дополнительные поля"}
            </Button>
          </Grid>
          {showAdvancedFields && (
            <>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Размер"
                  name="productSize"
                  value={form.productSize}
                  onChange={inputChangeHandler}
                  fullWidth
                  sx={{
                    "& label.Mui-focused": { color: orange[500] },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#ccc" },
                      "&:hover fieldset": { borderColor: orange[500] },
                      "&.Mui-focused fieldset": { borderColor: orange[500] },
                    }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Возраст"
                  name="productAge"
                  value={form.productAge}
                  onChange={inputChangeHandler}
                  fullWidth
                  sx={{
                    "& label.Mui-focused": { color: orange[500] },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#ccc" },
                      "&:hover fieldset": { borderColor: orange[500] },
                      "&.Mui-focused fieldset": { borderColor: orange[500] },
                    }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Вес (грамм)"
                  name="productWeight"
                  type="number"
                  value={form.productWeight}
                  onChange={inputChangeHandler}
                  fullWidth
                  sx={{
                    "& label.Mui-focused": { color: orange[500] },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#ccc" },
                      "&:hover fieldset": { borderColor: orange[500] },
                      "&.Mui-focused fieldset": { borderColor: orange[500] },
                    }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Класс корма"
                  name="productFeedClass"
                  value={form.productFeedClass}
                  onChange={inputChangeHandler}
                  fullWidth
                  sx={{
                    "& label.Mui-focused": { color: orange[500] },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#ccc" },
                      "&:hover fieldset": { borderColor: orange[500] },
                      "&.Mui-focused fieldset": { borderColor: orange[500] },
                    }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Производитель"
                  name="productManufacturer"
                  value={form.productManufacturer}
                  onChange={inputChangeHandler}
                  fullWidth
                  sx={{
                    "& label.Mui-focused": { color: orange[500] },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#ccc" },
                      "&:hover fieldset": { borderColor: orange[500] },
                      "&.Mui-focused fieldset": { borderColor: orange[500] },
                    }
                  }}
                />
              </Grid>
            </>
          )}
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
            {form.sales && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 5 }} >
                  <TextField
                    label="Дата начала акции"
                    type="date"
                    name="startDateSales"
                    InputLabelProps={{ shrink: true }}
                    value={form.startDateSales ?? ""}
                    onChange={inputChangeHandler}
                    sx={{
                      width: "100%",
                      "& label.Mui-focused": { color: orange[500] },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#ccc" },
                        "&:hover fieldset": { borderColor: orange[500] },
                        "&.Mui-focused fieldset": { borderColor: orange[500] },
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 5 }}>
                  <TextField
                    label="Дата окончания акции"
                    type="date"
                    name="endDateSales"
                    InputLabelProps={{ shrink: true }}
                    value={form.endDateSales ?? ""}
                    onChange={inputChangeHandler}
                    sx={{
                      width: "100%",
                      "& label.Mui-focused": { color: orange[500] },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#ccc" },
                        "&:hover fieldset": { borderColor: orange[500] },
                        "&.Mui-focused fieldset": { borderColor: orange[500] },
                      }
                    }}
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid>
            <Button
              type="submit"
              sx={{ color: "#ff9800", width: "100%" }}
              variant="outlined"
              color="inherit"
              disabled={loading}
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
