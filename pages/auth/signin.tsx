import {
  Anchor,
  Button,
  Container,
  createStyles,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { NextLink } from '@mantine/next';
import { useForm } from '@mantine/form';

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

export default function SignIn() {
  const { classes } = useStyles();

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
  });

  const handleSubmit = (data: typeof form.values) => {
    return;
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Container className={classes.container} size="xs">
        <Stack justify="center" align="center" sx={{ height: '100%' }}>
          <Title order={2}>Вход</Title>
          <TextInput label="Никнейм" className={classes.input} required />
          <PasswordInput label="Пароль" className={classes.input} required />
          <Button type="submit" className={classes.input}>
            Вход
          </Button>
          <Anchor component={NextLink} href="/auth/signup">
            Нет аккаунта?
          </Anchor>
          <Anchor component={NextLink} href="/">
            На главную
          </Anchor>
        </Stack>
      </Container>
    </form>
  );
}
