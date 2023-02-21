import {
  Box,
  Burger,
  Code,
  createStyles,
  Group,
  Header,
  MediaQuery,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';

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
  },
  container: {
    width: '100%',
  },
}));

export function HeaderWithLogo({ opened, setOpened }: any) {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  return (
    <Header height={70} p="md" className={classes.header}>
      <Group position="apart" className={classes.container}>
        <Group>
          <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
            <Burger
              ml="xs"
              mr="sm"
              opened={opened}
              onClick={() => setOpened((o: any) => !o)}
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
        <MediaQuery smallerThan="xl" styles={{ display: 'none' }}>
          <Box>
            <ColorSchemeToggle />
          </Box>
        </MediaQuery>
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o: any) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
          />
        </MediaQuery>
      </Group>
    </Header>
  );
}
