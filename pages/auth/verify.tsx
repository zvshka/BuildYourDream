import { Container, createStyles, Stack, Title } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import { useAuth } from '../../components/Providers/AuthContext/AuthWrapper';

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

export default function VerifyPage() {
  const router = useRouter();
  const { classes } = useStyles();
  const { user, refetch } = useAuth();

  const verifyEmailMutation = useMutation(
    (code: string) => axios.get(`/api/auth/verify?code=${code}`),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message: 'Вы успешно подтвердили Email',
          color: 'green',
        });
        router.push('/');
        if (user) refetch();
      },
      onError: (err: any) => {
        showNotification({
          title: 'Ошибка',
          message: err.response.data.message || 'Что-то пошло не так',
          color: 'red',
        });
        router.push('/');
      },
    }
  );

  useEffect(() => {
    if (router.query.code && router.query.code.length > 0) {
      verifyEmailMutation.mutate(router.query.code as string);
    } else {
      router.push('/');
    }
  }, []);

  return (
    <Container className={classes.container}>
      <Stack justify="center" align="center" className={classes.wrapper}>
        <Title order={2}>:3</Title>
      </Stack>
    </Container>
  );
}

VerifyPage.noShell = true;
