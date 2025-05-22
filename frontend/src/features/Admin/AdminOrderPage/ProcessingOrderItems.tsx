import React, { useState } from 'react';
import { IOrder, OrderItem } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { getAllProcessingOrders, updateOrderStatus } from '../../../store/orders/ordersThunk.ts';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Avatar,
  Box, Button, CircularProgress,
  List,
  ListItem,
  ListItemIcon, ListItemText,
  MenuItem,
  Popover,
  Select, Tooltip,
  Typography
} from '@mui/material';
import dayjs from 'dayjs';
import { enqueueSnackbar } from 'notistack';
import { ruRU } from '@mui/x-data-grid/locales';
import { apiUrl } from '../../../globalConstants.ts';
import { COLORS, FONTS } from '../../../globalStyles/stylesObjects.ts';
import { NavLink } from 'react-router-dom';
import { DeliveryMethod, PaymentMethod } from '../../Order/OrderForm.tsx';


interface Props {
  orders: IOrder[];
}

export enum OrderStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Packed = "Packed",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Received = "Received",
  Canceled = "Canceled",
}

const ProcessingOrderItems: React.FC<Props> = ({ orders }) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.orders.isLoading);
  const [popoverData, setPopoverData] = useState<{
    anchorEl: HTMLButtonElement | null;
    items: OrderItem[];
  }>({ anchorEl: null, items: [] });
  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>, itemsToShow: OrderItem[]) => {
    setPopoverData({ anchorEl: event.currentTarget, items: itemsToShow });
  };

  const handleClosePopover = () => {
    setPopoverData({ anchorEl: null, items: [] });
  };

  const isPopoverOpen = Boolean(popoverData.anchorEl);
  const popoverId = isPopoverOpen ? 'items-popover' : undefined;

const changeStatus = async (id: string, status: string) => {
  try {
  await dispatch(updateOrderStatus({orderId: id, updatedStatus: status}));
    enqueueSnackbar('Статус заказа обновлен', {variant: 'success'});
    dispatch(getAllProcessingOrders(true));
  } catch {
    enqueueSnackbar('Ошибка при обновлении статуса', { variant: 'error' });
  }
}

const formatedDate = (date: Date) => {
  return dayjs(date).format('DD.MM.YYYY HH:mm');
}

  const getStatusStyles = (statusValue: OrderStatus | string) => {
    switch (statusValue) {
      case OrderStatus.Pending:
        return {
          backgroundColor: '#A9D8B8',
          color: '#3A5A40',
          borderColor: '#A9D8B8',
        };
      case OrderStatus.Confirmed:
        return {
          backgroundColor: '#D4E79E',
          color: '#3A5A40',
          borderColor: '#D4E79E',
        };

      case OrderStatus.Delivered:
      case OrderStatus.Received:
        return {
          backgroundColor: '#E0E0E0',
          color: '#424242',
          borderColor: '#E0E0E0',
        };
      default:
        return {
          backgroundColor: '#F0F0F0',
          color: '#555555',
          borderColor: '#E0E0E0',
        };
    }
  };

  const translateDeliveryMethod = (method: DeliveryMethod ): string => {
    const translations: Record<string, string> = {
      [DeliveryMethod.Delivery]: "Доставкой",
      [DeliveryMethod.PickUp]: "Самовывоз",
    };
    return translations[method] || method;
  };

  const translatePaymentMethod = (method: PaymentMethod): string => {
    const translations: Record<string, string> = {
      [PaymentMethod.ByCash]: 'Наличными',
      [PaymentMethod.ByCard]: 'Картой',
    };
    return translations[method] || method;
  }

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: "ID",
    width: 50,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    filterable: false,
    renderCell: (params) => <>{params.value}</>,
    headerClassName: 'header-column',
  },
  {
    field: 'customer',
    headerName: 'Заказчик',
    width: 130,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Typography>
        {params.row.user ? params.row.user.firstName : params.row.guestName }
      </Typography>
    ),
    headerClassName: 'header-column',
  },
  {
    field: 'address',
    headerName: 'Адрес',
    width: 282,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    filterable: false,
    renderCell: (params) => {
      const deliveryMethodKey = params.row.deliveryMethod;

      const translatedDeliveryMethod = translateDeliveryMethod(deliveryMethodKey);
      return (
      <Box>
        <Typography>
          {params.value}
        </Typography>
        <Typography sx={{
          color: COLORS.OLIVE_GREEN,
        }}>
          {translatedDeliveryMethod}
        </Typography>
      </Box>
      )
    },
  },
  {
    field: 'createdAt',
    headerName: 'Дата заказа',
    width: 150,
    headerAlign: 'center',
    align: 'center',
    sortable: true,
    filterable: false,
    renderCell: (params) => (
      <Typography>
        {formatedDate(params.value)}
      </Typography>
    ),
    headerClassName: 'header-column',
  },
  {
    field: 'items',
    headerName: 'Товары',
    width: 150,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Tooltip title={`Показать товары (${params.row.items.length} шт.)`}>
        <Button
          onClick={(event) => handleOpenPopover(event, params.row.items)}
          sx={{color: COLORS.OLIVE_GREEN}}
        >
          Товары в заказе
        </Button>
      </Tooltip>
    )
  },
  {
    field: 'status',
    headerName: 'Статус заказа',
    width: 180,
    headerAlign: 'center',
    align: 'center',
    sortable: true,
    filterable: false,
    renderCell: (params) => {
      const rowStatus = params.row.status as OrderStatus;
      const statusVisualStyles = getStatusStyles(rowStatus);

      return (
        <Select
          variant="standard"
          disableUnderline
          value={params.row.status as OrderStatus}
          onChange={(e) => changeStatus(params.row.id, e.target.value as OrderStatus)}
          sx={{
            ...statusVisualStyles,
            borderRadius: '16px',
            minWidth: 120,
            height: '36px',
            textAlign: 'left',
            paddingLeft: '12px',
            paddingRight: '12px',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            '.MuiSelect-select': {
              paddingRight: '24px !important',
              paddingLeft: '0px',
              paddingTop: '0px',
              paddingBottom: '0px',
              height: '100% !important',
              display: 'flex',
              alignItems: 'center',
              boxSizing: 'border-box',
              '&:focus': {
                backgroundColor: 'transparent',
              }
            },
            '.MuiSvgIcon-root': {
              color: statusVisualStyles.color,
              right: '7px',
              fontSize: '1.25rem',
            },
            '&:hover:not(.Mui-disabled):before': {
              borderBottom: 'none',
            },
            '&:before': {
              borderBottom: 'none',
            },
            '&:after': {
              borderBottom: 'none',
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                marginTop: '4px',
              }
            }
          }}
        >
          <MenuItem value={OrderStatus.Pending}>В обработке</MenuItem>
          <MenuItem value={OrderStatus.Confirmed}>Подтвержден</MenuItem>
          <MenuItem value={OrderStatus.Packed}>Упакован</MenuItem>
          <MenuItem value={OrderStatus.Shipped}>Отправлен</MenuItem>
          <MenuItem value={OrderStatus.Delivered}>Доставлен</MenuItem>
          <MenuItem value={OrderStatus.Received}>Получен</MenuItem>
        </Select>
      );
    },
    headerClassName: 'header-column',
  },
  {
    field: 'totalPrice',
    headerName: 'Итого',
    width: 170,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    filterable: false,
    renderCell: (params) => {
      const paymentMethodKeys = params.row.paymentMethod;

      const translatedPaymentMethod = translatePaymentMethod(paymentMethodKeys);

      return (
      <Box>
        <Typography>
          {params.row.totalPrice} сом
        </Typography>
        <Typography sx={{color: COLORS.OLIVE_GREEN}}>
          {translatedPaymentMethod}
        </Typography>
      </Box>
      )
    }
  }
]
  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
    <Box sx={{
      display: 'flex',
      justifyContent: 'start',
      width: '100%',
      padding: 2,
    }}>
      <Box sx={{
        width: '100%',
        overflowX: 'auto',
        backgroundColor: "#ffffff",
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <DataGrid
        rows={orders}
        getRowId={(row) => row.id!}
        columns={columns}
        initialState={{
          sorting: {
            sortModel: [{ field: 'createdAt', sort: 'desc' }],
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
          backgroundColor: 'transparent',
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "transparent",
            borderBottom: '1px solid #e0e0e0',
          },
          "& .header-column .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
            color: '#333',
          },
          "& .MuiDataGrid-cell": {
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
          },
          '& .MuiDataGrid-row:last-child .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          "& .MuiDataGrid-footerContainer": {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderTop: '1px solid #e0e0e0',
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

      <Popover
        id={popoverId}
        open={isPopoverOpen}
        anchorEl={popoverData.anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, minWidth: 350, maxWidth: 500 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: COLORS.DARK_GREEN, mb: 2 }}>
            Товары в заказе
          </Typography>
          <List dense sx={{ maxHeight: 400, overflow: 'auto' }}>
            {popoverData.items.map((item) => (
              <>
                <ListItem
                  component={NavLink}
                  to={`/product/${item.productId}`}
                  key={item.id} disableGutters
                  sx={{
                    mb: 1.5,
                    borderBottom: '1px solid #eee',
                    pb: 1.5,
                    fontSize: '14px',
                    color: 'black',
                    cursor: 'pointer',
                    textDecoration: "none",
                    '&:hover': {
                      color: COLORS.DARK_GREEN,
                    },
                  }}>
                  <ListItemIcon sx={{ mr: 1.5, minWidth: 'auto' }}>
                    <Avatar
                      variant="rounded"
                      src={`${apiUrl}/${item.productPhoto}`}
                      alt={item.productName || ''}
                      sx={{ width: 56, height: 56 }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                        {item.productName}
                        {item.product === null ?
                          <Typography
                            sx={{
                              fontSize: { xs: FONTS.size.xs, sm: FONTS.size.sm },
                              color: COLORS.warning,
                            }}
                          >
                            Удален
                          </Typography> : null
                        }
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        Кол-во: {item.quantity} x {item.product?.productPrice.toLocaleString('ru-RU')} сом
                      </Typography>
                    }
                  />
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ ml: 2, whiteSpace: 'nowrap' }}>
                    {item.quantity} шт. × {item.sales ? item.promoPrice : item.productPrice} сом
                  </Typography>
                </ListItem>
              </>
            ))}
          </List>
        </Box>
      </Popover>
    </Box>
    </>
  );
};

export default ProcessingOrderItems;