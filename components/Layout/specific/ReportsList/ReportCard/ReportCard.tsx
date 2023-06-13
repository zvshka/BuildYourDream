import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Button, Stack, Text, Title } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import { useModals } from '@mantine/modals';
import { Block } from '../../../general';
import { useAuth } from '../../../../Providers/AuthContext/AuthWrapper';
import { storage } from '../../../../../lib/utils';
import { queryClient } from '../../../../Providers/QueryProvider/QueryProvider';
import { ReportModal } from '../ReportModal/ReportModal';

export const ReportCard = ({ reportData }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { openModal, openConfirmModal } = useModals();

  const handleToggle = () => {
    openModal({
      title: (
        <Text>
          Жалоба на{' '}
          {reportData.config ? 'сборку' : reportData.comment ? 'комментарий' : 'пользователя'}
        </Text>
      ),
      onClose() {
        const { showReport, ...query } = router.query;
        router.replace({
          query,
        });
      },
      size: 'lg',
      children: <ReportModal reportData={reportData} />,
    });
    router.replace({
      query: { ...router.query, showReport: reportData.id },
    });
  };

  useEffect(() => {
    if (router.query.showReport === reportData.id) {
      handleToggle();
    }
  }, []);

  const deleteReportMutation = useMutation(
    () =>
      axios.delete(`/api/reports/${reportData.id}`, {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      }),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message: 'Вы успешно удалили жалобу',
          color: 'green',
        });
        queryClient.invalidateQueries(['reports', 'list']);
        queryClient.invalidateQueries(['reports', 'list', 'my']);
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

  const handleDelete = (event) => {
    event.preventDefault();
    event.stopPropagation();
    openConfirmModal({
      title: 'Подтвердите действие',
      children: <Text>Вы собираетесь удалить жалобу, продолжить?</Text>,
      labels: {
        confirm: 'Да',
        cancel: 'Нет',
      },
      onConfirm() {
        deleteReportMutation.mutate();
      },
    });
  };

  return (
    <Block sx={{ cursor: 'pointer' }} onClick={handleToggle}>
      <Stack spacing={8}>
        <Title order={4}>
          Жалоба на{' '}
          {reportData.config ? 'сборку' : reportData.comment ? 'комментарий' : 'пользователя'}
        </Title>
        <Text>
          <Text span weight={600}>
            Автор:
          </Text>{' '}
          {reportData.author.username}
        </Text>
        <Text>
          <Text span weight={600}>
            Виновник:
          </Text>{' '}
          {reportData.user.username}
        </Text>
        <Text color={reportData.rejected ? 'red' : reportData.approved ? 'green' : 'blue'}>
          <Text span color="black" weight={600}>
            Статус:{' '}
          </Text>
          {reportData.approved
            ? 'Рассмотрена'
            : reportData.rejected
            ? 'Отклонена'
            : 'В ожидании рассмотрения'}
        </Text>
        {user && user.id === reportData.authorId && (
          <Button onClick={handleDelete} color="red">
            Удалить жалобу
          </Button>
        )}
      </Stack>
    </Block>
  );
};
