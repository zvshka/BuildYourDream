import {
  Anchor,
  Button,
  Container,
  createStyles,
  Group,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { NextLink } from '@mantine/next';

const useStyles = createStyles(() => ({
  container: {
    height: '100vh',
  },
  wrapper: {
    height: '100%',
  },
  input: {
    width: '300px',
  },
}));

export default function SignUp() {
  const { classes } = useStyles();
  return (
    <Container className={classes.container} size="xs">
      <Stack justify="center" align="center" sx={{ height: '100%' }}>
        <Title order={2}>Регистрация</Title>
        <TextInput label="Никнейм" className={classes.input} />
        <TextInput label="Email" className={classes.input} />
        <PasswordInput label="Пароль" className={classes.input} />
        <PasswordInput label="Пароль ещё раз" className={classes.input} />
        <Button>Регистрация</Button>
        <Anchor component={NextLink} href="/">
          На главную
        </Anchor>
      </Stack>
    </Container>
  );
}
