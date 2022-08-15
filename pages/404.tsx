import { Button, Container, createStyles, Group, Text, Title } from '@mantine/core';
import Shell from '../components/Shell/Shell';

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 80,
    paddingBottom: 80,
  },

  label: {
    textAlign: 'center',
    fontWeight: 900,
    fontSize: 220,
    lineHeight: 1,
    marginBottom: theme.spacing.xl * 1.5,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.dark[4],

    [theme.fn.smallerThan('sm')]: {
      fontSize: 120,
    },
  },

  title: {
    textAlign: 'center',
    fontWeight: 900,
    fontSize: 38,

    [theme.fn.smallerThan('sm')]: {
      fontSize: 32,
    },
  },

  description: {
    maxWidth: 500,
    margin: 'auto',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl * 1.5,
  },
}));

export default function NotFoundTitle() {
  const { classes } = useStyles();

  return (
    <Shell>
      <Container className={classes.root}>
        <div className={classes.label}>404</div>
        <Title className={classes.title}>Страница не найдена.</Title>
        <Text color="dimmed" size="lg" align="center" className={classes.description}>
          Вероятно, Вы ошиблись при вводе URL-адреса, либо запрашиваемая страница была перемещена на другой URL-адрес.
        </Text>
        <Group position="center">
          <Button variant="subtle" size="md">
            Вернуться на главную страницу
          </Button>
        </Group>
      </Container>
    </Shell>
  );
}
