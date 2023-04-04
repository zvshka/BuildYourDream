import {
  Box,
  createStyles,
  Modal,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Tooltip,
  UnstyledButton,
  getStylesRef,
} from '@mantine/core';
import { Icon3dCubeSphere, IconCpu, IconDeviceDesktop, IconUser } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useToggle } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../Providers/Auth/AuthWrapper';
import { useNavigationContext } from '../../Providers/NavigationContext/NavigationContext';

const useStyles = createStyles((theme, _params, getRef) => ({
  item: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.gray[2],
    aspectRatio: '1 / 1',
    height: '100%',
    borderRadius: theme.radius.md,
    transition: 'all ease 0.2s',
    ':hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
    },
  },

  user: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    borderRadius: theme.radius.sm,
    width: '100%',
    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[3],
    },
  },

  navbar: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'all ease-in-out',
    padding: theme.spacing.md,
    position: 'absolute',
    zIndex: 10,
  },

  title: {
    textTransform: 'uppercase',
    letterSpacing: -0.25,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    width: '100%',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,

      [`& .${getStylesRef('Icon')}`]: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      },
    },
  },

  logout: {
    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.fn.darken(
              theme.fn.variant({ variant: 'filled', color: 'red' }).background as string,
              0.2
            )
          : theme.fn.lighten(
              theme.fn.variant({ variant: 'filled', color: 'red' }).background as string,
              0.2
            ),
    },
  },

  linkIcon: {
    ref: getStylesRef('Icon'),
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      [`& .${getStylesRef('Icon')}`]: {
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      },
    },
  },

  footer: {
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    paddingTop: theme.spacing.md,
  },
}));

function NavbarLink({ item, style }: { item: any; style?: any }) {
  const { classes, cx } = useStyles();
  const router = useRouter();
  return (
    <Tooltip
      label={item.label}
      position="right"
      transitionProps={{
        duration: 0,
      }}
    >
      {/*@ts-ignore*/}
      <UnstyledButton
        className={cx(classes.link, item.classes, {
          [classes.linkActive]:
            item.link !== '/' ? router.asPath.startsWith(item.link) : item.link === router.asPath,
        })}
        {...(item.onClick
          ? { onClick: item.onClick }
          : {
              href: item.link,
              component: Link,
            })}
        style={style}
      >
        <item.Icon stroke={1.5} className={classes.linkIcon} />
      </UnstyledButton>
    </Tooltip>
  );
}

const tabs = {
  userPages: [
    { link: '/', label: 'Конфигуратор', Icon: IconCpu },
    { link: '/configs', label: 'Пользовательские сборки', Icon: IconDeviceDesktop },
    { link: '/components', label: 'Комплектующие', Icon: Icon3dCubeSphere },
  ],
  adminPages: [
    { link: '/admin/users', label: 'Пользователи', Icon: IconUser },
    { link: '/admin/configs', label: 'Сборки', Icon: Icon3dCubeSphere },
    { link: '/admin/configurator', label: 'Настройка конфигуратора', Icon: Icon3dCubeSphere },
  ],
};

//TODO: Сделать навигацию плиткой
export function NavbarSimpleColored({ opened, setOpened }: any) {
  const { classes, cx } = useStyles();
  const router = useRouter();
  const [visible, toggle] = useToggle();
  const modals = useModals();
  const { user, logout } = useAuth();
  const [section, setSection] = useState<'userPages' | 'adminPages'>('userPages');

  const navigationContext = useNavigationContext();
  const handleLogout = () => {
    modals.openConfirmModal({
      title: 'Вы уверены?',
      children: <Text size="sm">После подтверждения вам придётся войти в аккаунт снова</Text>,
      labels: { confirm: 'Конечно', cancel: 'Нет' },
      onConfirm() {
        logout();
        showNotification({
          title: 'Успех',
          message: 'Вы успешно вышли из аккаунта',
          color: 'green',
        });
      },
      onCancel() {},
    });
  };

  const links = tabs[section].map((item) => (
    <UnstyledButton
      href={item.link}
      key={item.label}
      component={Link}
      onClick={() => setOpened(false)}
      className={cx(classes.link, {
        [classes.linkActive]:
          item.link !== '/' ? router.asPath.startsWith(item.link) : item.link === router.asPath,
      })}
    >
      <item.Icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </UnstyledButton>
  ));

  return (
    <Box>
      <Modal
        title={<Title order={3}>Навигация</Title>}
        opened={navigationContext.opened}
        onClose={() => navigationContext.setClosed()}
        closeOnEscape={false}
        size="xl"
        centered
        transitionProps={{ transition: 'fade', duration: 100, timingFunction: 'linear' }}
      >
        <Stack>
          <SegmentedControl
            value={section}
            onChange={(value: 'userPages' | 'adminPages') => setSection(value)}
            transitionTimingFunction="ease"
            fullWidth
            data={[
              { label: 'User', value: 'userPages' },
              { label: 'Admin', value: 'adminPages' },
            ]}
            mb="lg"
          />
          <SimpleGrid cols={4}>
            {tabs[section].map((item) => (
              <Box component={Link} href={item.link} key={item.label}>
                <UnstyledButton
                  className={classes.item}
                  onClick={() => navigationContext.setClosed()}
                >
                  <Stack align="center" spacing="xs">
                    <item.Icon size={36} />
                    <Text align="center" weight={400}>
                      {item.label}
                    </Text>
                  </Stack>
                </UnstyledButton>
              </Box>
            ))}
          </SimpleGrid>
        </Stack>
      </Modal>
    </Box>
    // <Box>
    //   <MediaQuery styles={{ display: 'none' }} smallerThan="md">
    //     <Modal title="Навигация" opened={opened} onClose={() => setOpened(false)} centered>
    //       <Stack spacing={0}>
    //         {user?.role === 'ADMIN' && (
    //           <Navbar.Section>
    //             <SegmentedControl
    //               value={section}
    //               onChange={(value: 'userPages' | 'adminPages') => setSection(value)}
    //               transitionTimingFunction="ease"
    //               fullWidth
    //               data={[
    //                 { label: 'User', value: 'userPages' },
    //                 { label: 'Admin', value: 'adminPages' },
    //               ]}
    //               mb="lg"
    //             />
    //           </Navbar.Section>
    //         )}
    //         {links}
    //       </Stack>
    //     </Modal>
    //   </MediaQuery>
    //   <MediaQuery styles={{ display: 'none' }} largerThan="sm">
    //     <Box>
    //       <Transition transition="slide-right" mounted={opened}>
    //         {(s) => (
    //           <Box sx={{ position: 'fixed', zIndex: 5 }}>
    //             <Portal>
    //               <MediaQuery styles={{ display: 'none' }} largerThan="sm">
    //                 <Overlay
    //                   opacity={0.6}
    //                   color="#000"
    //                   zIndex={1}
    //                   onClick={() => setOpened(false)}
    //                   sx={{ position: 'fixed' }}
    //                 />
    //               </MediaQuery>
    //             </Portal>
    //             <Navbar
    //               width={{ base: 300 }}
    //               className={classes.navbar}
    //               hiddenBreakpoint="sm"
    //               style={s}
    //             >
    //               {user?.role === 'ADMIN' && (
    //                 <Navbar.Section>
    //                   <SegmentedControl
    //                     value={section}
    //                     onChange={(value: 'userPages' | 'adminPages') => setSection(value)}
    //                     transitionTimingFunction="ease"
    //                     fullWidth
    //                     data={[
    //                       { label: 'User', value: 'userPages' },
    //                       { label: 'Admin', value: 'adminPages' },
    //                     ]}
    //                   />
    //                 </Navbar.Section>
    //               )}
    //
    //               <Navbar.Section grow mt={user?.role === 'ADMIN' ? 'xl' : 0}>
    //                 {links}
    //               </Navbar.Section>
    //
    //               <Navbar.Section className={classes.footer}>
    //                 {user && (
    //                   <Box>
    //                     <Collapse in={visible}>
    //                       {opened ? (
    //                         <UnstyledButton
    //                           href="/profile"
    //                           component={NextLink}
    //                           className={classes.link}
    //                         >
    //                           <IconUser className={classes.linkIcon} stroke={1.5} />
    //                           <span>Профиль</span>
    //                         </UnstyledButton>
    //                       ) : (
    //                         <NavbarLink
    //                           item={{
    //                             link: '/profile',
    //                             label: 'Профиль',
    //                             Icon: IconUser,
    //                           }}
    //                         />
    //                       )}
    //                       <UnstyledButton
    //                         className={cx(classes.link, classes.logout)}
    //                         onClick={handleLogout}
    //                       >
    //                         <IconLogout className={classes.linkIcon} stroke={1.5} />
    //                         <span>Выйти</span>
    //                       </UnstyledButton>
    //                     </Collapse>
    //                     <UserButton
    //                       image=""
    //                       name={user.username as string}
    //                       email={user.email}
    //                       onClick={() => toggle()}
    //                     />
    //                   </Box>
    //                 )}
    //                 {!user && (
    //                   <UnstyledButton
    //                     className={classes.link}
    //                     sx={{ marginBottom: 0 }}
    //                     component={NextLink}
    //                     href="/auth/signin"
    //                   >
    //                     <IconLogout className={classes.linkIcon} stroke={1.5} />
    //                     <span>Вход</span>
    //                   </UnstyledButton>
    //                 )}
    //               </Navbar.Section>
    //             </Navbar>
    //           </Box>
    //         )}
    //       </Transition>
    //     </Box>
    //   </MediaQuery>
    // </Box>
  );
}
