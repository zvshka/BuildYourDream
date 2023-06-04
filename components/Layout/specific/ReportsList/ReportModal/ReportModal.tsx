import { useForm } from '@mantine/form';
import dayjs from 'dayjs';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import {
  Anchor,
  Button,
  Divider,
  NumberInput,
  SegmentedControl,
  Stack,
  Switch,
  Text,
} from '@mantine/core';
import Link from 'next/link';
import { DatesProvider, DateTimePicker } from '@mantine/dates';
import { storage } from '../../../../../lib/utils';
import { queryClient } from '../../../../Providers/QueryProvider/QueryProvider';

export const ReportModal = ({ reportData }) => {
  const approveForm = useForm({
    initialValues: {
      warns: reportData.warns || 0,
      expiredAt: reportData.expiredAt
        ? dayjs(reportData.expiredAt).toDate()
        : dayjs().add(7, 'd').toDate(),
      deleteSubject: false,
      status: reportData.approved ? 'approve' : reportData.rejected ? 'reject' : 'reject',
    },
  });

  const approveMutation = useMutation(
    (values: Omit<typeof approveForm.values, 'status'>) =>
      axios.post(`/api/reports/${reportData.id}/approve`, values, {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      }),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message: 'Вы успешно одобрили жалобу',
          color: 'green',
        });
        queryClient.invalidateQueries(['reports', 'list']);
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
  const rejectMutation = useMutation(
    () =>
      axios.get(`/api/reports/${reportData.id}/reject`, {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      }),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message: 'Вы успешно отклонили жалобу',
          color: 'green',
        });
        queryClient.invalidateQueries(['reports', 'list']);
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

  const handleSubmit = (values: typeof approveForm.values) => {
    const { status, ...data } = values;
    if (status === 'approve') approveMutation.mutate(data);
    if (status === 'reject') rejectMutation.mutate();
  };

  return (
    <form onSubmit={approveForm.onSubmit(handleSubmit)}>
      <Stack spacing={8}>
        <Text>
          <Text span weight={600}>
            Автор:{' '}
          </Text>
          {reportData.author.username}
        </Text>
        <Text>
          <Text span weight={600}>
            Виновник:{' '}
          </Text>
          {reportData.user.username}
        </Text>
        <Text>
          <Text span weight={600}>
            Причина:{' '}
          </Text>
          {reportData.reason}
        </Text>
        <Divider />
        {reportData.comment && (
          <Stack spacing={0}>
            <Text weight={600}>Содержание комментария:</Text>
            <Text>{reportData.commentBody}</Text>
          </Stack>
        )}
        {reportData.config && (
          <Stack spacing={0}>
            <Text weight={600}>Название сборки:</Text>
            <Text>{reportData.configTitle}</Text>
            <Text weight={600}>Описание сборки:</Text>
            <Text>{reportData.configDescription}</Text>
            <Link href={`/configs/${reportData.config.id}`}>
              <Anchor>Ссылка на сборку</Anchor>
            </Link>
          </Stack>
        )}
        {reportData.user && !reportData.config && !reportData.comment && (
          <Stack spacing={0}>
            <Text weight={600}>Биография пользователя:</Text>
            <Text>{reportData.userBio || 'Нет биографии'}</Text>
            <Text weight={600}>Ссылка на аватар пользователя:</Text>
            {reportData.userAvatarUrl ? (
              <Link href={reportData.userAvatarUrl || ''}>
                <Anchor>Ссылка на аватар</Anchor>
              </Link>
            ) : (
              <Text>Нет аватара</Text>
            )}
            <Link href={`/profile/${reportData.user.username}`}>
              <Anchor>Ссылка на пользователя</Anchor>
            </Link>
          </Stack>
        )}
        <Divider />
        <SegmentedControl
          {...approveForm.getInputProps('status')}
          readOnly={reportData.approved || reportData.rejected}
          data={[
            { label: 'Отклонить', value: 'reject' },
            { label: 'Одобрить', value: 'approve' },
          ]}
        />
        {approveForm.values.status === 'approve' && (
          <Stack spacing={8}>
            <NumberInput
              label="Штрафов"
              {...approveForm.getInputProps('warns')}
              readOnly={reportData.approved || reportData.rejected}
            />
            <DatesProvider settings={{ locale: 'ru', firstDayOfWeek: 1, weekendDays: [0, 6] }}>
              <DateTimePicker
                label="Истекает"
                {...approveForm.getInputProps('expiredAt')}
                readOnly={reportData.approved || reportData.rejected}
                valueFormat="DD MMM YYYY hh:mm"
                minDate={dayjs().add(5, 'minute').toDate()}
              />
            </DatesProvider>
            {!(reportData.approved || reportData.rejected) && (
              <Switch
                label="Удалить сборку/комментарий?"
                {...approveForm.getInputProps('deleteSubject', { type: 'checkbox' })}
                disabled={!reportData.config && !reportData.comment}
              />
            )}
          </Stack>
        )}
        <Button type="submit" disabled={reportData.approved || reportData.rejected}>
          Сохранить
        </Button>
      </Stack>
    </form>
  );
};
