import React from 'react';
import Sheet from '@mui/joy/Sheet';
import ModalClose from '@mui/joy/ModalClose';
import Drawer from '@mui/joy/Drawer';
import Filters from './Filters.tsx';

interface Props {
  openMenu: boolean;
  closeMenu: () => void;
}

const FilterNavMenu: React.FC<Props> = ({ openMenu, closeMenu }) => {
  return (
    <Drawer
      anchor="left"
      size="md"
      variant="plain"
      open={openMenu}
      onClose={closeMenu}
      slotProps={{
        content: {
          sx: {
            bgcolor: "transparent",
            boxShadow: "none",
          },
        },
      }}
    >
      <Sheet
        sx={{
          borderRadius: "md",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "100%",
          overflow: "auto",
        }}
      >
        <ModalClose onClick={closeMenu} />
        <Filters/>
      </Sheet>
    </Drawer>
  );
};

export default FilterNavMenu;