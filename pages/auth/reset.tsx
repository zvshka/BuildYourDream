import { useRouter } from 'next/router';
import { isNotEmpty, useForm } from '@mantine/form';
import {
  Button,
  Container,
  createStyles,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';

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

const ResetForm = ({ code }: { code: string }) => {
  const router = useRouter();
  const { classes } = useStyles();
  const form = useForm({
    initialValues: {
      password: '',
      passwordConfirm: '',
    },
    validate: {
      password: (value) =>
        value.length < 6 || value.length > 20
          ? 'Длина пароля должна быть от 6 до 20 символов'
          : null,
      passwordConfirm: (value, values) =>
        value !== values.password ? 'Пароли не совпадают' : null,
    },
  });

  const resetPasswordMutation = useMutation(
    (password: string) =>
      axios.post(
        '/api/auth/reset',
        {
          password,
        },
        {
          params: { code },
        }
      ),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message: 'Вы успешно изменили пароль, теперь вы можете войти с новым паролем',
          color: 'green',
        });
        router.push('/auth/signin');
      },
      onError: (err: any) => {
        showNotification({
          title: 'Ошибка',
          message: err.response.data.message || 'Что-то пошло не так',
          color: 'red',
        });
      },
    }
  );

  const handleSubmit = (values: typeof form.values) => {
    resetPasswordMutation.mutate(values.password);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Container className={classes.container}>
        <Stack justify="center" align="center" sx={{ height: '100%' }}>
          <Title order={2}>Сброс пароля</Title>
          <PasswordInput
            className={classes.input}
            label="Новый пароль"
            required
            {...form.getInputProps('password')}
          />
          <PasswordInput
            className={classes.input}
            label="Новый пароль еще раз"
            required
            {...form.getInputProps('passwordConfirm')}
          />
          <Button className={classes.input} type="submit">
            Сохранить
          </Button>
        </Stack>
      </Container>
    </form>
  );
};

const ResetEmailForm = () => {
  const { classes } = useStyles();
  const form = useForm({
    initialValues: {
      toFind: '',
    },
    validate: {
      toFind: isNotEmpty(),
    },
  });

  const sendMailMutation = useMutation(
    (toFind: string) =>
      axios.post('/api/auth/reset/send', {
        toFind,
      }),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message:
            'Если Email или юзернейм существует в базе данных, то вам придет письмо с сылкой на почту',
          color: 'green',
        });
      },
      onError: (err: any) => {
        showNotification({
          title: 'Ошибка',
          message: err.response.data.message || 'Что-то пошло не так',
          color: 'red',
        });
      },
    }
  );

  const handleSubmit = (values: typeof form.values) => {
    sendMailMutation.mutate(values.toFind);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Container className={classes.container}>
        <Stack justify="center" align="center" sx={{ height: '100%' }}>
          <Title order={2}>Сброс пароля</Title>
          <TextInput
            className={classes.input}
            label="Email или юзернейм"
            required
            {...form.getInputProps('toFind')}
          />
          <Button type="submit" className={classes.input}>
            Отправить
          </Button>
        </Stack>
      </Container>
    </form>
  );
};

export default function ResetPage() {
  const router = useRouter();
  return router.query && router.query.code ? (
    <ResetForm code={router.query.code as string} />
  ) : (
    <ResetEmailForm />
  );
}

ResetPage.noShell = true;
