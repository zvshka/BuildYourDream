import {
  Box,
  createStyles,
  Text,
  Image,
  LoadingOverlay,
  Paper,
  Stack,
  Title,
  Avatar,
  Group,
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

export default function ConfigPage() {
  const { classes } = useStyles();

  const [configData, setConfigData] = useState<any>();

  useEffect(() => {
    setTimeout(() => {
      setConfigData({ id: 1, title: 'CONFIG TITLE', totalPrice: 50000, description });
    }, 2000);
  }, []);

  return (
    <Stack sx={{ position: 'relative' }}>
      <LoadingOverlay visible={!configData} overlayBlur={2} />
      <Paper className={classes.container} shadow="xl">
        <Box sx={{ display: 'flex', gap: '16px' }}>
          <Stack>
            <Image height={400} width={300} withPlaceholder />
            <Group>
              <Avatar size="lg" />
              <Text>Username</Text>
            </Group>
          </Stack>
          <Box>
            <Title order={3}>{configData?.title}</Title>
            <Text>{configData?.description}</Text>
          </Box>
        </Box>
        {/*<Stack>*/}
        {/*  <Group position="apart">*/}
        {/*    <Title order={3}>{configData?.title}</Title>*/}
        {/*  </Group>*/}
        {/*  <Image height={400} width={300} withPlaceholder />*/}
        {/*</Stack>*/}
      </Paper>
    </Stack>
  );
}
