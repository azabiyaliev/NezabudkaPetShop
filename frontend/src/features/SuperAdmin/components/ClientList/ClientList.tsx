import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { User } from '../../../../types';
import { ruRU } from '@mui/x-data-grid/locales';
import { Typography, TextField, InputAdornment } from "@mui/material";
import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

interface Props {
  clients: User[];
}

const ClientList: React.FC<Props> = ({ clients }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = clients.filter((client) =>
    client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.secondName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: GridColDef<User>[] = [
    { field: "id", headerName: "ID", width: 60 },
    { field: "firstName", headerName: "Имя", width: 130 },
    { field: "secondName", headerName: "Фамилия", width: 130 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Телефон", width: 140 },
    { field: "order", headerName: "Заказы", width: 140 },
  ];

  return (
    <div>
      <Typography
        variant="h5"
        component="div"
        sx={{ flexGrow: 1, textAlign: "center", mt: 3, mb: 3 }}
      >
        Список клиентов
      </Typography>

      <TextField
        variant="outlined"
        label="Поиск клиента"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          marginBottom: 2,
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
        InputProps={{
          endAdornment: (
            <InputAdornment position="end" sx={{ display: 'flex', alignItems: 'center' }}>
              <SearchIcon sx={{ color: "darkgreen" }} />
            </InputAdornment>
          ),
        }}
      />
      <DataGrid
        getRowId={(row) => row.id!}
        rows={filteredClients.filter((client) => client.role === 'client')}
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
        checkboxSelection
        disableRowSelectionOnClick
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        sx={{
          border: 'none',
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
        }}
      />
    </div>
  );
};

export default ClientList;
