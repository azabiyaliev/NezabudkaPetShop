import React, { useState } from 'react';
import { ICartItem, IOrder } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Avatar,
  Box, Button, CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Popover,
  Tooltip,
  Typography
} from '@mui/material';
import ArchiveIcon from '@mui/icons-material/Archive';
import dayjs from 'dayjs';
import { ruRU } from '@mui/x-data-grid/locales';
import { apiUrl } from '../../../globalConstants.ts';
import { COLORS } from '../../../globalStyles/stylesObjects.ts';
import { NavLink } from 'react-router-dom';
import { DeliveryMethod, PaymentMethod } from '../../Order/OrderForm.tsx';
import { archiveOrder, getAllProcessingOrders } from '../../../store/orders/ordersThunk.ts';
import Swal from 'sweetalert2';
import { enqueueSnackbar } from 'notistack';

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

const OrderHistoryItem: React.FC<Props> = ({ orders }) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.orders.isLoading);
  const [popoverData, setPopoverData] = useState<{
    anchorEl: HTMLButtonElement | null;
    items: ICartItem[];
  }>({ anchorEl: null, items: [] });


  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>, itemsToShow: ICartItem[]) => {
    setPopoverData({ anchorEl: event.currentTarget, items: itemsToShow });
  };

  const handleClosePopover = () => {
    setPopoverData({ anchorEl: null, items: [] });
  };

  const isPopoverOpen = Boolean(popoverData.anchorEl);
  const popoverId = isPopoverOpen ? 'items-popover' : undefined;

  const handleArchiveOrder = async(id: string) => {
    const order = orders.find(order => order.id === Number(id));

    if (!order) {
      enqueueSnackbar('Заказ не найден', { variant: 'error' });
      return;
    }

    const isArchived = order.isArchive;
    const actionText = isArchived ? 'разархивировать' : 'архивировать';
    const successText = isArchived ? 'разархивирован' : 'архивирован';

    const result = await Swal.fire({
      title: `${isArchived ? 'Разархивировать' : 'Архивировать'} заказ?`,
      text: `Вы уверены, что хотите ${actionText} этот заказ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: COLORS.warning,
      cancelButtonColor: COLORS.OLIVE_GREEN,
      confirmButtonText: `Да, ${actionText}`,
      cancelButtonText: "Нет, оставить",
      customClass: {
        popup: 'beautiful-sweetalert',
      }
    });

    if(result.isConfirmed) {
      try {
        await dispatch(archiveOrder(id)).unwrap();
        await dispatch(getAllProcessingOrders(false));
        enqueueSnackbar(`Заказ ${id} был ${successText}`, { variant: 'success' });
      } catch {
        enqueueSnackbar(`Произошла ошибка при ${actionText} заказа`, {
          variant: 'error'
        });
      }
    }
  }

  const formatedDate = (date: Date) => {
    return dayjs(date).format('DD.MM.YYYY HH:mm');
  }

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

  const translateOrderStatus = (method: OrderStatus): string => {
    const translations: Record<string, string> = {
      [OrderStatus.Delivered]: 'Доставлен',
      [OrderStatus.Received]: 'Получен',
      [OrderStatus.Canceled]: 'Отменен',
    };
    return translations[method] || method;
  }

  const columns: GridColDef[] = [
    {
      field: 'isArchive',
      headerName: 'Архив',
      width: 100,
      headerAlign: 'center',
      sortable: true,
      align: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <Tooltip title={params.row.isArchive ? "Разархивировать" : "Архивировать"}>
              <ArchiveIcon
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                    color: params.row.isArchive ? COLORS.warning : COLORS.OLIVE_GREEN
                  },
                  color: params.row.isArchive ? COLORS.warning : undefined
                }}
                onClick={() => handleArchiveOrder(params.row.id.toString())}
              />
            </Tooltip>
          )}
        </Box>
      ),
    },
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
      width: 100,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      filterable: false,
      renderCell: (params) => {
        const statusKey = params.row.status;

        const translatedStatus = translateOrderStatus(statusKey);
        return (
        <Typography>
          {translatedStatus}
        </Typography>
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

        const total: number =
          params.row.items.reduce((acc: number, item: ICartItem) => {
            return acc + item.quantity * item.product.productPrice;
          }, 0);
        return (
          <Box>
            <Typography>
              {total} сом
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
                sortModel: [{ field: 'isArchive', sort: 'asc' }, { field: 'createdAt', sort: 'asc' }],
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
              {popoverData.items.map((cartItem: ICartItem) => (
                <ListItem
                  component={NavLink}
                  to={`/product/${cartItem.product.id}`}
                  key={cartItem.id} disableGutters
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
                      src={`${apiUrl}/${cartItem.product.productPhoto}`}
                      alt={cartItem.product.productName}
                      sx={{ width: 56, height: 56 }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                        {cartItem.product.productName}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        Кол-во: {cartItem.quantity} x {cartItem.product.productPrice.toLocaleString('ru-RU')} сом
                      </Typography>
                    }
                  />
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ ml: 2, whiteSpace: 'nowrap' }}>
                    {(cartItem.quantity * cartItem.product.productPrice).toLocaleString('ru-RU')} сом
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        </Popover>
      </Box>
    </>
  );
};

export default OrderHistoryItem;