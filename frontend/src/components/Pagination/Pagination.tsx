import React, { useState } from 'react';
import { Pagination, Box } from '@mui/material';
import { MEDIA_REQ } from '../../globalStyles/stylesObjects.ts';

interface PaginationProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  columns?: number;
  rows?: number;
  gap?: string;
}

const CustomPagination = <T,>({ items, renderItem, columns = 3, rows = 3, gap = '16px' }: PaginationProps<T>) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = columns * rows;

  const pageCount = items.length > 0 ? Math.ceil(items.length / itemsPerPage) : 1;
  const paginatedItems = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const gapValue = parseFloat(gap);
  const itemWidth = `calc(${100 / columns}% - ${gapValue * (columns - 1) / columns}px)`;
  const itemWidthTwoColumns = `calc(50% - ${gapValue / 2}px)`;

  return (
    <Box mt={3} width="100%">
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: gap,
          justifyContent: 'flex-start',
          [`@media (max-width: ${MEDIA_REQ.tablet.lg})`]: {
            justifyContent: 'center',
          },
        }}
      >
        {paginatedItems.map((item, index) => (
          <Box
            key={index || `paginated-item-${index}`}
            sx={{
              width: {
                [`@media (max-width: 754px)`]: {
                  width: '100%',
                },
                [`@media (min-width: 755px) and (max-width: 1154px)`]: {
                  width: itemWidthTwoColumns,
                },
                [`@media (min-width: 1155px)`]: {
                  width: itemWidth,
                },
              },
              display: 'flex',
              flexDirection: 'column',
              "@media (max-width: 754px)": {
                maxWidth: 'auto',
              },
            }}
          >
            {renderItem(item, index)}
          </Box>
        ))}
      </Box>
      {pageCount > 1 && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, value) => setPage(value)}
            shape="rounded"
            showFirstButton
            showLastButton
            size="large"
            color="primary"
            sx={{
              [`@media (max-width: ${MEDIA_REQ.mobile.lg})`]: {
                '& .MuiPaginationItem-root': {
                  minWidth: '32px',
                  height: '32px',
                },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default CustomPagination;