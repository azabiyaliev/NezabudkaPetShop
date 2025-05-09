import React, { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, IconButton, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ruRU } from '@mui/x-data-grid/locales';
import { useNavigate } from 'react-router-dom';
import { AdminDataMutation } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { deleteAdmin, getAdmins } from '../../../store/admins/adminThunks.ts';
import { toast } from 'react-toastify';
import { deleteLoading } from '../../../store/admins/adminSlice.ts';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import Swal from 'sweetalert2';
import theme from '../../../globalStyles/globalTheme.ts';
import { enqueueSnackbar } from 'notistack';
import { Divider } from '@mui/joy';

interface Props {
  admins: AdminDataMutation[];
}

const AdminList: React.FC<Props> = ({ admins }) => {
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

  const columns: GridColDef<AdminDataMutation>[] = [
    { field: "id", headerName: "ID", width: 60 },
    { field: "firstName", headerName: "Имя", width: 130 },
    { field: "secondName", headerName: "Фамилия", width: 130 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Телефон", width: 140 },
    { field: "role", headerName: "Роль", width: 100 },
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
            color="primary"
          >
            <DeleteSweepOutlinedIcon />
          </IconButton>
          <IconButton
            onClick={() => navigate(`/private/admin-edit/${params.row.id}`)}
            color="primary"
          >
            <EditNoteOutlinedIcon fontSize="medium" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Grid container direction="column" alignItems="center">
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 600, mt: "10px" }}>
        Список администраторов
      </Typography>
      <Divider />
      <Box sx={{ width: "100%", overflowX: "auto",}}>
        <DataGrid
          getRowId={(row) => row.id!}
          rows={admins}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
          localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
          sx={{
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
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                margin: 0,
              },
            "& .MuiTablePagination-select": {
              minWidth: "auto",
            },
            "& .MuiTablePagination-actions": {
              display: "flex",
              gap: "8px",
            },
          }}
        />
      </Box>
    </Grid>
  );
};

export default AdminList;
