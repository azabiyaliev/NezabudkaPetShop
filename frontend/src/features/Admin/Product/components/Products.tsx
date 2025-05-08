import { ProductResponse } from '../../../../types';
import React, { useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { ruRU } from '@mui/x-data-grid/locales';
import { apiUrl, userRoleAdmin, userRoleSuperAdmin } from '../../../../globalConstants.ts';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector, usePermission } from '../../../../app/hooks.ts';
import { selectUser } from '../../../../store/users/usersSlice.ts';
import { deleteProduct, getProducts, } from '../../../../store/products/productsThunk.ts';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import theme from '../../../../globalStyles/globalTheme.ts';
import { enqueueSnackbar } from 'notistack';
import SearchIcon from '@mui/icons-material/Search';
import { COLORS } from '../../../../globalStyles/stylesObjects.ts';
import ReactHtmlParser from 'html-react-parser';


interface Props {
  products: ProductResponse[];
}

const Products: React.FC<Props> = ({products}) => {
  const [productSearch, setProductSearch] = useState('');
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const can = usePermission(user);

    const filteredProducts = products
      .map((product, index) => ({ ...product, index }))
      .filter((product) =>
        product.productName.toLowerCase().includes(productSearch.toLowerCase())
      );


    const productDelete = async (id: number) => {
      if (!user || !can([userRoleAdmin, userRoleSuperAdmin])) return;

      const result = await Swal.fire({
        title: "Удалить товар?",
        text: "Вы уверены, что хотите удалить этот товар? Это действие нельзя отменить.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: theme.colors.warning,
        cancelButtonColor: theme.colors.OLIVE_GREEN,
        confirmButtonText: "Удалить",
        cancelButtonText: "Отмена",
      });

      if (result.isConfirmed) {
        try {
          await dispatch(deleteProduct({ productId: id, token: user.token })).unwrap();
          enqueueSnackbar('Товар успешно удалён!', { variant: 'success' });
          await dispatch(getProducts('')).unwrap();
        } catch (error) {
          console.error("Ошибка при удалении товара:", error);
          enqueueSnackbar('Ошибка при удалении товара', { variant: 'error' });
        }
      }
    };

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: "ID",
      width: 70,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      filterable: false,
      renderCell: (params) => <>{params.row.index + 1}</>,
      headerClassName: 'header-column',
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
      headerClassName: 'header-column',
    },
    {
      field: 'productName',
      headerName: 'Название',
      width: 180,
      renderCell: (params) => (
        <Typography
          component={NavLink}
          to={`/product/${params.row.id}`}
          sx={{
            fontSize: '14px',
            color: 'black',
            cursor: 'pointer',
            textDecoration: "none",
            '&:hover': {
              color: COLORS.DARK_GREEN,
            },
          }}
        >
          {params.value}
        </Typography>
      ),
      headerClassName: 'header-column',
    },
    {
      field: 'productPhoto',
      headerName: 'Изображение',
      width: 100,
      editable: false,
      renderCell: (params) => (
        <img
          src={`${apiUrl}/${params.value}`}
          alt="Фото товара"
          style={{
            width: 80,
            height: 80,
            objectFit: 'cover',
          }}
        />
      ),
      headerClassName: 'header-column',
    },
    {
      field: 'productPrice',
      headerName: 'Цена',
      width: 100,
      editable: false,
      valueGetter: (_value, row: ProductResponse) =>
        `${row.productPrice.toLocaleString('ru-RU').replace(/,/g, ' ')} сом`,
      headerClassName: 'header-column',
    },
    {
      field: 'promoPrice',
      headerName: 'Цена акции',
      width: 100,
      editable: false,
      renderCell: (params) => (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              color: COLORS.yellow,
              fontSize: '14px',
            }}
          >
            {params.row.sales
              ? `${params.row.promoPrice?.toLocaleString('ru-RU').replace(/,/g, ' ')} сом`
              : `-`}
          </Typography>
        </Box>
      ),
      headerClassName: 'header-column',
    },
    {
      field: 'productDescription',
      headerName: 'Описание',
      width: 170,
      editable: false,
      renderCell: (params) => {
        return (
          ReactHtmlParser(params.value)
        );
      },
      headerClassName: 'header-column',
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
      headerClassName: 'header-column',
    },
    {
      field: 'category',
      headerName: 'Категория',
      width: 120,
      editable: false,
      valueGetter: (_val, row: ProductResponse) => {
        const category = row.productCategory?.[0]?.category;
        return category?.parentId ? category?.parent?.title ?? '—' : category?.title ?? '—';
      },
      headerClassName: 'header-column',
    },
    {
      field: 'existence',
      headerName: 'Наличие',
      width: 80,
      renderCell: (params) =>
        params.value ? (
          <CheckCircleIcon sx={{color: 'success.main'}}/>
        ) : (
          <CancelIcon sx={{color: 'error.main'}}/>
        ),
      headerClassName: 'header-column',
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
      headerClassName: 'header-column',
    },
    {
      field: 'sales',
      headerName: 'Акция',
      width: 80,
      renderCell: (params) =>
        params.value ? (
          <CheckCircleIcon sx={{color: 'success.main'}}/>
        ) : (
          <CancelIcon sx={{color: 'error.main'}}/>
        ),
      headerClassName: 'header-column',
    },
    {
      field: 'startDateSales',
      headerName: 'Начало %',
      width: 100,
      renderCell: (params) => (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography sx={{fontSize: '14px'}}>
            {params.row.startDateSales ? dayjs(params.row.startDateSales).format('DD-MM-YYYY') : '-'}
          </Typography>
        </Box>
      ),
      headerClassName: 'header-column',
    },
    {
      field: 'endDateSales',
      headerName: 'Конец %',
      width: 100,
      renderCell: (params) => (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography sx={{fontSize: '14px'}}>
            {params.row.endDateSales ? dayjs(params.row.endDateSales).format('DD-MM-YYYY') : '-'}
          </Typography>
        </Box>
      ),
      headerClassName: 'header-column',
    },
    {
      field: 'orderedProductStats',
      headerName: 'Статистики купленных товаров',
      width: 100,
      editable: false,
      renderCell: (params) => (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography sx={{fontSize: '14px'}}>
            {params.row.orderedProductsStats ? params.row.orderedProductsStats : 0}
          </Typography>
        </Box>
      ),
      headerClassName: 'header-column',
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 600 }}>
        Список товаров
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <TextField
          variant="outlined"
          label="Поиск товара"
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
          sx={{
            borderRadius: "40px",
            width: "40%",
            '& .MuiOutlinedInput-root': {
              borderRadius: '40px',
              '& fieldset': {
                borderColor: "#8EA58C",
              },
              '&.Mui-focused fieldset': {
                borderColor: "#388e3c",
              },
            },
          }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ color: "darkgreen" }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", width: '100%' }}>
        <Box sx={{ width: "100%", overflowX: 'auto' }}>
          <DataGrid
            rows={filteredProducts as (ProductResponse & { index: number })[]}
            getRowId={(row) => row.id!}
            columns={columns}
            initialState={{
              sorting: {
                sortModel: [{ field: 'firstName', sort: 'asc' }],
              },
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            disableRowSelectionOnClick
            localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
            rowHeight={80}
            sx={{
              border: 'none',
              width: '100%',
              "& .MuiDataGrid-footerContainer": {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
              "& .MuiTablePagination-toolbar": {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              },
              "& .MuiTablePagination-spacer": {
                flex: 1,
              },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                margin: 0,
              },
              "& .MuiTablePagination-select": {
                minWidth: "auto",
              },
              "& .MuiTablePagination-actions": {
                display: "flex",
                gap: "8px",
              },
              "& .MuiCheckbox-root": {
                color: "#81c784",
              },
              "& .Mui-selected": {
                backgroundColor: "#e8f5e9 !important",
              },
              "& .header-column .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold",
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
  ;

  export default Products;
