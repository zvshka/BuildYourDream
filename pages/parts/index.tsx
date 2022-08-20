import { Box, createStyles, Paper, SimpleGrid, Stack, Title, Text, Container } from '@mantine/core';
import React from 'react';
import { NextLink } from '@mantine/next';

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
}));

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

const Category = React.memo(({ data }: { data: any }) => {
  const { classes } = useStyles();
  return (
    <Paper className={classes.box} shadow="xl" component={NextLink} href={`/parts/${data.value}`}>
      <Box className={classes.boxContent}>
        <Text>{data.label}</Text>
      </Box>
    </Paper>
  );
});

export default function Parts() {
  const { classes } = useStyles();
  return (
    <Stack>
      <Paper className={classes.container} shadow="xl">
        <Title order={3}>Комплектующие</Title>
      </Paper>
      <Box>
        <Container size="xl" p={0}>
          <SimpleGrid cols={2} breakpoints={[{ minWidth: 'md', cols: 4 }]}>
            {types.map((t) => (
              <Category key={t.value} data={t} />
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    </Stack>
  );
}
