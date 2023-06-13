import { Box, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import React from 'react';
import { NavbarModal } from './NavbarModal';
import { NavbarSidebar } from './NavbarSidebar';

export function NavbarSimpleColored() {
  const theme = useMantineTheme();

  const smallerThanSm = useMediaQuery(theme.fn.smallerThan('sm').replace('@media', ''));
  return (
    <Box sx={{ position: 'relative' }}>
      {!smallerThanSm && <NavbarModal />}
      {smallerThanSm && <NavbarSidebar />}
    </Box>
  );
}
