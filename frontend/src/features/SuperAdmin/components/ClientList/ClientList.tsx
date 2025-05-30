import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ruRU } from '@mui/x-data-grid/locales';
import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { UserWithOrder } from '../../../../types';
import theme from '../../../../globalStyles/globalTheme.ts';

interface Props {
  clients: UserWithOrder[];
}

const ClientList: React.FC<Props> = ({ clients }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = clients.filter((client) =>
    client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.secondName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: GridColDef<UserWithOrder>[] = [
    { field: "id", headerName: "ID", width: 60, headerAlign: 'center', align: 'center' },
    { field: "firstName", headerName: "Имя", width: 160, headerAlign: 'center', align: 'center' },
    { field: "secondName", headerName: "Фамилия", width: 160, headerAlign: 'center', align: 'center' },
    { field: "email", headerName: "Email", width: 220, headerAlign: 'center', align: 'center' },
    { field: "phone", headerName: "Телефон", width: 160, headerAlign: 'center', align: 'center' },
    { field: "orderCount", headerName: "Заказы", width: 160, align: 'center', headerAlign: 'center' },
  ];

  useEffect(() => {
    document.title = "Список клиентов";
  }, []);

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 600,
        "@media (max-width: 1300px)": {
          mt: 5
        },}}>
        Список клиентов
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <TextField
          variant="outlined"
          label="Поиск клиента"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: "100%",
            maxWidth: "320px",
            "@media (max-width: 750px)": {
              maxWidth: "100%",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ color: theme.colors.primary }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "100%" }}>
          <DataGrid
            getRowId={(row) => row.id!}
            rows={filteredClients}
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
        </Box>
      </Box>
    </Box>
  );
};

export default ClientList;