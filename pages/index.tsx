// import { Welcome } from '../components/Welcome/Welcome';
// import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';

import {
  Container,
  createStyles,
  Paper,
  Select,
  Stack,
  Title,
  Text,
  Group,
  Avatar,
  Image,
  Box,
  Button,
  Popover,
} from '@mantine/core';
import React, { forwardRef } from 'react';

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

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  image: string;
  label: string;
  description: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, description, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Box sx={{ display: 'flex', gap: '8px' }}>
        <Image width={128} height={128} src={image} />
        <div>
          <Text>{label}</Text>
          <Text size="xs" color="dimmed" sx={{ whiteSpace: 'pre-wrap' }}>
            {description}
          </Text>
        </div>
        <Popover width={200} position="bottom" withArrow shadow="md">
          <Popover.Target>
            <Button>Toggle popover</Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Text size="sm">This is uncontrolled popover, it is opened when button is clicked</Text>
          </Popover.Dropdown>
        </Popover>
      </Box>
    </div>
  )
);

const cpus = [
  {
    label: 'Intel Core i9-9900K OEM',
    value: 'someid',
    image:
      'https://c.dns-shop.ru/thumb/st4/fit/wm/0/0/880ac5af81da96bb78f5689e86dc19d4/391eaa5903e74f53f6bf1bd71b49e9403c1afb8d514c843232d7f1fb2f20c4da.jpg.webp',
    description:
      'Базовая частота процессора: 3.6 ГГц\n' +
      'Максимальная частота в турбо режиме: 5 ГГц\n' +
      'Базовая частота энергоэффективных ядер: нет\n' +
      'Частота в турбо режиме энергоэффективных ядер: нет\n' +
      'Свободный множитель: есть',
  },
];

export default function HomePage() {
  const { classes } = useStyles();

  return (
    <Stack>
      <Paper className={classes.container} shadow="xl">
        <Title order={4}>Соберу свою мечту :3</Title>
      </Paper>
      <Paper className={classes.container} shadow="xl">
        <Container size="xs">
          <Stack>
            <Select data={cpus} label="Процессор" itemComponent={SelectItem} />
            <Select data={[]} label="Кулер" />
            <Select data={[]} label="Материнская плата" />
            <Select data={[]} label="Видеокарта" />
            <Select data={[]} label="Блок питания" />
          </Stack>
        </Container>
      </Paper>
      {/*<Welcome />*/}
      {/*<ColorSchemeToggle />*/}
    </Stack>
  );
}
