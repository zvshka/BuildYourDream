import { isNotEmpty, useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import { Button, Select, Stack, Textarea } from '@mantine/core';
import { useEffect, useState } from 'react';
import { storage } from '../../../../lib/utils';

const reasons = ['Оскорбление', 'Троллинг', 'Багоюз', 'Злоупотребление полномочиями', 'Другое'];

export const ReportForm = ({
  commentId,
  configId,
  userId,
}: {
  commentId?: string;
  configId?: string;
  userId?: string;
}) => {
  const [reason, setReason] = useState('');

  const form = useForm({
    initialValues: {
      reason: '',
      reasonText: '',
      commentId,
      configId,
      userId,
    },
    validate: {
      reason: isNotEmpty('Не должно быть пустым'),
    },
  });

  useEffect(() => {
    if (form.values.reason !== 'Другое') {
      form.setFieldValue('reasonText', '');
    }
  }, [form.values.reason]);

  const createReportMutation = useMutation(
    (data: Omit<typeof form.values, 'reasonText'>) =>
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
    const { reasonText, ...report } = values;
    createReportMutation.mutate({
      ...report,
      reason: reasonText.length > 0 ? reasonText : report.reason,
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmitReport)}>
      <Stack>
        <Select
          data={reasons.map((r) => ({ value: r, label: r }))}
          label="Причина жалобы"
          withinPortal
          {...form.getInputProps('reason')}
        />
        {form.values.reason === 'Другое' && (
          <Textarea
            minRows={4}
            label="Содержание жалобы"
            required
            placeholder="Опишитие вашу жалобу"
            {...form.getInputProps('reasonText')}
          />
        )}
        <Button type="submit">Отправить</Button>
      </Stack>
    </form>
  );
};
