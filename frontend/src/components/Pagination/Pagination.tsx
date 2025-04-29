import React, { useState } from 'react';
import { Pagination, Box } from '@mui/material';

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

  return (
    <Box mt={3}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
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
          showFirstButton
          showLastButton
          size="large"
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default CustomPagination;