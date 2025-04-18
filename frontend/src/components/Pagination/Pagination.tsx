import React, { useState } from 'react';
import { Pagination, Box } from '@mui/material';

interface PaginationProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

const CustomPagination = <T,>({ items, renderItem }: PaginationProps<T>) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const pageCount = Math.ceil(items.length / itemsPerPage);
  const paginatedItems = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Box mt={3} alignItems="center">
      {paginatedItems.map((item, index) => (
        <div key={index}>{renderItem(item)}</div>
      ))}
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
  );
};

export default CustomPagination;