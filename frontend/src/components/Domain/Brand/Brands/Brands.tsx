import { IBrand } from '../../../../types';
import React, { useState } from 'react';
import { Box, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ruRU } from '@mui/x-data-grid/locales';
import { NavLink, useNavigate } from 'react-router-dom';
import { COLORS } from '../../../../globalStyles/stylesObjects';
import { apiUrl, userRoleAdmin, userRoleSuperAdmin } from '../../../../globalConstants.ts';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import { brandeDelete, getBrands } from '../../../../store/brands/brandsThunk.ts';
import { enqueueSnackbar } from 'notistack';
import { useAppDispatch, useAppSelector, usePermission } from '../../../../app/hooks.ts';
import { selectUser } from '../../../../store/users/usersSlice.ts';
import noImage from '../../../../assets/no-image.jpg';
import Swal from "sweetalert2";
import theme from '../../../../globalStyles/globalTheme.ts';

interface Props {
  brands: IBrand[];
}

const Brands: React.FC<Props> = ({ brands }) => {
  const [brandSearch, setBrandSearch] = useState('');
  const user = useAppSelector(selectUser);
  const can = usePermission(user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const filteredBrands = brands
    .map((brand, index) => ({ ...brand, index }))
    .filter((brand) =>
      brand.title.toLowerCase().includes(brandSearch.toLowerCase())
    );

  const deleteThisBrand = async (id: number) => {
    if (!user || !can([userRoleAdmin, userRoleSuperAdmin])) return;

    const result = await Swal.fire({
      title: "Удалить бренд?",
      text: "Вы уверены, что хотите удалить этот бренд? Это действие нельзя отменить.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: theme.colors.warning,
      cancelButtonColor: theme.colors.OLIVE_GREEN,
      confirmButtonText: "Удалить",
      cancelButtonText: "Отмена",
    });

    if (result.isConfirmed) {
      try {
        await dispatch(brandeDelete({ brandId: id, token: user.token })).unwrap();
        enqueueSnackbar("Бренд успешно удален!", { variant: 'success' });
        await dispatch(getBrands()).unwrap();
      } catch (error) {
        console.error("Ошибка при удалении бренда:", error);
        enqueueSnackbar("Ошибка при удалении бренда", { variant: 'error' });
      }
    }
  };

  const tableName: GridColDef[] = [
    {
      field: 'index',
      headerName: '№',
      width: 70,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      filterable: false,
      renderCell: (params) => <>{params.row.index + 1}</>,
      headerClassName: 'header-column',
    },
    {
      field: "title",
      headerName: "Название",
      width: 160,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Typography
          component={NavLink}
          to={`/brand/${params.row.id}`}
          sx={{
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
      field: "logo",
      headerName: "Логотип",
      width: 160,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <img
          src={params.value ? `${apiUrl}/${params.value}` : noImage}
          alt={params.row.title}
          style={{
            width: '80px',
            height: '80px',
            objectFit: 'contain',
          }}
        />
      ),
      headerClassName: 'header-column',
    },
    {
      field: "description",
      headerName: "Описание",
      width: 220,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header-column',
      renderCell: (params) => {
        return params.value ? params.value : '-';
      }
    },
    {
      field: 'actions',
      headerName: 'Действия',
      width: 220,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header-column',
      renderCell: (params) => (
        <>
          <IconButton sx={{
            marginRight: '20px'
          }}>
            <ClearIcon
              sx={{color: 'red'}}
              onClick={() => deleteThisBrand(params.row.id)}
            />
          </IconButton>

          <IconButton>
            <EditIcon
              sx={{color: '#ff9800'}}
              onClick={() => navigate(`/private/edit_brand/${params.row.id}`)}
            />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 600 }}>
        Список брендов
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <TextField
          variant="outlined"
          label="Поиск бренда"
          value={brandSearch}
          onChange={(e) => setBrandSearch(e.target.value)}
          sx={{
            borderRadius: "40px",
            width: "40%",
            "@media (max-width: 750px)": {
              width: "100%",
              minWidth: "100%",
            },
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
            rows={filteredBrands as (IBrand & { index: number })[]}
            getRowId={(row) => row.id!}
            columns={tableName}
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
};

export default Brands;
