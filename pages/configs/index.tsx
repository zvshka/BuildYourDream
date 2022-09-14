import { useRouter } from 'next/router';
import {
  Accordion,
  Box,
  Button,
  Checkbox,
  Container,
  createStyles,
  Drawer,
  Grid,
  Group,
  MediaQuery,
  Paper,
  SimpleGrid,
  Stack,
  Title,
} from '@mantine/core';
import React from 'react';
import { useToggle } from '@mantine/hooks';
import { ConfigCard } from '../../components/ConfigCard/ConfigCard';

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
        <Title order={4}>Сортировка</Title>
      </Paper>
      <Paper className={classes.container} shadow="xl">
        <Accordion variant="filled">
          <Accordion.Item value="createdAdt">
            <Accordion.Control>Дата создания</Accordion.Control>
            <Accordion.Panel>
              <Checkbox.Group orientation="vertical">
                <Checkbox label="AMD" />
                <Checkbox label="Nvidia" />
                <Checkbox label="Intel" />
              </Checkbox.Group>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="totalPrice">
            <Accordion.Control>Общая цена</Accordion.Control>
            <Accordion.Panel>
              <Checkbox.Group orientation="vertical">
                <Checkbox label="DDR3" />
                <Checkbox label="DDR4" />
                <Checkbox label="DDR5" />
              </Checkbox.Group>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="rating">
            <Accordion.Control>Рейтинг</Accordion.Control>
            <Accordion.Panel>
              <Checkbox.Group orientation="vertical">
                <Checkbox label="DDR3" />
                <Checkbox label="DDR4" />
                <Checkbox label="DDR5" />
              </Checkbox.Group>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="totalPrice">
            <Accordion.Control>Комменатарии</Accordion.Control>
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
      <Paper className={classes.container} shadow="xl">
        <Title order={4}>Фильтрация</Title>
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
          <Title order={3}>Пользовательские сборки</Title>
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
              <SimpleGrid cols={4}>
                <ConfigCard />
                <ConfigCard />
                <ConfigCard />
                <ConfigCard />
                <ConfigCard />
              </SimpleGrid>
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
