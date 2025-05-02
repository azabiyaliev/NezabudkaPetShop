import React, { useState } from 'react';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Divider, IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ruRU } from "@mui/x-data-grid/locales";
import { useNavigate } from "react-router-dom";
import { AdminDataMutation } from "../../../types";
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { deleteAdmin, getAdmins } from "../../../store/admins/adminThunks.ts";
import { toast } from "react-toastify";
import { deleteLoading } from '../../../store/admins/adminSlice.ts';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';

interface Props {
  admins: AdminDataMutation[];
}

const AdminList: React.FC<Props> = ({ admins }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectDelete, setSelectDelete] = useState<string>("");
  const isDelete = useAppSelector(deleteLoading);

  const handleDelete = async (id: number) => {
    setSelectDelete(String(Number(id)));
    await dispatch(deleteAdmin(id)).unwrap();
    await dispatch(getAdmins()).unwrap();
    toast.success("Админ успешно удалён");
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
            onClick={() => navigate(`/admin-edit/${params.row.id}`)}
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
      </Grid>
    </Grid>
  );
};

export default AdminList;
