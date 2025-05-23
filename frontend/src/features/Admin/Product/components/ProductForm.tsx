import { ProductRequest } from "../../../../types";
import React, { FormEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  InputLabel, ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks.ts";
import { brandsFromSlice } from "../../../../store/brands/brandsSlice.ts";
import { getBrands } from "../../../../store/brands/brandsThunk.ts";
import { selectCategories } from "../../../../store/categories/categoriesSlice.ts";
import { fetchCategoriesThunk } from "../../../../store/categories/categoriesThunk.ts";
import FormControl from "@mui/material/FormControl";
import FileInput from "../../../../components/FileInput/FileInput.tsx";
import { addProductLoading } from "../../../../store/products/productsSlice.ts";
import TextEditor from '../../../../components/TextEditor/TextEditor.tsx';
import { apiUrl } from '../../../../globalConstants.ts';
import CloseIcon from '@mui/icons-material/Close';
import { enqueueSnackbar } from 'notistack';
import { COLORS } from '../../../../globalStyles/stylesObjects.ts';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';


interface Props {
  onSubmit: (product: ProductRequest) => void;
  editProduct?: ProductRequest;
  isProduct?: boolean;
}

const initialState: ProductRequest = {
  productName: "",
  productPhoto: null,
  productPrice: 0,
  productDescription: "",
  existence: false,
  sales: false,
  isBestseller: false,
  brandId: "",
  categoryId: [],
  startDateSales: null,
  endDateSales: null,
  productSize: "",
  productAge: "",
  productWeight: 0,
  productFeedClass: "",
  productManufacturer: "",
  promoPrice: 0,
  promoPercentage: 0,
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
  const [titleError, setTitleError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [sizeError, setSizeError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [weightError, setWeightError] = useState("");
  const [feedClassError, setFeedClassError] = useState("");
  const [manufacturerError, setManufacturerError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    dispatch(getBrands()).unwrap();
    dispatch(fetchCategoriesThunk()).unwrap();
  }, [dispatch]);

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
        promoPercentage: editProduct.promoPercentage ? Number(editProduct.promoPercentage) : 0,
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


  const selectChangeHandler = (e: SelectChangeEvent<string[] | string>) => {
    const { name, value } = e.target;

    if (name === "categoryId") {
      const selectedIds = typeof value === "string" ? value.split(",").map(Number) : value.map(Number);
      setForm((prevState) => ({
        ...prevState,
        categoryId: selectedIds,
      }));
    } else {
      setForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "productName") setTitleError("");
    if (name === "productName" && value.trim() === "") {
      setTitleError("Название товара является обязательным полем и не может быть пустым.");
    }
    if (name === "productPrice") {
      if (Number(value) <= 0) {
        setPriceError("Цена товара должна быть больше нуля.");
      } else {
        setPriceError("");
      }
    }
    if (showAdvancedFields) {
      if (name === "productSize") setSizeError("");
      if (name === "productSize" && value.trim() === "") {
        setSizeError("Поле размер не может быть пустым.");
      }
      if (name === "productAge") setAgeError("");
      if (name === "productAge" && value.trim() === "") {
        setAgeError("Поле возраста не может быть пустым.");
      }
      if (name === "productWeight") {
        if (Number(value) <= 0) {
          setWeightError("Поле вес не может быть равна нулю.");
        } else {
          setWeightError("");
        }
      }
      if (name === "productFeedClass") setFeedClassError("");
      if (name === "productFeedClass" && value.trim() === "") {
        setFeedClassError("Поле класс корма не может быть пустым.");
      }
      if (name === "productManufacturer") setManufacturerError("");
      if (name === "productManufacturer" && value.trim() === "") {
        setManufacturerError("Поле производитель не может быть пустым.");
      }
    }
  };

  const submitFormHandler = (e: FormEvent) => {
    e.preventDefault();

    if (!form.productName.trim()) {
      return enqueueSnackbar('Необходимо название товара!', { variant: 'error' });
    }

    if (!form.productPrice || form.productPrice <= 0) {
      return enqueueSnackbar('Цена должна быть больше 0!', { variant: 'error' });
    }

    if (!form.productDescription.trim()) {
      return enqueueSnackbar('Необходимо добавить описание товара!', { variant: 'error' });
    }

    if (!form.categoryId) {
      return enqueueSnackbar('Необходимо выбрать категорию!', { variant: 'error' });
    }

    if (!form.productPhoto) {
      return enqueueSnackbar('Необходимо изображение товара!', { variant: 'error' });
    }

    if (form.sales) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const startDate = new Date(form.startDateSales!);
      startDate.setHours(0, 0, 0, 0);

      if (!form.startDateSales || !form.endDateSales) {
        return enqueueSnackbar('Укажите даты начала и окончания акции!', { variant: 'error' });
      }

      if (form.startDateSales > form.endDateSales) {
        return enqueueSnackbar('Дата окончания не может быть раньше начала!', { variant: 'error' });
      }

      if (startDate < now) {
        return enqueueSnackbar('Дата начало акции не может раньше сегодняшнего дня!', { variant: 'error' });
      }
    }

    if(form.promoPercentage === undefined) return form.promoPercentage;

    if(form.promoPercentage < 0 || form.promoPercentage > 100) {
      return enqueueSnackbar('Процент не может быть ниже 0 и выше 100!', { variant: 'error' });
    }


    onSubmit({ ...form });

    if (!isProduct) {
      setForm(initialState);
      return;
    }
  };

  let promoFinalPrice = Number(form.promoPercentage);
  promoFinalPrice =
    form.sales && form.promoPercentage ? form.productPrice * (1 - promoFinalPrice / 100) : form.productPrice;


  const fileEventChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    const value = files && files[0] ? files[0] : null;

    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const deletePhoto = () => {
    setForm({
      ...form,
      productPhoto: null,
    });
  };

  const toggleAdvancedFields = () => {
    setShowAdvancedFields((prev) => !prev);
  };

  const disableButton = Boolean(
    form.productName.trim() &&
    form.productPrice > 0 &&
    form.productDescription.trim() &&
    form.categoryId &&
    form.productPhoto &&
    (!form.sales || (form.startDateSales && form.endDateSales && form.startDateSales <= form.endDateSales)) &&
    (form.promoPercentage === undefined ||
      (form.promoPercentage >= 0 && form.promoPercentage <= 100))
  );

  return (
    <form onSubmit={submitFormHandler} style={{
      border: '1px solid #ccc',
      borderRadius: "4px",
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '30px 20px',
      marginTop: '20px',
      width: "100%"
    }}>
      <Box
        sx={{
          marginTop: 1,
          mx: "auto",
        }}
      >
        <Grid container direction="column" spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              sx={{
                width: "100%",
              }}
              id="productName"
              name="productName"
              label="Название"
              required
              value={form.productName}
              onChange={inputChangeHandler}
              error={!!titleError}
              helperText={titleError}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              sx={{
                width: "100%",
              }}
              type="number"
              id="productPrice"
              name="productPrice"
              label="Цена"
              required
              value={form.productPrice}
              onChange={inputChangeHandler}
              inputProps={{ min: 1 }}
              error={!!priceError}
              helperText={priceError}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextEditor
              placeholder='Описание'
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
              >
                <InputLabel id="brand-label-unique">Бренд</InputLabel>
                <Select
                  labelId="brand-label-unique"
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
            <Grid size={{xs:12}}>
              <FormControl fullWidth>
                <InputLabel id="category-label-unique">Категория</InputLabel>
                <Select
                  labelId="category-label-unique"
                  id="categoryId"
                  label='Категория'
                multiple
                value={form.categoryId}
                onChange={(e) => {
                  const value = Array.isArray(e.target.value) ? e.target.value : [];
                  setForm((prev) => ({
                    ...prev,
                    categoryId: value,
                  }));
                }}
                renderValue={(selected) =>
                  selected
                    .map(id => {
                      const parent = categories.find(cat => cat.id === id);
                      if (parent) return parent.title;

                      const parentWithSub = categories.find(cat =>
                        cat.subcategories?.some(sub => sub.id === id)
                      );
                      const sub = parentWithSub?.subcategories?.find(sub => sub.id === id);
                      return parentWithSub && sub
                        ? `${parentWithSub.title} → ${sub.title}`
                        : sub?.title || '';
                    })
                    .join(', ')
                }
                MenuProps={{
                  PaperProps: {
                    style: { maxHeight: 300 },
                  },
                }}
              >
                  <MenuItem disableRipple disableGutters>
                    <TextField
                      placeholder="Поиск..."
                      fullWidth
                      size="small"
                      autoFocus
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                      sx={{
                        backgroundColor: '#fff',
                      }}
                    />
                  </MenuItem>

                {categories.flatMap(parent => {
                  const matchesParent = parent.title.toLowerCase().includes(searchTerm);
                  const filteredSubs = (parent.subcategories ?? []).filter(sub =>
                    sub.title.toLowerCase().includes(searchTerm)
                  );

                  const result: React.ReactNode[] = [];

                  if (matchesParent || filteredSubs.length > 0) {
                    const showSubcategories = filteredSubs.length > 0;

                    if (matchesParent || showSubcategories) {
                      result.push(
                        <ListSubheader key={`group-${parent.id}`}>
                          {parent.title}
                        </ListSubheader>
                      );
                    }

                    if (matchesParent) {
                      result.push(
                        <MenuItem key={`parent-${parent.id}`} value={parent.id}>
                          <Checkbox checked={form.categoryId.includes(parent.id)} />
                          <Typography fontWeight="bold">{parent.title}</Typography>
                        </MenuItem>
                      );
                    }

                    if (filteredSubs.length > 0) {
                      result.push(
                        ...filteredSubs.map(sub => (
                          <MenuItem key={sub.id} value={sub.id}>
                            <Checkbox checked={form.categoryId.includes(sub.id)} />
                            {sub.title}
                          </MenuItem>
                        ))
                      );
                    }
                  }

                  return result;
                })}
              </Select>


              </FormControl>
            </Grid>
          )}
          <Grid size={{ xs: 12 }}>
            <FileInput
              name="productPhoto"
              label="Выберите изображение"
              onGetFile={fileEventChangeHandler}
              initialValue={form.productPhoto !== null ? form.productPhoto : ""}
            />
            {form.productPhoto && (
              <Box sx={{
                display: "flex",
              }}>
                <img
                  style={{
                    width: "200px",
                    height: "200px",
                    textIndent: "-9999px",
                    display: "block",
                    objectFit: "contain",
                  }}
                  src={
                    form.productPhoto instanceof File
                      ? URL.createObjectURL(form.productPhoto)
                      : apiUrl + form.productPhoto
                  }
                  alt={form.productName}
                />
                <CloseIcon onClick={() => deletePhoto()}/>
              </Box>
            )}
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button
              onClick={toggleAdvancedFields}
              sx={{
                mt: 2,
                mb: 2,
                color: COLORS.primary,
                border: `1px solid ${COLORS.primary}`,
                borderRadius: 2,
                px: 2,
                py: 1,
                textTransform: "none",
                fontWeight: 500,
                transition: "all 0.3s ease",
              }}
              endIcon={showAdvancedFields ? <ExpandLessIcon /> : <ExpandMoreIcon />}
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
                  error={!!sizeError}
                  helperText={sizeError}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Возраст"
                  name="productAge"
                  value={form.productAge}
                  onChange={inputChangeHandler}
                  fullWidth
                  error={!!ageError}
                  helperText={ageError}
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
                  error={!!weightError}
                  helperText={weightError}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Класс корма"
                  name="productFeedClass"
                  value={form.productFeedClass}
                  onChange={inputChangeHandler}
                  fullWidth
                  error={!!feedClassError}
                  helperText={feedClassError}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Производитель"
                  name="productManufacturer"
                  value={form.productManufacturer}
                  onChange={inputChangeHandler}
                  fullWidth
                  error={!!manufacturerError}
                  helperText={manufacturerError}
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
                      color: COLORS.primary,
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
                      color:  COLORS.primary,
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

            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    "&.Mui-checked": {
                      color:  COLORS.primary,
                    },
                  }}
                  checked={form.isBestseller || false}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, isBestseller: e.target.checked }))
                  }
                />
              }
              label="Хит продаж"
            />
            {form.sales && (
              <Grid
                container
                spacing={2}
                sx={{
                  mt: 2,
                  justifyContent: "center",
                }}
              >
                <Grid >
                  <TextField
                    label="Дата начала акции"
                    type="date"
                    name="startDateSales"
                    InputLabelProps={{ shrink: true }}
                    value={form.startDateSales ?? ""}
                    onChange={inputChangeHandler}
                    sx={{ width: 300 }}
                  />
                </Grid>

                <Grid >
                  <TextField
                    label="Дата окончания акции"
                    type="date"
                    name="endDateSales"
                    InputLabelProps={{ shrink: true }}
                    value={form.endDateSales ?? ""}
                    onChange={inputChangeHandler}
                    sx={{ width: 300 }}
                  />
                </Grid>

                <Grid >
                  <TextField
                    label="Скидка (%)"
                    id="promoPercentage"
                    name="promoPercentage"
                    type="number"
                    inputProps={{ min: 0, max: 100 }}
                    value={form.promoPercentage ?? ""}
                    onChange={inputChangeHandler}
                    sx={{ width: 300 }}
                  />
                  {form.promoPercentage && Number(form.promoPercentage) > 0 && (
                    <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
                      Цена со скидкой {form.promoPercentage}%:{" "}
                      <strong>{promoFinalPrice} сом</strong>
                    </Typography>
                  )}
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid container justifyContent="center">
            <Grid >
              <Button
                type="submit"
                sx={{
                  color: COLORS.white,
                  background: disableButton ? COLORS.primary : null,
                }}
                variant="outlined"
                color="inherit"
                disabled={!disableButton || loading}
              >
                {!isProduct ? "Добавить" : "Сохранить"}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
};

export default ProductForm;
