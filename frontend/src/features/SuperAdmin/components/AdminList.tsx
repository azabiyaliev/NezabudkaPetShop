import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Divider, IconButton, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ruRU } from '@mui/x-data-grid/locales';
import { useNavigate } from 'react-router-dom';
import { AdminDataMutation } from '../../../types';
import { useAppDispatch } from '../../../app/hooks.ts';
import { deleteAdmin, getAdmins } from '../../../store/admins/adminThunks.ts';
import { toast } from 'react-toastify';


interface Props {
  admins: AdminDataMutation[];
}

const AdminList: React.FC<Props> = ({ admins }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();


  const handleDelete = async (id: number) => {
      await dispatch(deleteAdmin(id)).unwrap();
      toast.success('Админ успешно удалён');
      await dispatch(getAdmins()).unwrap();
  };

  const columns: GridColDef<AdminDataMutation>[] = [
    { field: 'id', headerName: 'ID', width: 60 },
    { field: 'firstName', headerName: 'Имя', width: 130 },
    { field: 'secondName', headerName: 'Фамилия', width: 130 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Телефон', width: 140 },
    { field: 'role', headerName: 'Роль', width: 100 },
    {
      field: 'actions',
      headerName: 'Действия',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => handleDelete(Number(params.row.id))}
            disabled={params.row.role === 'superAdmin'}
          >
            <DeleteIcon sx={{ color: 'red' }} />
          </IconButton>
          <IconButton onClick={() => navigate(`/admin-edit/${params.row.id}`)}>
            <EditIcon sx={{ color: '#ff9800' }} />
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
        sx={{ flexGrow: 1, textAlign: 'center', mt: 3, mb: 3 }}
      >
        Список администраторов
      </Typography>
      <Divider />
      <Grid width="100%">
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
          checkboxSelection
          disableRowSelectionOnClick
          localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        />
      </Grid>
    </Grid>
  );
};

export default AdminList;
