import React, { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { ruRU } from '@mui/x-data-grid/locales';
import { useNavigate } from 'react-router-dom';
import { AdminDataMutation } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { deleteAdmin, getAdmins } from '../../../store/admins/adminThunks.ts';
import { toast } from 'react-toastify';
import { deleteLoading } from '../../../store/admins/adminSlice.ts';
import Swal from 'sweetalert2';
import theme from '../../../globalStyles/globalTheme.ts';
import { enqueueSnackbar } from 'notistack';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';

interface Props {
  admins: AdminDataMutation[];
}

const AdminList: React.FC<Props> = ({ admins }) => {
  const [adminSearch, setAdminSearch] = useState<string>('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectDelete, setSelectDelete] = useState<string>("");
  const isDelete = useAppSelector(deleteLoading);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Удалить администратора?",
      text: "Вы уверены, что хотите удалить этого администратора? Это действие нельзя отменить.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: theme.colors.warning,
      cancelButtonColor: theme.colors.OLIVE_GREEN,
      confirmButtonText: "Удалить",
      cancelButtonText: "Отмена",
    });

    if (result.isConfirmed) {
      try {
        setSelectDelete(String(id));
        await dispatch(deleteAdmin(id)).unwrap();
        await dispatch(getAdmins()).unwrap();
        enqueueSnackbar('Вы успешно удалили администратора!', { variant: 'success' });
      } catch (error) {
        console.error("Ошибка при удалении администратора:", error);
        toast.error("Не удалось удалить администратора");
        enqueueSnackbar('Не удалось удалить администратора!', { variant: 'error' });
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
      renderCell: (params) => {
        const sortedIds = params.api.getSortedRowIds();
        const index = sortedIds.indexOf(params.id);
        return <>{index + 1}</>;
      },
      headerClassName: 'header-column',
    },
    {
      field: "actions",
      headerName: "Действия",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => handleDelete(Number(params.row.id))}
            disabled={
              params.row.role === "superAdmin" ||
              (isDelete && selectDelete === String(params.row.id))
            }
            sx={{ marginRight: '10px' }}
          >
            <ClearIcon sx={{ color: 'red' }} />
          </IconButton>
          <IconButton
            onClick={() => navigate(`/private/admin-edit/${params.row.id}`)}
          >
            <EditIcon sx={{ color: '#ff9800' }} />
          </IconButton>
        </>
      ),
      headerClassName: 'header-column'
    },
    { field: "firstName", headerName: "Имя", width: 130, headerClassName: 'header-column' },
    { field: "secondName", headerName: "Фамилия", width: 130, headerClassName: 'header-column' },
    { field: "email", headerName: "Email", width: 200, headerClassName: 'header-column' },
    { field: "phone", headerName: "Телефон", width: 140, headerClassName: 'header-column' },
    { field: "role", headerName: "Роль", width: 100, headerClassName: 'header-column' },
  ];

  const filteredAdmins = admins.filter((admin) =>
    admin.firstName.toLowerCase().includes(adminSearch.toLowerCase())
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 600 }}>
        Список администраторов
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <TextField
          variant="outlined"
          label="Поиск администратора"
          value={adminSearch}
          onChange={(e) => setAdminSearch(e.target.value)}
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
            "@media (max-width: 750px)": {
              width: "100%",
              minWidth: "100%",
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
            rows={filteredAdmins}
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
};

export default AdminList;
