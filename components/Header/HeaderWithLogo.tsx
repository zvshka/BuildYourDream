import {
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

const useStyles = createStyles((theme) => ({
  version: {
    backgroundColor: theme.fn.lighten(
      theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background,
      0.1
    ),
    color: theme.white,
    fontWeight: 700,
  },
}));

export function HeaderWithLogo({ opened, setOpened }: any) {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  return (
    <Header height={70} p="md">
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o: any) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>

        <Group position="apart">
          <Title order={3}>
            <Text
              color={theme.colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.gray[9]}
            >
              Build Your Dream
            </Text>
          </Title>
          <Code className={classes.version}>v3.1.2</Code>
        </Group>
      </div>
    </Header>
  );
}
