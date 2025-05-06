import { ProductResponse } from "../../../../types";
import React from "react";
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Divider, IconButton, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ruRU } from '@mui/x-data-grid/locales';
import { apiUrl, userRoleAdmin, userRoleSuperAdmin } from '../../../../globalConstants.ts';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector, usePermission } from '../../../../app/hooks.ts';
import { selectUser } from '../../../../store/users/usersSlice.ts';
import {
  deleteProduct,
  getProducts,
} from '../../../../store/products/productsThunk.ts';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';


interface Props {
  products: ProductResponse[];
}

const Products: React.FC<Props> = ({products}) => {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const can = usePermission(user);


    const productDelete = async (id: number) => {
    if (user && can([userRoleAdmin, userRoleSuperAdmin])) {
      await dispatch(
        deleteProduct({productId: id, token: user.token}),
      ).unwrap();
      toast.success('Товар успешно удален!');
      await dispatch(getProducts('')).unwrap();
    }
  };

  const columns: GridColDef<ProductResponse>[] = [
    { field: "id", headerName: "ID", width: 60 },
    {
      field: 'productName',
      headerName: 'Название',
      width: 200,
      renderCell: (params) => (
        <Typography
          component={NavLink}
          to={`/product/${params.row.id}`}
          sx={{
            color: 'black',
            cursor: 'pointer',
            textDecoration: "none",
            '&:hover': {
              color: "rgba(250, 179, 1, 1)",
            },          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'productPhoto',
      headerName: 'Изображение',
      width: 150,
      editable: false,
      renderCell: (params) => (
        <img
          src={`${apiUrl}/${params.value}`}
          alt="Фото товара"
          style={{
            width: 120,
            height: 50,
            objectFit: 'cover',
            borderRadius: 4,
          }}
        />
      ),
    },
    {
      field: 'productPrice',
      headerName: 'Цена',
      width: 100,
      editable: false,
      valueGetter: (_value, row: ProductResponse) =>
        row.sales ? `${row.promoPrice} сом (скидка)` : `${row.productPrice} сом`,
    },
    {
      field: 'productDescription',
      headerName: 'Описание',
      width: 170,
      editable: false,
      renderCell: (params) => (
        <div
          dangerouslySetInnerHTML={{
            __html: params.value,
          }}
        />
      ),
    },
    {
      field: 'brandId',
      headerName: 'Бренд',
      width: 100,
      editable: false,
      renderCell: ({row}: { row: ProductResponse }) =>
        row.brand ? (
          row.brand.title
        ) : (
          <CancelIcon sx={{color: 'error.main'}}/>
        ),
    },
    {
      field: 'category',
      headerName: 'Категория',
      width: 200,
      editable: false,
      valueGetter: (_val, row: ProductResponse) => {
        const category = row.productCategory?.[0]?.category;
        return category?.parentId ? category?.parent?.title ?? '—' : category?.title ?? '—';
      },
    },
    {
      field: 'existence',
      headerName: 'Наличие',
      width: 100,
      renderCell: (params) =>
        params.value ? (
          <CheckCircleIcon sx={{color: 'success.main'}}/>
        ) : (
          <CancelIcon sx={{color: 'error.main'}}/>
        ),
    },
    {
      field: 'isBestseller',
      headerName: 'Хит продаж',
      width: 100,
      renderCell: (params) =>
        params.value ? (
          <CheckCircleIcon sx={{color: 'success.main'}}/>
        ) : (
          <CancelIcon sx={{color: 'error.main'}}/>
        ),
    },
    {
      field: 'sales',
      headerName: 'Акция',
      width: 100,
      renderCell: (params) =>
        params.value ? (
          <CheckCircleIcon sx={{color: 'success.main'}}/>
        ) : (
          <CancelIcon sx={{color: 'error.main'}}/>
        ),
    },
    {
      field: 'startDateSales',
      headerName: 'Начало акции',
      width: 100,
      valueGetter: (_value, row: ProductResponse) => row.startDateSales ? dayjs(row.startDateSales).format('DD-MM-YYYY') : null,
    },
    {
      field: 'endDateSales',
      headerName: 'Окончание акции',
      width: 100,
      valueGetter: (_value, row: ProductResponse) => row.endDateSales ? dayjs(row.endDateSales).format('DD-MM-YYYY') : null,
    },
    {
      field: 'orderedProductStats',
      headerName: 'Статистики купленных товаров',
      width: 100,
      editable: false,
      valueGetter: (_value, row) => row.orderedProductsStats ?? 0
    },
    {
      field: 'actions',
      headerName: 'Действия',
      sortable: false,
      editable: false,
      filterable: false,
      width: 100,
      renderCell: (params) => (
        <>
          <IconButton>
            <ClearIcon
              sx={{color: 'red'}}
              onClick={() => productDelete(params.row.id)}
            />
          </IconButton>

          <IconButton>
            <EditIcon
              sx={{color: '#ff9800'}}
              onClick={() => navigate(`/private/edit_product/${params.row.id}`)}
            />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Grid container direction="column" alignItems="center">
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 600, mt:3, mb:"20px" }}>
        Список всех товаров
      </Typography>
      <Divider/>
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
          sx={{
            '& .MuiDataGrid-footerContainer': {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
            '& .MuiTablePagination-toolbar': {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            },
            '& .MuiTablePagination-spacer': {
              flex: 1,
            },
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              margin: 0,
            },
            '& .MuiTablePagination-select': {
              minWidth: 'auto',
            },
            '& .MuiTablePagination-actions': {
              display: 'flex',
              gap: '8px',
            },
          }}
        />
      </Grid>
    </Grid>
  );
}
  ;

  export default Products;
