import {
  Anchor,
  Button,
  Container,
  createStyles,
  LoadingOverlay,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { NextLink } from '@mantine/next';
import { useForm } from '@mantine/form';
import { useToggle } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { useAuth } from '../../components/Auth/AuthProvider';

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
  const [loading, toggle] = useToggle();
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
  });

  const handleSubmit = (data: typeof form.values) => {
    toggle();
    login(data)
      .then((userData) => {
        showNotification({
          title: 'Успех',
          message: `Добро пожаловать, ${userData.username}`,
          color: 'green',
        });
        router.push('/').then(() => toggle());
      })
      .catch((e) => {
        showNotification({
          title: 'Ошибка',
          message: e.response.data.message,
          color: 'red',
        });
        toggle();
      });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Container className={classes.container} size="xs">
        <LoadingOverlay visible={loading} overlayBlur={2} />
        <Stack justify="center" align="center" sx={{ height: '100%' }}>
          <Title order={2}>Вход</Title>
          <TextInput
            label="Никнейм"
            className={classes.input}
            required
            {...form.getInputProps('username')}
          />
          <PasswordInput
            label="Пароль"
            className={classes.input}
            required
            {...form.getInputProps('password')}
          />
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

SignIn.noShell = true;
