import { ProductRequest } from "../../../../types";
import React, { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
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
import { orange } from "@mui/material/colors";
import FormControl from "@mui/material/FormControl";
import FileInput from "../../../../components/FileInput/FileInput.tsx";
import { addProductLoading } from "../../../../store/products/productsSlice.ts";
import TextEditor from '../../../../components/TextEditor/TextEditor.tsx';
import { apiUrl } from '../../../../globalConstants.ts';
import CloseIcon from '@mui/icons-material/Close';
import theme from '../../../../globalStyles/globalTheme.ts';


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

    if(form.promoPercentage === undefined) return form.promoPercentage;

    if(form.promoPercentage < 0 || form.promoPercentage > 100) {
      return toast.warning('Процент не может быть ниже 0 и выше 100!')
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
    <form onSubmit={submitFormHandler}>
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 600, mt:3 }}>
        {!isProduct ? "Добавление товара" : "Редактирование товара"}
      </Typography>
      <Box
        sx={{
          width: "100%",
          marginTop: 1,
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
              error={!!titleError}
              helperText={titleError}
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
                inputProps={{ min: 1 }}
                error={!!priceError}
                helperText={priceError}
              />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextEditor
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
            <Grid size={{xs:12}}>
              <FormControl fullWidth>
                <InputLabel id="categoryId">Категория</InputLabel>
                <Select
                  labelId="categoryId"
                  id="categoryId"
                  multiple
                  value={form.categoryId}
                  name="categoryId"
                  label="Категория"
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
                        const parent = categories.find(cat =>
                          cat.subcategories?.some(sub => sub.id === id)
                        );
                        const sub = parent?.subcategories?.find(sub => sub.id === id);
                        return parent && sub ? `${parent.title} → ${sub.title}` : sub?.title;
                      })
                      .join(', ')
                  }
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                >
                  {categories.flatMap(parent => {
                    const group = [
                      <ListSubheader key={`header-${parent.id}`}>{parent.title}</ListSubheader>,
                      ...(parent.subcategories ?? []).map(sub => (
                        <MenuItem key={sub.id} value={sub.id}>
                          <Checkbox checked={form.categoryId.includes(sub.id)} />
                          {sub.title}
                        </MenuItem>
                      )),
                    ];
                    return group;
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
                  sx={{
                    "& label.Mui-focused": { color: orange[500] },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#ccc" },
                      "&:hover fieldset": { borderColor: orange[500] },
                      "&.Mui-focused fieldset": { borderColor: orange[500] },
                    }
                  }}
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
                  sx={{
                    "& label.Mui-focused": { color: orange[500] },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#ccc" },
                      "&:hover fieldset": { borderColor: orange[500] },
                      "&.Mui-focused fieldset": { borderColor: orange[500] },
                    }
                  }}
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
                  sx={{
                    "& label.Mui-focused": { color: orange[500] },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#ccc" },
                      "&:hover fieldset": { borderColor: orange[500] },
                      "&.Mui-focused fieldset": { borderColor: orange[500] },
                    }
                  }}
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
                  sx={{
                    "& label.Mui-focused": { color: orange[500] },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#ccc" },
                      "&:hover fieldset": { borderColor: orange[500] },
                      "&.Mui-focused fieldset": { borderColor: orange[500] },
                    }
                  }}
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
                <Grid>
                  <TextField
                  label='Скидочные проценты %'
                  id="promoPercentage"
                  name='promoPercentage'
                  type='number'
                  value={form.promoPercentage}
                  onChange={inputChangeHandler}/>
                  <Typography sx={{marginTop: theme.spacing.xs}}>
                    Цена с {form.promoPercentage}% будет равна {promoFinalPrice} cом
                  </Typography>
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
              disabled={!disableButton || loading}
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
