import {
  Avatar,
  Box,
  Container,
  createStyles,
  Group,
  Image,
  LoadingOverlay,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useEffect, useState } from 'react';

const useStyles = createStyles((theme) => ({
  container: {
    padding: theme.spacing.sm,
  },
  box: {
    position: 'relative',
    width: '100%',
    borderRadius: theme.radius.md,
    '&:before': {
      content: "''",
      display: 'block',
      paddingTop: '100%',
    },
  },
  boxContent: {
    position: 'absolute',
    padding: theme.spacing.sm,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  drawerButton: {
    width: '100%',
  },
}));

const description =
  'Эта великолепная сборка затащит любую игру которая может выйти в ближайшие 200 лет потому что ртх 4090 ебет райзен по шине памяти жетского диска так что вам нужна только эта сборка собирайте срочно';

const PartCard = ({ data }: any) => {
  const { classes } = useStyles();
  return (
    <Paper className={classes.container} shadow="xl" sx={{ height: 120 }}>
      CPU
    </Paper>
  );
};

export default function ConfigPage() {
  const { classes } = useStyles();

  const [configData, setConfigData] = useState<any>();

  useEffect(() => {
    setTimeout(() => {
      setConfigData({ id: 1, title: 'CONFIG TITLE', totalPrice: 50000, description });
    }, 2000);
  }, []);

  return (
    <Container size={1200}>
      <Stack sx={{ position: 'relative' }}>
        <LoadingOverlay visible={!configData} overlayBlur={2} />
        <Box p="md">
          <Box sx={{ display: 'flex', gap: '16px' }}>
            <Box>
              <Paper className={classes.container} shadow="xl">
                <Stack>
                  <Image height={300} width={300} withPlaceholder />
                  <Group>
                    <Avatar size="lg" />
                    <Text>Username</Text>
                  </Group>
                </Stack>
              </Paper>
            </Box>
            <Stack>
              <Paper className={classes.container} shadow="xl">
                <Title order={3}>{configData?.title}</Title>
                <Text>{configData?.description}</Text>
              </Paper>
              <Stack>
                <SimpleGrid cols={6}>
                  <PartCard />
                  <PartCard />
                  <PartCard />
                  <PartCard />
                  <PartCard />
                  <PartCard />
                  <PartCard />
                </SimpleGrid>
              </Stack>
            </Stack>
          </Box>
          {/*<Stack>*/}
          {/*  <Group position="apart">*/}
          {/*    <Title order={3}>{configData?.title}</Title>*/}
          {/*  </Group>*/}
          {/*  <Image height={400} width={300} withPlaceholder />*/}
          {/*</Stack>*/}
        </Box>
      </Stack>
    </Container>
  );
}
