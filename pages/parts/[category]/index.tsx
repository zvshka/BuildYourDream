import { useRouter } from 'next/router';
import {
  Accordion,
  Box,
  Checkbox,
  createStyles,
  Grid,
  Paper,
  Stack,
  TextInput,
  Title,
  Button,
  Container,
  Drawer,
  MediaQuery,
  Group,
} from '@mantine/core';
import React from 'react';
import { useToggle } from '@mantine/hooks';

const types = [
  { label: 'Видеокарты', value: 'gpus' },
  { label: 'Материнские платы', value: 'motherboards' },
  { label: 'Процессоры', value: 'cpus' },
  { label: 'Оперативная память', value: 'ram' },
  { label: 'Блоки питания', value: 'psu' },
  { label: 'Корпуса', value: 'cases' },
  { label: 'Охлаждение', value: 'coolers' },
  { label: 'Накопители', value: 'drives' },
];

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

const Filters = () => {
  const { classes } = useStyles();
  return (
    <Stack>
      <Paper className={classes.container} shadow="xl">
        <TextInput />
      </Paper>
      <Paper className={classes.container} shadow="xl">
        <Accordion variant="filled">
          <Accordion.Item value="manufacturer">
            <Accordion.Control>Произовдитель</Accordion.Control>
            <Accordion.Panel>
              <Checkbox.Group orientation="vertical">
                <Checkbox label="AMD" />
                <Checkbox label="Nvidia" />
                <Checkbox label="Intel" />
              </Checkbox.Group>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="memory_type">
            <Accordion.Control>Тип памяти</Accordion.Control>
            <Accordion.Panel>
              <Checkbox.Group orientation="vertical">
                <Checkbox label="DDR3" />
                <Checkbox label="DDR4" />
                <Checkbox label="DDR5" />
              </Checkbox.Group>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Paper>
    </Stack>
  );
};

export default function Category() {
  const router = useRouter();
  const { classes } = useStyles();
  const [showFilters, toggleFilters] = useToggle();

  return (
    <Stack>
      <Paper className={classes.container} shadow="xl">
        <Group position="apart">
          <Title order={3}>{types.find((t) => t.value === router.query.category)?.label}</Title>
          <Button sx={{ height: '28px' }} onClick={() => router.push('/parts')}>
            Назад
          </Button>
        </Group>
      </Paper>
      <Box>
        <Container size={1600} p={0}>
          <Grid>
            <Grid.Col lg={3}>
              <MediaQuery smallerThan="lg" styles={{ display: 'none' }}>
                <Box>
                  <Filters />
                </Box>
              </MediaQuery>
              <MediaQuery largerThan="lg" styles={{ display: 'none' }}>
                <Paper className={classes.container} shadow="xl">
                  <Button onClick={() => toggleFilters()} className={classes.drawerButton}>
                    Показать фильтры
                  </Button>
                </Paper>
              </MediaQuery>
            </Grid.Col>
            <Grid.Col lg={9}>
              {/*<Stack>*/}
              {/*  <Paper className={classes.container} shadow="xl">*/}
              {/*    Что-то*/}
              {/*  </Paper>*/}
              {/*  <Paper className={classes.container} shadow="xl">*/}
              {/*    Что-то*/}
              {/*  </Paper>*/}
              {/*  <Paper className={classes.container} shadow="xl">*/}
              {/*    Что-то*/}
              {/*  </Paper>*/}
              {/*  <Paper className={classes.container} shadow="xl">*/}
              {/*    Что-то*/}
              {/*  </Paper>*/}
              {/*  <Paper className={classes.container} shadow="xl">*/}
              {/*    Что-то*/}
              {/*  </Paper>*/}
              {/*  <Paper className={classes.container} shadow="xl">*/}
              {/*    Что-то*/}
              {/*  </Paper>*/}
              {/*</Stack>*/}
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
      <Drawer
        opened={showFilters}
        onClose={() => toggleFilters()}
        title="Фильтры и поиск"
        padding="xl"
        size="xl"
      >
        <Filters />
      </Drawer>
    </Stack>
  );
}
