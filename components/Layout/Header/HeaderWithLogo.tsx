import {
  Avatar,
  Box,
  Burger,
  Button,
  Code,
  Container,
  createStyles,
  Group,
  Header,
  MediaQuery,
  Menu,
  Stack,
  Text,
  Title,
  UnstyledButton,
  useMantineTheme,
  getStylesRef,
} from '@mantine/core';
import { IconLogout, IconUser } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import { useModals } from '@mantine/modals';
import { useAuth } from '../../Providers/Auth/AuthWrapper';
import { useNavigationContext } from '../../Providers/NavigationContext/NavigationContext';
import Link from 'next/link';

const useStyles = createStyles((theme) => ({
  version: {
    backgroundColor: theme.fn.lighten(
      theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background as string,
      0.1
    ),
    color: theme.white,
    fontWeight: 700,
  },
  logo: {
    [theme.fn.smallerThan('sm')]: {
      fontSize: theme.fontSizes.lg,
    },
  },
  header: {
    display: 'flex',
    alignItems: 'center',
  },
  container: {
    width: '100%',
  },
}));

export function HeaderWithLogo({ opened, setOpened }: any) {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const { user, logout } = useAuth();
  const modals = useModals();

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

  const navigationContext = useNavigationContext();

  return (
    <Header height={70} py="md" px="md" className={classes.header}>
      <Container size="xl" sx={{ width: '100%' }}>
        <Group position="apart" className={classes.container}>
          <Group>
            <MediaQuery styles={{ display: 'none' }}>
              <Burger
                mr="sm"
                opened={navigationContext.opened}
                onClick={() => navigationContext.setOpened()}
                size="sm"
                color={theme.colors.gray[6]}
              />
            </MediaQuery>
            <Group position="apart">
              <Title order={3} className={classes.logo}>
                <Text
                  color={theme.colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.gray[9]}
                >
                  Build Your Dream
                </Text>
              </Title>
              <Code className={classes.version}>v3.1.3</Code>
            </Group>
          </Group>
          <MediaQuery styles={{ display: 'none' }} smallerThan="md">
            {user ? (
              <Menu trigger="hover" openDelay={100} closeDelay={400}>
                <Menu.Target>
                  <UnstyledButton>
                    <Group>
                      <Avatar />
                      <Stack spacing={0}>
                        <Text>{user?.username}</Text>
                        <Text size={10} color="dimmed">
                          {user.role}
                        </Text>
                      </Stack>
                    </Group>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item component={Link} href="/profile" icon={<IconUser size={14} />}>
                    Профиль
                  </Menu.Item>
                  <Menu.Item onClick={handleLogout} color="red" icon={<IconLogout size={14} />}>
                    Выйти
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Button component={Link} href="/auth/signin">
                Войти
              </Button>
            )}
          </MediaQuery>
        </Group>
      </Container>
    </Header>
  );
}
