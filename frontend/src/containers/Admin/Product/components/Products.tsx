import { ProductResponse } from "../../../../types";
import React from 'react';
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Divider, IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ruRU } from "@mui/x-data-grid/locales";
import { apiUrl } from "../../../../globalConstants.ts";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../../../../app/hooks.ts';
import { selectUser } from "../../../../features/users/usersSlice.ts";
import { deleteProduct, getProducts } from '../../../../features/products/productsThunk.ts';
import { toast } from 'react-toastify';

interface Props {
  products: ProductResponse[];
}

const Products: React.FC<Props> = ({ products }) => {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const productDelete = async (id: number) => {
    if (user && user.role === "admin") {
      await dispatch(
        deleteProduct({ productId: id, token: user.token }),
      ).unwrap();
      toast.success("Товар успешно удален!");
      await dispatch(getProducts()).unwrap();
    }
  };

  const columns: GridColDef<ProductResponse>[] = [
    { field: "id", headerName: "ID", width: 60 },
    {
      field: "productName",
      headerName: "Название",
      width: 150,
      editable: false,
    },
    {
      field: "productPhoto",
      headerName: "Изображение",
      width: 150,
      editable: false,
      renderCell: (params) => (
        <img
          src={`${apiUrl}/${params.value}`}
          alt="Фото товара"
          style={{
            width: 120,
            height: 50,
            objectFit: "cover",
            borderRadius: 4,
          }}
        />
      ),
    },
    {
      field: "productPrice",
      headerName: "Цена",
      width: 100,
      editable: false,
    },
    {
      field: "productDescription",
      headerName: "Описание",
      width: 170,
      editable: false,
    },
    {
      field: "categoryId",
      headerName: "Категория",
      width: 100,
      editable: false,
      valueGetter: (_value, row: ProductResponse) => row.category.title,
    },
    {
      field: "brandId",
      headerName: "Бренд",
      width: 100,
      editable: false,
      valueGetter: (_value, row: ProductResponse) => row.brand.title,
    },
    {
      field: "existence",
      headerName: "Наличие",
      width: 100,
      renderCell: (params) =>
        params.value ? (
          <CheckCircleIcon sx={{ color: "success.main" }} />
        ) : (
          <CancelIcon sx={{ color: "error.main" }} />
        ),
    },
    {
      field: "sales",
      headerName: "Акция",
      width: 100,
      renderCell: (params) =>
        params.value ? (
          <CheckCircleIcon sx={{ color: "success.main" }} />
        ) : (
          <CancelIcon sx={{ color: "error.main" }} />
        ),
    },
    {
      field: "actions",
      headerName: "Действия",
      sortable: false,
      editable: false,
      filterable: false,
      width: 100,
      renderCell: (params) => (
        <>
          <IconButton>
            <ClearIcon sx={{ color: "red" }} onClick={ () => productDelete(params.row.id) }/>
          </IconButton>

          <IconButton>
            <EditIcon
              sx={{ color: "#ff9800" }}
              onClick={() => navigate(`/private/edit_product/${params.row.id}`)}
            />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Grid container>
      <Typography
        variant="h5"
        component="div"
        sx={{ flexGrow: 1, textAlign: "center", mt: 3, mb: 3 }}
      >
        Список всех товаров
      </Typography>
      <Divider />
      <Grid width="100%">
        <DataGrid
          getRowId={(row) => row.id}
          rows={products}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          checkboxSelection
          disableRowSelectionOnClick
          localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        />
      </Grid>
    </Grid>
  );
};

export default Products;
