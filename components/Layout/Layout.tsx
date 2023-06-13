import React, { ReactElement, useEffect } from 'react';
import { AppShell, Text, useMantineTheme } from '@mantine/core';
import { useHotkeys, useMediaQuery } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { HeaderWithLogo } from './general';
import { NavbarModal } from './general/Navbar/NavbarModal';
import { NavbarSidebar } from './general/Navbar/NavbarSidebar';
import { useNavigationContext } from '../Providers/NavigationContext/NavigationContext';

export default function Layout({
  children,
}: {
  children: ReactElement | ReactElement[] | string | undefined;
}) {
  const theme = useMantineTheme();
  const { modals, closeAll, openModal } = useModals();
  const navigationContext = useNavigationContext();

  const smallerThanSm = useMediaQuery(theme.fn.smallerThan('sm').replace('@media', ''));

  const openNavigationModal = () => {
    if (!smallerThanSm) {
      openModal({
        id: 'navigation',
        title: <Text size="xl">Навигация</Text>,
        size: 'xl',
        centered: true,
        lockScroll: false,
        transitionProps: { transition: 'fade', duration: 100, timingFunction: 'linear' },
        children: <NavbarModal />,
      });
    } else {
      openModal({
        id: 'navigation',
        withinPortal: true,
        transitionProps: { transition: 'slide-right', duration: 100, timingFunction: 'linear' },
        withCloseButton: false,
        onClose() {
          navigationContext.handleClose();
        },
        radius: 0,
        styles: {
          inner: {
            paddingTop: 'calc(var(--mantine-header-height, 0px)) !important',
            paddingLeft: '0 !important',
            paddingBottom: '0 !important',
            justifyContent: 'start !important',
            height: '100%',
          },
          content: {
            maxHeight: '100% !important',
          },
          body: {
            padding: '0 !important',
          },
        },
        zIndex: 3,
        size: 'auto',
        children: <NavbarSidebar />,
      });
    }
  };

  useHotkeys([
    [
      'Escape',
      () => {
        if (modals.length > 0) navigationContext.handleClose();
        else navigationContext.handleOpen();
      },
    ],
  ]);

  useEffect(() => {
    navigationContext.setHandler(() => () => openNavigationModal());
  }, [smallerThanSm]);

  useEffect(() => {
    navigationContext.setCloseAll(() => () => closeAll());
  }, []);

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[2],
          paddingLeft: '16px',
        },
      }}
      header={<HeaderWithLogo />}
    >
      {children}
    </AppShell>
  );
}
