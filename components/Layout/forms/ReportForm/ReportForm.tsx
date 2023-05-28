import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import { Button, Stack, Textarea } from '@mantine/core';
import { useAuth } from '../../../Providers/AuthContext/AuthWrapper';
import { storage } from '../../../../lib/utils';

export const ReportForm = ({
  commentId,
  configId,
  userId,
}: {
  commentId?: string;
  configId?: string;
  userId?: string;
}) => {
  const form = useForm({
    initialValues: {
      reason: '',
      commentId,
      configId,
      userId,
    },
  });

  const { user } = useAuth();

  const createReportMutation = useMutation(
    (data: typeof form.values) =>
      axios.post('/api/reports', data, {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      }),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message: 'Вы успешно отправили жалобу',
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

  const handleSubmitReport = (values: typeof form.values) => {
    createReportMutation.mutate(values);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmitReport)}>
      <Stack>
        <Textarea minRows={4} label="Содержание жалобы" placeholder="Опишитие вашу жалобу" />
        <Button type="submit">Отправить</Button>
      </Stack>
    </form>
  );
};
