import React, { useState } from 'react';
import { Pagination, Box, PaginationItem } from '@mui/material';

interface PaginationProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  columns?: number;
  rows?: number;
}

const CustomPagination = <T,>({ items, renderItem, columns = 4, rows = 5 }: PaginationProps<T>) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = columns * rows;

  const pageCount = Math.ceil(items.length / itemsPerPage);
  const paginatedItems = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const getPaginationItems = (current: number, total: number) => {
    const buttons = [];

    buttons.push(1);

    if (current > 2) {
      buttons.push(current - 1);
    }

    if (current !== 1 && current !== total) {
      buttons.push(current);
    }

    if (current < total - 1) {
      buttons.push(current + 1);
    }

    if (current < total - 1) {
      buttons.push(total);
    }

    return [...new Set(buttons)];
  };

  return (
    <Box mt={3}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
          justifyContent: 'center',
        }}
      >
        {paginatedItems.map((item) => renderItem(item))}
      </Box>
      <Box mt={3} display="flex" justifyContent="center">
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, value) => setPage(value)}
          shape="rounded"
          size="large"
          color="primary"
          renderItem={(item) => {
            const visibleItems = getPaginationItems(page, pageCount);

            if (visibleItems.includes(item.page!) || item.type === 'start-ellipsis' || item.type === 'end-ellipsis') {
              return <PaginationItem {...item} />;
            }

            return null;
          }}
        />
      </Box>
    </Box>
  );
};

export default CustomPagination;