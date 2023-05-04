import {
  Avatar,
  Burger,
  Button,
  Code,
  Container,
  createStyles,
  Flex,
  Grid,
  Group,
  Header,
  MediaQuery,
  Menu,
  Stack,
  Text,
  Title,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { IconLogout, IconUser } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import { useModals } from '@mantine/modals';
import { useAuth } from '../../../Providers/AuthContext/AuthWrapper';
import { useNavigationContext } from '../../../Providers/NavigationContext/NavigationContext';
import { NextLink } from '../NextLink/NextLink';

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

export function HeaderWithLogo() {
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
    <Header height={80} p="md" className={classes.header}>
      <Container size="xl" sx={{ width: '100%' }}>
        <Grid columns={3} sx={{ width: '100%' }}>
          <Grid.Col span={1}>
            <Flex sx={{ height: '100%' }} align="center">
              <MediaQuery styles={{ display: 'none' }}>
                <Burger
                  opened={navigationContext.opened}
                  onClick={() =>
                    navigationContext.opened
                      ? navigationContext.setClosed()
                      : navigationContext.setOpened()
                  }
                  size="md"
                  color={theme.colors.gray[6]}
                />
              </MediaQuery>
            </Flex>
          </Grid.Col>
          <Grid.Col span={1}>
            <Flex justify="center" sx={{ height: '100%' }} align="center">
              <Title order={1} className={classes.logo}>
                <Text
                  color={theme.colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.gray[9]}
                >
                  Build Your Dream
                </Text>
              </Title>
            </Flex>
          </Grid.Col>
          <Grid.Col span={1}>
            <MediaQuery styles={{ display: 'none' }} smallerThan="lg">
              <Flex sx={{ height: '100%' }} align="center" justify="flex-end">
                {user ? (
                  <Menu trigger="hover" openDelay={100} closeDelay={400}>
                    <Menu.Target>
                      <UnstyledButton>
                        <Group>
                          <Avatar size="md" />
                          <Stack spacing={0}>
                            <Text size={18}>{user?.username}</Text>
                            <Text size={12} color="dimmed">
                              {user.role}
                            </Text>
                          </Stack>
                        </Group>
                      </UnstyledButton>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item component={NextLink} href="/profile" icon={<IconUser size={18} />}>
                        Профиль
                      </Menu.Item>
                      <Menu.Item onClick={handleLogout} color="red" icon={<IconLogout size={18} />}>
                        Выйти
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                ) : (
                  <Button component={NextLink} href="/auth/signin">
                    Войти
                  </Button>
                )}
              </Flex>
            </MediaQuery>
          </Grid.Col>
        </Grid>
        {/*<Group position="apart" className={classes.container}>*/}
        {/*  <Group spacing={0}>*/}
        {/*    <MediaQuery styles={{ display: 'none' }}>*/}
        {/*      <Burger*/}
        {/*        mr="sm"*/}
        {/*        opened={navigationContext.opened}*/}
        {/*        onClick={() =>*/}
        {/*          navigationContext.opened*/}
        {/*            ? navigationContext.setClosed()*/}
        {/*            : navigationContext.setOpened()*/}
        {/*        }*/}
        {/*        size="sm"*/}
        {/*        color={theme.colors.gray[6]}*/}
        {/*      />*/}
        {/*    </MediaQuery>*/}
        {/*    <Group position="apart">*/}
        {/*      <Title order={3} className={classes.logo}>*/}
        {/*        <Text*/}
        {/*          color={theme.colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.gray[9]}*/}
        {/*        >*/}
        {/*          Build Your Dream*/}
        {/*        </Text>*/}
        {/*      </Title>*/}
        {/*    </Group>*/}
        {/*  </Group>*/}
        {/*  <MediaQuery styles={{ display: 'none' }} smallerThan="lg">*/}
        {/*    {user ? (*/}
        {/*      <Menu trigger="hover" openDelay={100} closeDelay={400}>*/}
        {/*        <Menu.Target>*/}
        {/*          <UnstyledButton>*/}
        {/*            <Group>*/}
        {/*              <Avatar />*/}
        {/*              <Stack spacing={0}>*/}
        {/*                <Text size={18}>{user?.username}</Text>*/}
        {/*                <Text size={10} color="dimmed">*/}
        {/*                  {user.role}*/}
        {/*                </Text>*/}
        {/*              </Stack>*/}
        {/*            </Group>*/}
        {/*          </UnstyledButton>*/}
        {/*        </Menu.Target>*/}
        {/*        <Menu.Dropdown>*/}
        {/*          <Menu.Item component={NextLink} href="/profile" icon={<IconUser size={18} />}>*/}
        {/*            Профиль*/}
        {/*          </Menu.Item>*/}
        {/*          <Menu.Item onClick={handleLogout} color="red" icon={<IconLogout size={18} />}>*/}
        {/*            Выйти*/}
        {/*          </Menu.Item>*/}
        {/*        </Menu.Dropdown>*/}
        {/*      </Menu>*/}
        {/*    ) : (*/}
        {/*      <Button component={NextLink} href="/auth/signin">*/}
        {/*        Войти*/}
        {/*      </Button>*/}
        {/*    )}*/}
        {/*  </MediaQuery>*/}
        {/*</Group>*/}
      </Container>
    </Header>
  );
}
